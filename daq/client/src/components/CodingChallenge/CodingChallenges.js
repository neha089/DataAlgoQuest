import React, { useState, useEffect } from 'react';
import '../style.css';
import { useParams, useNavigate } from 'react-router-dom';

const baseURL = process.env.REACT_APP_API_BASE_URL;
const CodingChallenges = () => {
    const [userId, setUserId] = useState(null);
    const { data_structure_id } = useParams();
    const [progress, setProgress] = useState({ total: 0, completed: 0 });
    const [showRevisions, setShowRevisions] = useState(false);
    const [problems, setProblems] = useState([]);
    const [showSolvedChallenges, setShowSolvedChallenges] = useState(false);
    const [editMode, setEditMode] = useState(false); // To track if in edit mode
    const [currentNoteId, setCurrentNoteId] = useState(null); // To track the note being edited
    const [currentNoteContent, setCurrentNoteContent] = useState(''); // To track the note content
    const leetcodeLogo = `${process.env.PUBLIC_URL}/leetcode-logo.png`;
    const navigate = useNavigate();
    const getStorageKey = (problemId) => `user-${userId}-problem-${problemId}`;


    useEffect(() => {
        const user_id = localStorage.getItem('userId');
        if (user_id) {
            setUserId(user_id);
        }
    }, []);
    useEffect(() => {
        if (!userId || !data_structure_id) return;
    
        fetch(`${baseURL}/api/challenges/dschallenge/${data_structure_id}`)
            .then(response => response.json())
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
    
    const fetchChallenges = async () => {
        if (!userId || !data_structure_id) return;
    
        try {
            const response = await fetch(`${baseURL}/api/challenges/dschallenge/${data_structure_id}`);
            if (!response.ok) throw new Error('Network error');
    
            const data = await response.json();
            if (Array.isArray(data.challenges)) {
                setProblems(data.challenges);
                loadCheckboxStates(data.challenges);
                updateProgress(data.challenges);
                fetchNotes(data.challenges); // હવે અહીંથી અલગથી બોલાવ્યું
            }
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    };
    
    useEffect(() => {
        fetchChallenges();
    }, [userId, data_structure_id]);
    
    const fetchNotes = (challenges) => {
        if (!userId) {
            console.error('User ID is null. Cannot fetch notes.');
            return;
        }
        Promise.all(challenges.map(challenge => {
            return fetch(`${baseURL}/api/notes/challenges/${challenge._id}?user_id=${userId}`)
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
    const handleShowSolvedChallenges = async () => {
        setShowSolvedChallenges(!showSolvedChallenges);
    
        try {
            let data;
            if (!showSolvedChallenges) {
                const response = await fetch(`${baseURL}/api/challenges/solveByds?user_id=${userId}&data_structure_id=${data_structure_id}`);
                data = await response.json();
            } else {
                const response = await fetch(`${baseURL}/api/challenges/dschallenge/${data_structure_id}`);
                data = await response.json();
            }
    
            if (data.solvedChallenges || data.challenges) {
                const challenges = data.solvedChallenges || data.challenges;
                setProblems(challenges);
                loadCheckboxStates(challenges);
                fetchNotes(challenges);
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
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
            ? `${baseURL}/api/notes/${noteId}`
            : `${baseURL}/api/notes/coding-challenge/${problemId}`;
    
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
                            note: problem.note.map(n => (n._id === optimisticUpdate._id ? updatedNote : n))
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

        fetch(`${baseURL}/api/challenges/${id}`, {
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

    const handleSubmitChallenge = async (id) => {
        try {
            const problem = problems.find(problem => problem._id === id);
            if (!problem) return;
    
            const newSolvedStatus = !problem.solved;
            const response = await fetch(`${baseURL}/api/challenges/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ challenge_id: id, user_id:userId, solved: newSolvedStatus }),
            });
    
            if (!response.ok) throw new Error('Failed to submit challenge');
    
            if (!newSolvedStatus) {
                await fetch(`${baseURL}/api/challenges/remove/${id}/${userId}`, { method: 'DELETE' });
            }
    
            const updatedProblems = problems.map(problem =>
                problem._id === id ? { ...problem, solved: newSolvedStatus } : problem
            );
    
            setProblems(updatedProblems);
            localStorage.setItem(getStorageKey(id), newSolvedStatus);
            updateProgress(updatedProblems); 
        } catch (error) {
            console.error('Error submitting challenge:', error);
        }
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
