import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("IN GET");
  try {
    const albums = [
      { id: "1", title: "Test Album", artist: "Test Artist", year: 2024 },
    ];
    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
  }
}
