import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'YouTube API Key is not configured' }, { status: 500 });
  }

  try {
    // Fetching popular music videos as "Recommendations"
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=20&videoCategoryId=10&key=${API_KEY}`
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'YouTube API error' },
        { status: response.status }
      );
    }

    const results = data.items
      .filter((item: any) => item.id)
      .map((item: any) => ({
        id: typeof item.id === 'string' ? item.id : item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Recommendations API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
