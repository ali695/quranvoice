import { NextResponse } from 'next/server';

export function ok<T>(data: T, init: { revalidate?: number } = {}): NextResponse {
  const res = NextResponse.json({ data });
  if (init.revalidate !== undefined) {
    res.headers.set('Cache-Control', `s-maxage=${init.revalidate}, stale-while-revalidate=60`);
  }
  return res;
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: { message } }, { status: 400 });
}

export function notFound(message = 'Not found'): NextResponse {
  return NextResponse.json({ error: { message } }, { status: 404 });
}

export function serverError(message = 'Internal server error'): NextResponse {
  return NextResponse.json({ error: { message } }, { status: 500 });
}

export function parseIntParam(value: string, min: number, max: number): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}
