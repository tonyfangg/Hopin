import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json({ message: 'Auth endpoint' })
} 