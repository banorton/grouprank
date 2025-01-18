import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPoll } from '../services/pollService';
import './CreatePollPage.css';
import { FaTrash } from 'react-icons/fa';

const CreatePollPage = () => {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Validate inputs
        const trimmedTitle = title.trim();
        const trimmedOptions = options.map(option => option.trim()).filter(option => option !== '');

        if (trimmedTitle === '') {
            setErrorMessage('Please enter a poll title.');
            return;
        }

        if (trimmedOptions.length < 2) {
            setErrorMessage('Please enter at least two options.');
            return;
        }

        // Prepare poll data
        const pollData = {
            title: trimmedTitle,
            options: trimmedOptions.map(option => ({ name: option }))
        };

        setIsSubmitting(true);

        try {
            // Send poll data to backend and receive the response
            const response = await createPoll(pollData);

            // Make sure pollId exists in the response
            if (response && response.pollId) {
                // Navigate to PollPage.js using pollId
                navigate(`/poll/${response.pollId}`, { state: { isCreator: true } });
            } else {
                setErrorMessage('Poll creation failed: Missing poll ID.');
            }
        } catch (error) {
            console.error('Error creating poll:', error);
            setErrorMessage('An error occurred while creating the poll.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-poll-page">
            <div className="form-container">
                <h1 className="create-poll-title">Create a Poll</h1>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Poll Title"
                            required
                            className="input-field"
                        />
                        {options.map((option, index) => (
                            <div key={index} className="option-input-container">
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    required
                                    className="input-field option-input"
                                />
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="remove-option-button"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addOption}
                            className="button"
                        >
                            Add Option
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="button create-poll-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePollPage;
