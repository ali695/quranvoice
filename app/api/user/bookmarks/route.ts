import { NextResponse } from 'next/server';

/**
 * User bookmarks endpoint placeholder.
 * Bookmarks live in the browser (localStorage) until account sync ships.
 * This endpoint is reserved for future authenticated sync — returning
 * 501 makes the contract explicit.
 */
export async function GET() {
  return NextResponse.json(
    {
      error: {
        message:
          'User bookmark sync is not yet enabled. Bookmarks are stored on the device.',
        code: 'sync-not-enabled',
      },
    },
    { status: 501 },
  );
}

export async function POST() {
  return GET();
}
