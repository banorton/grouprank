import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getPoll, submitRankings, endPoll, getPollResults } from '../services/pollService';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './PollPage.css';

const ItemType = 'OPTION';

const PollPage = () => {
    const { id } = useParams(); // Get the poll ID from the URL
    const location = useLocation(); // Access any state passed via navigation
    const [poll, setPoll] = useState(null); // State for the poll data
    const [rankings, setRankings] = useState([]); // State to store rankings
    const [isCreator, setIsCreator] = useState(false); // Track if the user is the creator
    const [submitted, setSubmitted] = useState(false); // Track if rankings have been submitted
    const [pollEnded, setPollEnded] = useState(false); // Track if the poll has ended
    const [finalRankings, setFinalRankings] = useState([]); // Store final rankings

    const pollLink = location.state?.pollLink || `${window.location.origin}/poll/${id}`;

    // Fetch the poll data when the page loads
    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const data = await getPoll(id); // Fetch the poll data from the backend
                setPoll(data);
                setRankings(data.options);  // Initialize rankings with poll options
                setPollEnded(data.isFinished);
            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };
        fetchPoll();

        // Check if the user is the creator
        if (location.state?.isCreator) {
            setIsCreator(true);
        }
    }, [id, location.state]);

    // Polling to check if poll has ended
    useEffect(() => {
        if (!pollEnded) {
            const interval = setInterval(async () => {
                try {
                    const data = await getPoll(id);
                    if (data.isFinished) {
                        setPollEnded(true);
                        clearInterval(interval);
                    }
                } catch (error) {
                    console.error('Error checking poll status:', error);
                    clearInterval(interval);
                }
            }, 5000);

            return () => clearInterval(interval); // Clean up on unmount
        }
    }, [pollEnded, id]);

    // Fetch final rankings when poll ends
    useEffect(() => {
        if (pollEnded) {
            const fetchFinalRankings = async () => {
                try {
                    const results = await getPollResults(id);
                    setFinalRankings(results);
                } catch (error) {
                    console.error('Error fetching final rankings:', error);
                }
            };

            fetchFinalRankings();
        }
    }, [pollEnded, id]);

    // Handle ranking changes
    const moveOption = (dragIndex, hoverIndex) => {
        const updatedRankings = [...rankings];
        const [removed] = updatedRankings.splice(dragIndex, 1);
        updatedRankings.splice(hoverIndex, 0, removed);
        setRankings(updatedRankings);
    };

    const handleSubmitRankings = async () => {
        const rankedOptions = rankings.map((option, index) => ({
            optionId: option.id,
            rank: index + 1
        }));
        console.log("Ranked Options:", rankedOptions);

        try {
            await submitRankings(id, rankedOptions);
            console.log('Rankings submitted successfully');
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting rankings:', error);
        }
    };

    // Handle ending the poll
    const handleEndPoll = async () => {
        try {
            await endPoll(id);
            console.log('Poll ended successfully');
            setPollEnded(true);
        } catch (error) {
            console.error('Error ending poll:', error);
        }
    };

    const PollOption = ({ option, index, moveOption }) => {
        const [{ isDragging }, dragRef] = useDrag({
            type: ItemType,
            item: { index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        const [, dropRef] = useDrop({
            accept: ItemType,
            hover: (draggedItem) => {
                if (draggedItem.index !== index) {
                    moveOption(draggedItem.index, index);
                    draggedItem.index = index;
                }
            },
        });

        return (
            <li
                ref={(node) => dragRef(dropRef(node))}
                className={`poll-option ${isDragging ? 'dragging' : ''}`}
            >
                {option.name}
            </li>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="poll-page">
                {/* Main Poll and Ranking Section */}
                <div className="poll-content">
                    {poll ? (
                        <div className="poll-container">
                            <h1 className="poll-title">{poll.title}</h1>
                            {pollEnded ? (
                                // Final Rankings Display
                                <div className="final-rankings">
                                    <h2>Final Rankings:</h2>
                                    {finalRankings.length > 0 ? (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Rank</th>
                                                    <th>Option</th>
                                                    <th>Average Rank</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {finalRankings.map((option, index) => (
                                                    <tr key={option.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{option.name}</td>
                                                        <td>
                                                            {option.averageRank === Number.MAX_VALUE ? 'N/A' : option.averageRank.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>No rankings available.</p>
                                    )}
                                </div>
                            ) : submitted ? (
                                <p className="submitted-message">Ranking Submitted!</p>
                            ) : (
                                <>
                                    {/* Instructions */}
                                    <p className="poll-instructions">
                                        Drag and drop the options to rank them in order of preference.
                                    </p>
                                    {/* Draggable Options Container */}
                                    <div className="options-container">
                                        <ul className="options-list">
                                            {rankings.map((option, index) => (
                                                <PollOption
                                                    key={option.id}
                                                    option={option}
                                                    index={index}
                                                    moveOption={moveOption}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        onClick={handleSubmitRankings}
                                        className="button"
                                    >
                                        Submit Rankings
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <p>Loading poll...</p>
                    )}
                </div>

                {/* Sidebar for Poll Link and End Poll Button */}
                <div className="sidebar">
                    <div>
                        <h3>Share Poll Link</h3>
                        <div className="share-link-container">
                            <input
                                type="text"
                                value={pollLink}
                                readOnly
                                className="share-link-input"
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(pollLink);
                                }}
                                className="copy-link-button"
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>
                    {isCreator && !pollEnded && (
                        <button
                            onClick={handleEndPoll}
                            className="end-poll-button"
                        >
                            End Poll
                        </button>
                    )}
                </div>
            </div>
        </DndProvider>
    );
};

export default PollPage;
