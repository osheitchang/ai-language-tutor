import {motion} from 'framer-motion';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Practice = () => {
    const [sentence, setSentence] = useState('');
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setError('Please log in to practice');
            // Optionally redirect to login page
            // navigate('/login');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setError('Please log in to practice');
            return;
        }

        try {
            const response = await axios.post('/api/practice', {sentence}, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            setFeedback(response.data.feedback);
            setError('');
        } catch (err) {
            console.log(`Error getting feedback: ${err}`);
            setError('Error submitting practice. Please try again.');
            if (err.response?.status === 401) {
                setError('Session expired. Please log in again.');
                // Optionally redirect to login page
                // navigate('/login');
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Practice your sentence here</h1>
            {error && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity:1}}
                    exit={{opacity:0}}
                    transition={{duration:0.3}}
                    className="bg-red-100 p-4 rounded-lg mt-4"
                >
                    <p className="text-red-800">{error}</p>
                </motion.div>
            )}
            <form onSubmit={handleSubmit} className="mb-4">
                <textarea
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    placeholder="Type your sentence here..."
                    className="w-full p-2 border rounded-md mb-4"
                    disabled={!token}
                />
                <button 
                    type="submit" 
                    className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-md"
                    disabled={!token}
                >
                    Submit
                </button>
            </form>
            {feedback && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity:1}}
                    exit={{opacity:0}}
                    transition={{duration:0.3}}
                    className="bg-green-100 p-4 rounded-lg mt-4"
                >
                    <h3 className="text-lg font-bold mb-2">Feedback:</h3>
                    <p className="text-gray-800">{feedback}</p>
                </motion.div>
            )}
        </div>
    );
};

export default Practice;