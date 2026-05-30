import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      error: {
        message:
          'User notes sync is not yet enabled. Notes are stored privately on the device.',
        code: 'sync-not-enabled',
      },
    },
    { status: 501 },
  );
}

export async function POST() {
  return GET();
}
