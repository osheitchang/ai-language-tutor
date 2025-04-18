import React, { useState } from 'react';
import axios from 'axios';

const Practice = () => {
  const [sentence, setSentence] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/practice', { sentence }, { headers: { 'Authorization': `Bearer ${token}` } });
      setFeedback(response.data.feedback);
    } catch (err) {
      console.log('Error getting feedback:', err);
    }
  };

  return (
    <div>
      <h1>Practice Your Sentence</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          placeholder="Type your sentence here..."
        />
        <button type="submit">Submit</button>
      </form>

      {feedback && (
        <div>
          <h3>Feedback:</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default Practice;
