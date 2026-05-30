import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      error: {
        message: 'User progress sync is not yet enabled.',
        code: 'sync-not-enabled',
      },
    },
    { status: 501 },
  );
}

export async function POST() {
  return GET();
}
