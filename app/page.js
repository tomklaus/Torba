'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [textEntries, setTextEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Load entries when the component mounts
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await fetch('/api/text');
        const entries = await response.json();
        setTextEntries(entries);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setMessage('Please enter some text');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      // Save the new text entry via API
      const response = await fetch('/api/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: inputText }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save text');
      }
      
      const newEntry = await response.json();
      
      // Update the local state to include the new entry
      setTextEntries([newEntry, ...textEntries]);
      
      // Clear the input field
      setInputText('');
      
      setMessage('Text saved successfully!');
    } catch (error) {
      console.error('Error saving text:', error);
      setMessage(error.message || 'Error saving text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Torba Text Storage</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="textInput">Enter your text:</label>
          <textarea
            id="textInput"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your text here..."
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Text'}
        </button>
      </form>
      
      {message && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e9',
          border: `1px solid ${message.includes('Error') ? '#f44336' : '#4caf50'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
      
      <div className="text-history">
        <h2>Previous Entries</h2>
        {textEntries.length === 0 ? (
          <p>No entries yet. Be the first to save some text!</p>
        ) : (
          <div>
            {textEntries.map((entry) => (
              <div key={entry.id} className="text-item">
                <p>{entry.content}</p>
                <small>Created: {new Date(entry.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
