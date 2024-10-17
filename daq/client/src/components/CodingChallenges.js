import React, { useState, useEffect } from 'react';
import './style.css';
import { useParams, useNavigate } from 'react-router-dom';

const CodingChallenges = () => {
    const [userId, setUserId] = useState(null);
    const { data_structure_id } = useParams();
    const [progress, setProgress] = useState({ total: 0, completed: 0 });
    const [showRevisions, setShowRevisions] = useState(false);
    const [problems, setProblems] = useState([]);
    const [solvedChallenges, setSolvedChallenges] = useState([]);
    const [showSolvedChallenges, setShowSolvedChallenges] = useState(false);
    const [editMode, setEditMode] = useState(false); // To track if in edit mode
const [currentNoteId, setCurrentNoteId] = useState(null); // To track the note being edited
const [currentNoteContent, setCurrentNoteContent] = useState(''); // To track the note content
    const leetcodeLogo = `${process.env.PUBLIC_URL}/leetcode-logo.png`;
    const navigate = useNavigate();
    const getStorageKey = (problemId) => `user-${userId}-problem-${problemId}`;


    useEffect(() => {
        const fetchUserId = () => {
            const user_id = localStorage.getItem('userId');
            if (user_id) {
                setUserId(user_id);
            }
        };

        fetchUserId();

        if (!userId) {
            console.error('User ID is not available, cannot fetch challenges');
            return;
        }

        if (!data_structure_id) {
            console.error('Data structure ID is not available');
            return;
        }

        fetch(`http://localhost:5000/api/challenges/dschallenge/${data_structure_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data.challenges)) {
                    setProblems(data.challenges);
                    loadCheckboxStates(data.challenges);
                    updateProgress(data.challenges);
                    fetchNotes(data.challenges);
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => console.error('Error fetching problems:', error));
    }, [userId, data_structure_id]);

    const fetchNotes = (challenges) => {
        if (!userId) {
            console.error('User ID is null. Cannot fetch notes.');
            return;
        }
        Promise.all(challenges.map(challenge => {
            return fetch(`http://localhost:5000/api/notes/challenges/${challenge._id}?user_id=${userId}`)
                .then(response => response.json())
                .then(notes => {
                    if (Array.isArray(notes)) {
                        return { ...challenge, note: notes }; // Attach notes to challenge
                    }
                    return challenge; // Return challenge without notes if fetching fails
                })
                .catch(error => {
                    console.error('Error fetching notes:', error);
                    return challenge; // Return challenge without notes if an error occurs
                });
        }))
        .then(updatedChallenges => {
            setProblems(updatedChallenges); // Set updated challenges with notes
        });
    };

    const updateProgress = (problemsList) => {
        const revisionsCount = problemsList.filter(problem => problem.solved).length;
        setProgress({ total: problemsList.length, completed: revisionsCount });
    };
    const handleShowRevisions = () => {
        setShowRevisions(!showRevisions); // Toggle between all problems and revision problems
    };
     const handleShowSolvedChallenges = () => { 
        setShowSolvedChallenges(!showSolvedChallenges);
        
        if (!showSolvedChallenges) {
            fetch(`http://localhost:5000/api/challenges/solveByds?user_id=${encodeURIComponent(userId)}&&data_structure_id=${data_structure_id}`)
                .then(response => response.json())
                .then(async (data) => {
                    if (data.solvedChallenges) {
                        // Fetch notes for each solved challenge
                        const challengesWithNotes = await Promise.all(data.solvedChallenges.map(async (challenge) => {
                            // Fetch notes for the current challenge
                            const notesResponse = await fetch(`http://localhost:5000/api/notes/challenges/${challenge._id}?user_id=${userId}`);
                            const notesData = await notesResponse.json();

                            return {
                                ...challenge,
                                solved: true,
                                note: notesData // Assuming notesData is an array
                            };
                        }));

                        // Update state with challenges including their notes
                        setSolvedChallenges(data.solvedChallenges);
                        setProblems(challengesWithNotes);
                    }
                })
                .catch(error => console.error('Error fetching solved challenges:', error));
        } else {
            // Fetch all challenges again
            fetch(`http://localhost:5000/api/challenges/dschallenge/${data_structure_id}`)
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data.challenges)) {
                        setProblems(data.challenges);
                    }
                })
                .catch(error => console.error('Error fetching all challenges:', error));
        }
    };

    const loadCheckboxStates = (problemsList) => {
        if (!Array.isArray(problemsList)) {
            console.error('Invalid problemsList:', problemsList);
            return;
        }
        problemsList.forEach(problem => {
            const solvedStatus = localStorage.getItem(getStorageKey(problem._id));
            if (solvedStatus !== null) {
                problem.solved = solvedStatus === 'true'; 
            }
        });
        setProblems([...problemsList]);
    };

    const handleNoteSubmit = (problemId, noteId, newContent) => {
        const method = noteId ? 'PATCH' : 'POST';
        const url = noteId
            ? `http://localhost:5000/api/notes/${noteId}`
            : `http://localhost:5000/api/notes/coding-challenge/${problemId}`;
    
        // Optimistic UI update - this adds the note immediately to the state
        const optimisticUpdate = {
            _id: noteId || Date.now(), // Temporary ID for new notes
            content: newContent,
            user_id: userId
        };
    
        // Update the UI immediately with the optimistic update
        setProblems(prevProblems => 
            prevProblems.map(problem => 
                problem._id === problemId 
                    ? {
                        ...problem,
                        note: noteId 
                            ? problem.note.map(n => n._id === noteId ? optimisticUpdate : n)
                            : [...(problem.note || []), optimisticUpdate] // Add new note
                    }
                    : problem
            )
        );
    
        // Make the API request to actually submit the note
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newContent, user_id: userId }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update or create note');
            }
            return response.json();
        })
        .then(updatedNote => {
            // Now replace the temporary note ID with the actual ID from the server response
            setProblems(prevProblems => 
                prevProblems.map(problem => 
                    problem._id === problemId 
                        ? {
                            ...problem,
                            note: noteId 
                                ? problem.note.map(n => n._id === noteId ? updatedNote : n) 
                                : [...problem.note, updatedNote] // Replace optimistic update
                        }
                        : problem
                )
            );
            // Clear the current note state
            setEditMode(false);
            setCurrentNoteId(null);
            setCurrentNoteContent('');
        })
        .catch(error => console.error('Error submitting note:', error));
    };
    
    
    const handleStar = (id) => {
        const problem = problems.find(problem => problem._id === id);
        if (!problem) return;

        const newRevisionStatus = !problem.revision;

        fetch(`http://localhost:5000/api/challenges/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ revision: newRevisionStatus }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update revision status');
            }
            return response.json();
        })
        .then(updatedProblem => {
            setProblems(prevProblems =>
                prevProblems.map(problem =>
                    problem._id === id ? { ...problem, revision: newRevisionStatus } : problem
                )
            );
        })
        .catch(error => {
            console.error('Error updating the revision status:', error);
        });
    };

    const handleSubmitChallenge = (id) => {
        const problem = problems.find(problem => problem._id === id);
        if (!problem) return;

        const newSolvedStatus = !problem.solved;
        fetch(`http://localhost:5000/api/challenges/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                challenge_id: id,
                user_id: userId, 
                solved: newSolvedStatus,
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { 
                    throw new Error(`Network response was not ok: ${response.status} - ${text}`); 
                });
            }
            return response.json();
        })
        .then(() => {
            setProblems(prevProblems => {
                const updatedProblems = prevProblems.map(problem =>
                    problem._id === id ? { ...problem, solved: newSolvedStatus } : problem
                );
                localStorage.setItem(getStorageKey(id), newSolvedStatus);
                updateProgress(updatedProblems);
                if (!newSolvedStatus) {
                    fetch(`http://localhost:5000/api/challenges/remove/${id}/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }
                return updatedProblems;
            });
            fetchNotes([{ _id: id }]); // Fetch notes again for the problem
        })
        .catch(error => console.error('Error submitting challenge:', error));
    };

    const problemsToDisplay = Array.isArray(problems) ? (showRevisions ? problems.filter(problem => problem.revision) : problems) : [];

    return (
        <div className="coding-challenges-container">
            <div className="action-buttons">
                <button onClick={handleShowRevisions}>
                    {showRevisions ? 'Show All Problems' : 'Show Revisions'}
                </button>
                <button onClick={handleShowSolvedChallenges}>
                    {showSolvedChallenges ? 'Show All Challenges' : 'Show Solved Challenges'}
                </button>
            </div>
            <div className="progress-tracker">
                <div className="progress-info">
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${(progress.completed / progress.total) * 100}% ` }}
                        ></div>
                    </div>
                    <p>Your Progress: {progress.completed}/{progress.total} ({((progress.completed / progress.total) * 100).toFixed(1)}% complete)</p>
                </div>
            </div>
            <table className="coding-challenges-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Problem</th>
                        <th>Link</th>
                        <th>Note</th>
                        <th>Difficulty</th>
                        <th>Revision</th>
                    </tr>
                </thead>
                <tbody>
                    {problemsToDisplay.map(problem => (
                        <tr key={problem._id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={problem.solved || false}
                                    onChange={() => handleSubmitChallenge(problem._id)}
                                />
                            </td>
                            <td>{problem.title}</td>
                            <td>
                                <a href={problem.link} target="_blank" rel="noopener noreferrer">
                                    <img src={leetcodeLogo} alt="Leetcode" className="icon" />
                                </a>
                            </td>
                                        <td>
                {problem.note && problem.note.length > 0 ? (
                    problem.note.map(note => (
                        <div key={note._id}>
                            {editMode && currentNoteId === note._id ? (
                                <>
                        {/* Editing an existing note */}
                        <textarea
                            value={currentNoteContent}
                            onChange={(e) => setCurrentNoteContent(e.target.value)}
                        />
                        <button onClick={() => handleNoteSubmit(problem._id, note._id, currentNoteContent)}>Save</button>
                        <button onClick={() => {
                            // Cancel edit mode and reset states
                            setEditMode(false);
                            setCurrentNoteId(null);
                            setCurrentNoteContent('');
                        }}>Cancel</button>
                    </>
                ) : (
                    <>
                        {/* Displaying an existing note */}
                                                    <p>{note.content}</p>
                                <button onClick={() => {
                                    setEditMode(true);
                                    setCurrentNoteId(note._id);
                                    setCurrentNoteContent(note.content);
                                }}>Edit</button>
                            </>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {editMode && currentNoteId === problem._id ? (
                                            <>
                                                {/* Adding a new note */}
                                                <textarea
                                                    value={currentNoteContent}
                                                    onChange={(e) => setCurrentNoteContent(e.target.value)}
                                                />
                                                <button onClick={() => handleNoteSubmit(problem._id, null, currentNoteContent)}>Save</button>
                                                <button onClick={() => {
                                                    // Cancel adding new note
                                                    setEditMode(false);
                                                    setCurrentNoteId(null);
                                                    setCurrentNoteContent('');
                                                }}>Cancel</button>
                                            </>
                                        ) : (
                                            <button onClick={() => {
                                                setEditMode(true);
                                                setCurrentNoteId(problem._id);
                                                setCurrentNoteContent('');
                                            }}>Add Note</button>
                                        )}
                                    </>
                                )}
                            </td>


                            <td>{problem.level}</td>
                            <td>
                                <span
                                    className={`star-icon ${problem.revision ? 'starred' : ''}`}
                                    onClick={() => handleStar(problem._id)}
                                >
                                    ★
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => navigate(-1)} className="back-button">Back</button>
        </div>
    );
};

export default CodingChallenges;
