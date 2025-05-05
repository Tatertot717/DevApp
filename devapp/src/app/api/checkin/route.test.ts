
/** @jest-environment jsdom */

import { POST } from './route';
import { query } from '@/lib/db';
import { isTokenValid } from '@/lib/token';
import { auth0 } from '@/lib/auth0';

jest.mock('@/lib/db');
jest.mock('@/lib/token');
jest.mock('@/lib/auth0');

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockIsTokenValid = isTokenValid as jest.MockedFunction<typeof isTokenValid>;
const mockGetSession = auth0.getSession as jest.MockedFunction<
  typeof auth0.getSession
>;

describe('POST /api/checkin', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 404 when location is not found', async () => {
    mockQuery.mockResolvedValueOnce([]); // SELECT returns no rows

    const req = new Request('http://localhost/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'unknown', token: 'foo', name: 'Bar' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(404);

    const body = await res.json();
    expect(body).toEqual({ message: 'Invalid location.' });
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT id, realtime_auth FROM locations WHERE slug = ?',
      ['unknown']
    );
  });

  it('returns 400 when token is invalid or expired', async () => {
    // First SELECT returns one row with realtime_auth = false (0)
    mockQuery.mockResolvedValueOnce([{ id: 123, realtime_auth: 0 }]);
    mockIsTokenValid.mockReturnValue(false);

    const req = new Request('http://localhost/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'loc', token: 'badtoken', name: 'Bar' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body).toEqual({ message: 'Invalid or expired token.' });
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockIsTokenValid).toHaveBeenCalledWith('loc', 'badtoken', 15);
  });

  it('inserts a new check-in and returns 200 for a valid request (no realtime_auth)', async () => {
    // SELECT returns one row with realtime_auth = false
    mockQuery
      .mockResolvedValueOnce([{ id: 42, realtime_auth: 0 }]) // for SELECT
      .mockResolvedValueOnce(undefined); // for INSERT

    mockIsTokenValid.mockReturnValue(true);

    const payload = { slug: 'myloc', token: 'goodtok', name: 'Alice' };
    const req = new Request('http://localhost/api/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // simulate x-forwarded-for
        'x-forwarded-for': '1.2.3.4',
      },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({ message: 'Check-in successful!' });

    // Two queries: one SELECT, one INSERT
    expect(mockQuery).toHaveBeenCalledTimes(2);

    // verify INSERT call shape
    expect(mockQuery).toHaveBeenLastCalledWith(
      expect.stringContaining('INSERT INTO check_ins'),
      [null, 'Alice', 42, '1.2.3.4']
    );
  });

  it('requires a session when realtime_auth is true', async () => {
    // SELECT returns one row with realtime_auth = true
    mockQuery.mockResolvedValueOnce([{ id: 7, realtime_auth: 1 }]);
    mockIsTokenValid.mockReturnValue(true);
    mockGetSession.mockResolvedValueOnce(null);

    const req = new Request('http://localhost/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'secure', token: 'tok', name: 'Ignored' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body).toEqual({ message: 'Unauthorized.' });
  });
});
