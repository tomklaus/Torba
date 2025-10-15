import { deleteTextEntry } from '../../../../lib/textOperations';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await deleteTextEntry(id);
    return new Response(JSON.stringify({ message: 'Text entry deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting text entry:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete text entry' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
