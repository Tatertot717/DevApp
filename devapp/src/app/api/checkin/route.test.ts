/**
 * @jest-environment node
 */

// fails due to not having auth0 lib access.

import { POST } from './route';
import { query } from '@/lib/db';
import { isTokenValid } from '@/lib/token';
import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('@/lib/db');
jest.mock('@/lib/token');
jest.mock('@/lib/auth0');

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockIsTokenValid = isTokenValid as jest.MockedFunction<typeof isTokenValid>;
const mockGetSession = auth0.getSession as jest.MockedFunction<typeof auth0.getSession>;

describe('Integration: POST /api/checkin', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 404 when location not found', async () => {
    mockQuery.mockResolvedValueOnce([]);

    const req = new NextRequest('http://localhost/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'bad', token: 't', name: 'n' }),
    });

    const res = (await POST(req as any)) as NextResponse;
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ message: 'Invalid location.' });
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT id, realtime_auth FROM locations WHERE slug = ?',
      ['bad']
    );
  });

  it('returns 400 for invalid token', async () => {
    mockQuery.mockResolvedValueOnce([{ id: 1, realtime_auth: 0 }]);
    mockIsTokenValid.mockReturnValue(false);

    const req = new NextRequest('http://localhost/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'loc', token: 'bad', name: 'User' }),
    });

    const res = (await POST(req as any)) as NextResponse;
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: 'Invalid or expired token.' });
    expect(mockIsTokenValid).toHaveBeenCalledWith('loc', 'bad', 15);
  });

  it('returns 401 when realtime_auth requires session', async () => {
    mockQuery.mockResolvedValueOnce([{ id: 2, realtime_auth: 1 }]);
    mockIsTokenValid.mockReturnValue(true);
    mockGetSession.mockResolvedValueOnce(null);

    const req = new NextRequest('http://localhost/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'secure', token: 'tok', name: 'User' }),
    });

    const res = (await POST(req as any)) as NextResponse;
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ message: 'Unauthorized.' });
  });

  it('inserts check-in and returns 200', async () => {
    mockQuery
      .mockResolvedValueOnce([{ id: 3, realtime_auth: 0 }]) // select
      .mockResolvedValueOnce(undefined); // insert
    mockIsTokenValid.mockReturnValue(true);

    const req = new NextRequest('http://localhost/api/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '9.9.9.9'
      },
      body: JSON.stringify({ slug: 'ok', token: 'tok', name: 'Alice' }),
    });

    const res = (await POST(req as any)) as NextResponse;
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'Check-in successful!' });

    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenLastCalledWith(
      expect.stringContaining('INSERT INTO check_ins'),
      [null, 'Alice', 3, '9.9.9.9']
    );
  });
});
