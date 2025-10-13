import { NextResponse } from 'next/server';
import { initializeTable, saveText, getTextEntries } from '../../../lib/textOperations';

export async function GET() {
  try {
    await initializeTable();
    const entries = await getTextEntries();
    
    // If running locally without DB, return empty array
    if (!entries) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching text entries:', error.message);
    // For local development, return empty array instead of error
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: 'Failed to fetch text entries' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initializeTable();
    const { content } = await request.json();
    
    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    const newEntry = await saveText(content);
    
    // If running locally without DB, return a mock entry
    if (!newEntry) {
      return NextResponse.json({
        id: Date.now(),
        content: content,
        created_at: new Date().toISOString()
      });
    }
    
    return NextResponse.json(newEntry);
  } catch (error) {
    console.error('Error saving text:', error.message);
    // For local development, return mock data instead of error
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({
        id: Date.now(),
        content: content,
        created_at: new Date().toISOString()
      });
    }
    return NextResponse.json({ error: 'Failed to save text' }, { status: 500 });
  }
}
