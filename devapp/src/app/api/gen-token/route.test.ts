/**
 * @jest-environment node
 */

import { GET } from './route';
import { generateToken } from '@/lib/token';
import { NextRequest } from 'next/server';

// No mocks for NextRequest/NextResponse — using real Next.js runtime for integration-style tests
jest.mock('@/lib/token');
const mockGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>;

describe('Integration: GET /api/gen-token', () => {
  beforeAll(() => {
    // Freeze Date.now() to a fixed value (30 seconds past epoch)
    jest.spyOn(Date, 'now').mockImplementation(() => 30000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('returns 400 when slug is missing', async () => {
    const req = new NextRequest('http://localhost/api/gen-token');
    const res = await GET(req);

    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toBe('Missing slug');
  });

  it('generates token with default interval', async () => {
    mockGenerateToken.mockReturnValue('tok-default');
    const req = new NextRequest('http://localhost/api/gen-token?slug=my-loc');
    const res = await GET(req);

    // Real NextResponse.json populates status and JSON body
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ token: 'tok-default' });

    // Ensure token generator was used correctly
    expect(mockGenerateToken).toHaveBeenCalledWith('my-loc', 2);
  });

  it('generates token with custom interval', async () => {
    mockGenerateToken.mockReturnValue('tok-custom');
    const req = new NextRequest('http://localhost/api/gen-token?slug=abc&interval=10');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ token: 'tok-custom' });

    expect(mockGenerateToken).toHaveBeenCalledWith('abc', 3);
  });
});
