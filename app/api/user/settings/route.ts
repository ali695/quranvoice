import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      error: {
        message: 'Settings sync is not yet enabled. Settings live on the device.',
        code: 'sync-not-enabled',
      },
    },
    { status: 501 },
  );
}

export async function POST() {
  return GET();
}
