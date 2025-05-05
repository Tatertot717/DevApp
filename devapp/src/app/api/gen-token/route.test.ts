/**
 * @jest-environment jsdom
 */

import { GET } from './route';
import { generateToken } from '@/lib/token';
import { NextRequest } from 'next/server';

jest.mock('@/lib/token');
const mockGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>;

describe('GET /api/gen-token', () => {
  beforeAll(() => {
    // Freeze Date.now() to a fixed value (30 seconds past epoch)
    jest.spyOn(Date, 'now').mockImplementation(() => 30000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 400 when slug is missing', async () => {
    const url = new URL('http://localhost/api/gen-token');
    const req = new NextRequest(url.toString());
    const res = await GET(req);

    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toBe('Missing slug');
  });

  it('generates token with default interval', async () => {
    mockGenerateToken.mockReturnValue('tok-default');
    const url = new URL('http://localhost/api/gen-token?slug=my-loc');
    const req = new NextRequest(url.toString());

    const res = await GET(req);
    expect(mockGenerateToken).toHaveBeenCalledWith('my-loc', 2);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ token: 'tok-default' });
  });

  it('generates token with custom interval', async () => {
    mockGenerateToken.mockReturnValue('tok-custom');
    const url = new URL('http://localhost/api/gen-token?slug=abc&interval=10');
    const req = new NextRequest(url.toString());

    const res = await GET(req);
    expect(mockGenerateToken).toHaveBeenCalledWith('abc', 3);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ token: 'tok-custom' });
  });
});