import React, { useState, useEffect } from 'react';
import './style.css';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const CodingChallenges = () => {
    const [userId, setUserId] = useState(null);
    const { data_structure_id } = useParams(); // Extract data_structure_id from the route
    const [progress, setProgress] = useState({ total: 0, completed: 0 });
    const [showRevisions, setShowRevisions] = useState(false); // Toggle revision view
    const [problems, setProblems] = useState([]);
    const [solvedChallenges, setSolvedChallenges] = useState([]);
    const [showSolvedChallenges, setShowSolvedChallenges] = useState(false); // New state for showing solved challenges
    const leetcodeLogo = `${process.env.PUBLIC_URL}/leetcode-logo.png`;
    const navigate = useNavigate(); // Initialize navigate function
    
    // Fetch data based on the data_structure_id
    useEffect(() => {
        const fetchUserId = () => { 
            const user_id =localStorage.getItem('userId'); // Assuming 'user' was stored in localStorage
            if (user_id) {
              setUserId(user_id);
            }
          };
      
        fetchUserId();
        if (!data_structure_id) {
            console.error('Data structure ID is not available');
            return;
        }

        fetch(`http://localhost:5000/api/challenges/dschallenge/${data_structure_id}`) // Use the API with data_structure_id
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProblems(data);
                // Calculate progress based on revision status
                updateProgress(data);
                loadCheckboxStates(data);
            })
            .catch(error => console.error('Error fetching problems:', error));
    }, [data_structure_id,userId]); // Re-fetch whenever data_structure_id changes

    // Update progress based on current problems list
    const updateProgress = (problemsList) => {
        const revisionsCount = problemsList.filter(problem => problem.revision).length;
        setProgress({ total: problemsList.length, completed: revisionsCount });
    };

    const loadCheckboxStates = (problemsList) => {
        problemsList.forEach(problem => {
            const solvedStatus = localStorage.getItem(`problem-${problem._id}`);
            if (solvedStatus !== null) {
                problem.solved = solvedStatus === 'true'; // Set the checkbox state from localStorage
            }
        });
        setProblems([...problemsList]); // Update state with modified problems list
    };

    const handleNoteSubmit = (problemId, noteId, newContent) => {
        
        const method = noteId ? 'PATCH' : 'POST'; // Use PATCH for updates, POST for creation
        const url = noteId
            ? `http://localhost:5000/api/notes/${noteId}`
            : `http://localhost:5000/api/notes/coding-challenge/${problemId}`; // Adjust URL if needed
    
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newContent, user_id: userId }), // Ensure user_id is relevant or remove it
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update or create note');
            }
            return response.json();
        })
        .then(updatedNote => {
            console.log('Note successfully processed:', updatedNote);
            // Fetch the updated list of problems or notes
            return fetch(`http://localhost:5000/api/challenges/dschallenge/${data_structure_id}`);
        })
        .then(response => response.json())
        .then(updatedProblems => {
            setProblems(updatedProblems);
            updateProgress(updatedProblems); // Update progress after fetching updated problems
        })
        .catch(error => console.error('Error handling the note:', error));
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
            // Recalculate progress whenever revision status changes
            updateProgress(problems.map(problem =>
                problem._id === id ? { ...problem, revision: newRevisionStatus } : problem
            ));
        })
        .catch(error => {
            console.error('Error updating the revision status:', error);
        });
    };

    const handleShowRevisions = () => {
        setShowRevisions(!showRevisions); // Toggle between all problems and revision problems
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
                // Save the new solved status to localStorage
                localStorage.setItem(`problem-${id}`, newSolvedStatus);
                if (!newSolvedStatus) {
                    // Remove challenge from the challengesAttempt table if unsolved
                    fetch(`http://localhost:5000/api/challenges/remove/${id}/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }
                return updatedProblems;
            });
            if (!newSolvedStatus) {
                setSolvedChallenges(prevSolved => prevSolved.filter(challenge => challenge._id !== id));
            }
        })
        .catch(error => console.error('Error submitting challenge:', error));
    };
    
    const handleShowSolvedChallenges = () => {
        setShowSolvedChallenges(!showSolvedChallenges);
        
        if (!showSolvedChallenges) {
            fetch(`http://localhost:5000/api/challenges/status?user_id=${encodeURIComponent(userId)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.solvedChallenges) {
                        setSolvedChallenges(data.solvedChallenges);
                        setProblems(data.solvedChallenges.map(challenge => ({
                            ...challenge,
                            solved: true,
                            note: challenge.note
                        })));
                    }
                })
                .catch(error => console.error('Error fetching solved challenges:', error));
        } else {
            // Fetch all challenges again
            fetch(`http://localhost:5000/api/challenges/dschallenge/${data_structure_id}`)
                .then(response => response.json())
                .then(data => {
                    setProblems(data);
                    updateProgress(data);
                    loadCheckboxStates(data);
                })
                .catch(error => console.error('Error fetching problems:', error));
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
                            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
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
                                    checked={problem.solved || false} // New checkbox for solved status
                                    onChange={() => handleSubmitChallenge(problem._id)} // Call submit API
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
                                    problem.note.map((singleNote, index) => (
                                        <div key={index}>
                                            <NoteSection
                                                note={singleNote.content}
                                                onNoteSubmit={(newContent) =>
                                                    handleNoteSubmit(problem._id, singleNote._id, newContent)
                                                }
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        <NoteSection
                                            note={''}
                                            onNoteSubmit={(newContent) => handleNoteSubmit(problem._id, null, newContent)}
                                        />
                                    </div>
                                )}
                            </td>
                            <td>
                                <span className={`difficulty ${problem.level.toLowerCase()}`}>
                                    {problem.level}
                                </span>
                            </td>
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
            <div className="button-container">
                <button onClick={() => navigate(-1)} className="back-button">
                    Back
                </button>
            </div>
        </div>
    );
};

// Note Section Component
const NoteSection = ({ note, onNoteSubmit }) => {
    const [editMode, setEditMode] = useState(false);
    const [currentNote, setCurrentNote] = useState(note);

    useEffect(() => {
        setCurrentNote(note); // Update local state if note prop changes
    }, [note]);

    const handleSave = () => {
        onNoteSubmit(currentNote);
        setEditMode(false);
    };

    return (
        <div className="note-section">
            {editMode ? (
                <>
                    <div className="modal-overlay" onClick={() => setEditMode(false)}></div>
                    <div className="modal">
                        <h3>Edit Note</h3>
                        <textarea
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            rows="5"
                            placeholder="Write your notes here..."
                        />
                        <div className="modal-buttons">
                            <button className="save-btn" onClick={handleSave}>Save</button>
                            <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <p>{note || 'No notes available'}</p>
                    <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
                </>
            )}
        </div>
    );
};

export default CodingChallenges;
