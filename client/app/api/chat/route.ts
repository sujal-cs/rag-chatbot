import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  if (!q) {
    return NextResponse.json({ error: 'Query missing' }, { status: 400 });
  }

  try {
    // forward to your Express backend
    const backendRes = await fetch(
      `http://localhost:8000/chat?q=${encodeURIComponent(q)}`
    );
    const data = await backendRes.json();
    return NextResponse.json({ message: data.message, docs: data.docs });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Backend fetch error', details: err.message },
      { status: 500 }
    );
  }
}
