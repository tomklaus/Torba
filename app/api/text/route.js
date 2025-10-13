import { NextResponse } from 'next/server';
import { initializeTable, saveText, getTextEntries } from '../../../lib/textOperations';

export async function GET() {
  try {
    await initializeTable();
    const entries = await getTextEntries();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching text entries:', error);
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
    return NextResponse.json(newEntry);
  } catch (error) {
    console.error('Error saving text:', error);
    return NextResponse.json({ error: 'Failed to save text' }, { status: 500 });
  }
}
