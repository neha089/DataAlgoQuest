// import React, { useState, useEffect } from 'react';
// import './style.css';
// import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

// const CodingChallenges = () => {
//     const [userId, setUserId] = useState(null);
//     const { data_structure_id } = useParams(); // Extract data_structure_id from the route
//     const [progress, setProgress] = useState({ total: 0, completed: 0 });
//     const [showRevisions, setShowRevisions] = useState(false); // Toggle revision view
//     const [problems, setProblems] = useState([]);
//     const [solvedChallenges, setSolvedChallenges] = useState([]);
//     const [showSolvedChallenges, setShowSolvedChallenges] = useState(false); // New state for showing solved challenges
//     const leetcodeLogo = `${process.env.PUBLIC_URL}/leetcode-logo.png`;
//     const navigate = useNavigate(); // Initialize navigate function
    
//     // Fetch data based on the data_structure_id
//     useEffect(() => {
//         const fetchUserId = () => { 
//             const user_id =localStorage.getItem('userId'); // Assuming 'user' was stored in localStorage
//             if (user_id) {
//               setUserId(user_id);
//             }
//           };
      
//         fetchUserId();
//         if (!userId) {
//             console.error('User ID is not available, cannot fetch challenges');
//             return;
//         }

//         if (!data_structure_id) {
//             console.error('Data structure ID is not available');
//             return;
//         }

//         fetch(`http://localhost:5000/api/challenges/dschallenge/${data_structure_id}`) // Use the API with data_structure_id
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 // Ensure 'challenges' is an array before setting it to problems
//                 if (Array.isArray(data.challenges)) {
//                     setProblems(data.challenges);
//                     loadCheckboxStates(data.challenges);  // Pass challenges array here
//                     updateProgress(data.challenges);      // Ensure 'challenges' is used consistently
//                     fetchNotes(data.challenges); 
//                 } else {
//                     console.error('Unexpected data format:', data);
//                 }
//             })
//             .catch(error => console.error('Error fetching problems:', error));
//     }, [userId,data_structure_id]); // Re-fetch whenever data_structure_id changes

//      // Fetch notes for the challenges based on userId
//      const fetchNotes = (challenges) => {
//         if (!userId) {
//             console.error('User ID is null. Cannot fetch notes.');
//             return; // Exit if userId is null
//         }
//         challenges.forEach(challenge => {
//             fetch(`http://localhost:5000/api/notes/challenges/${challenge._id}?user_id=${userId}`)
//                 .then(response => response.json())
//                 .then(notes => {
//                     if (Array.isArray(notes)) {
//                         challenge.note = notes; // Assuming the API returns an array of notes for the challenge
//                     }
//                     setProblems(prevProblems => [...prevProblems]); // Trigger re-render
//                 })
//                 .catch(error => console.error('Error fetching notes:', error));
//         });
//     };
//     // Update progress based on current problems list
//     const updateProgress = (problemsList) => {
//         const revisionsCount = problemsList.filter(problem => problem.solved).length;
//         setProgress({ total: problemsList.length, completed: revisionsCount });
//     };

//     const loadCheckboxStates = (problemsList) => {
//         if (!Array.isArray(problemsList)) {
//             console.error('Invalid problemsList:', problemsList);
//             return;
//         }
//         problemsList.forEach(problem => {
//             const solvedStatus = localStorage.getItem(`problem-${problem._id}`);
//             if (solvedStatus !== null) {
//                 problem.solved = solvedStatus === 'true'; 
//             }
//         });
//         setProblems([...problemsList]);
//     };
    

//     const handleNoteSubmit = (problemId, noteId, newContent) => {
//         const method = noteId ? 'PATCH' : 'POST'; // Use PATCH for updates, POST for creation
//         const url = noteId
//             ? `http://localhost:5000/api/notes/${noteId}`
//             : `http://localhost:5000/api/notes/coding-challenge/${problemId}`; // Adjust URL if needed

//         fetch(url, {
//             method,
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ content: newContent, user_id: userId }), // Ensure user_id is relevant or remove it
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to update or create note');
//             }
//             return response.json();
//         })
//         .then(updatedNote => {
//             console.log('Note successfully processed:', updatedNote);
//             // Update the notes for the specific problem in the state
//             setProblems(prevProblems =>
//                 prevProblems.map(problem =>
//                     problem._id === problemId 
//                     ? { ...problem, note: problem.note.map(n => n._id === noteId ? updatedNote : n) } 
//                     : problem
//                 )
//             );
//         })
//         .catch(error => console.error('Error handling the note:', error));
//     };

//     const handleStar = (id) => {
//         const problem = problems.find(problem => problem._id === id);
//         if (!problem) return;

//         const newRevisionStatus = !problem.revision;

//         fetch(`http://localhost:5000/api/challenges/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ revision: newRevisionStatus }),
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to update revision status');
//             }
//             return response.json();
//         })
//         .then(updatedProblem => {
//             setProblems(prevProblems =>
//                 prevProblems.map(problem =>
//                     problem._id === id ? { ...problem, revision: newRevisionStatus } : problem
//                 )
//             );
        
//         })
//         .catch(error => {
//             console.error('Error updating the revision status:', error);
//         });
//     };

//     const handleShowRevisions = () => {
//         setShowRevisions(!showRevisions); // Toggle between all problems and revision problems
//     };

//     const handleSubmitChallenge = (id) => {
//         const problem = problems.find(problem => problem._id === id);
//         if (!problem) return;

//         const newSolvedStatus = !problem.solved;
//         fetch(`http://localhost:5000/api/challenges/submit`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 challenge_id: id,
//                 user_id: userId, 
//                 solved: newSolvedStatus,
//             }),
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.text().then(text => { 
//                     throw new Error(`Network response was not ok: ${response.status} - ${text}`); 
//                 });
//             }
//             return response.json();
//         })
//         .then(() => {
//             setProblems(prevProblems => {
//                 const updatedProblems = prevProblems.map(problem =>
//                     problem._id === id ? { ...problem, solved: newSolvedStatus } : problem
//                 );
//                 // Save the new solved status to localStorage
//                 localStorage.setItem(`problem-${id}`, newSolvedStatus);
//                 updateProgress(updatedProblems);
//                 if (!newSolvedStatus) {
//                     // Remove challenge from the challengesAttempt table if unsolved
//                     fetch(`http://localhost:5000/api/challenges/remove/${id}/${userId}`, {
//                         method: 'DELETE',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                     });
//                 }
//                 return updatedProblems;
//             });
//             if (!newSolvedStatus) {
//                 setSolvedChallenges(prevSolved => prevSolved.filter(challenge => challenge._id !== id));
//             }
//         })
//         .catch(error => console.error('Error submitting challenge:', error));
//     };
    
//     const handleShowSolvedChallenges = () => { 
//         setShowSolvedChallenges(!showSolvedChallenges);
        
//         if (!showSolvedChallenges) {
//             fetch(`http://localhost:5000/api/challenges/status?user_id=${encodeURIComponent(userId)}`)
//                 .then(response => response.json())
//                 .then(async (data) => {
//                     if (data.solvedChallenges) {
//                         // Fetch notes for each solved challenge
//                         const challengesWithNotes = await Promise.all(data.solvedChallenges.map(async (challenge) => {
//                             // Fetch notes for the current challenge
//                             const notesResponse = await fetch(`http://localhost:5000/api/notes/challenges/${challenge._id}?user_id=${userId}`);
//                             const notesData = await notesResponse.json();
    
//                             return {
//                                 ...challenge,
//                                 solved: true,
//                                 notes: notesData // Assuming notesData is an array
//                             };
//                         }));
    
//                         // Update state with challenges including their notes
//                         setSolvedChallenges(data.solvedChallenges);
//                         setProblems(challengesWithNotes);
//                     }
//                 })
//                 .catch(error => console.error('Error fetching solved challenges:', error));
//         } else {
//             // Fetch all challenges again
//             fetch(`http://localhost:5000/api/challenges/dschallenge/${data_structure_id}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     setProblems(data);
//                     updateProgress(data);
//                     loadCheckboxStates(data);
//                 })
//                 .catch(error => console.error('Error fetching problems:', error));
//         }
//     };
    
    
//     const problemsToDisplay = Array.isArray(problems) ? (showRevisions ? problems.filter(problem => problem.revision) : problems) : [];

//     return (
//         <div className="coding-challenges-container">
//             <div className="action-buttons">
//                 <button onClick={handleShowRevisions}>
//                     {showRevisions ? 'Show All Problems' : 'Show Revisions'}
//                 </button>
//                 <button onClick={handleShowSolvedChallenges}>
//                     {showSolvedChallenges ? 'Show All Challenges' : 'Show Solved Challenges'}
//                 </button>
//             </div>
//             <div className="progress-tracker">
//                 <div className="progress-info">
//                     <div className="progress-bar-container">
//                         <div
//                             className="progress-bar"
//                             style={{width: `${(progress.completed / progress.total) * 100}% `}}
//                         ></div>
//                     </div>
//                     <p>Your Progress: {progress.completed}/{progress.total} ({((progress.completed / progress.total) * 100).toFixed(1)}% complete)</p>
//                 </div>
//             </div>
//             <table className="coding-challenges-table">
//                 <thead>
//                     <tr>
//                         <th>Status</th>
//                         <th>Problem</th>
//                         <th>Link</th>
//                         <th>Note</th>
//                         <th>Difficulty</th>
//                         <th>Revision</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {problemsToDisplay.map(problem => (
//                         <tr key={problem._id}>
//                             <td>
//                                 <input
//                                     type="checkbox"
//                                     checked={problem.solved || false} // New checkbox for solved status
//                                     onChange={() => handleSubmitChallenge(problem._id)} // Call submit API
//                                 />
//                             </td>
//                             <td>{problem.title}</td>
//                             <td>
//                                 <a href={problem.link} target="_blank" rel="noopener noreferrer">
//                                     <img src={leetcodeLogo} alt="Leetcode" className="icon" />
//                                 </a>
//                             </td>
//                             <td>
//                                 {problem.note && problem.note.length > 0 ? (
//                                     problem.note.map((singleNote, index) => (
//                                         <div key={index}>
//                                             <NoteSection
//                                                 note={singleNote.content}
//                                                 onNoteSubmit={(newContent) =>
//                                                     handleNoteSubmit(problem._id, singleNote._id, newContent)
//                                                 }
//                                             />
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <div>
//                                         <NoteSection
//                                             note={''}
//                                             onNoteSubmit={(newContent) => handleNoteSubmit(problem._id, null, newContent)}
//                                         />
//                                     </div>
//                                 )}
//                             </td>
//                             <td>
//                                 <span className={`difficulty ${problem.level.toLowerCase()}`}>
//                                     {problem.level}
//                                 </span>
//                             </td>
                            // <td>
                            //     <span
                            //         className={`star-icon ${problem.revision ? 'starred' : ''}`}
                            //         onClick={() => handleStar(problem._id)}
                            //     >
                            //         ★
                            //     </span>
                            // </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             <div className="button-container">
//                 <button onClick={() => navigate(-1)} className="back-button">
//                     Back
//                 </button>
//             </div>
//         </div>
//     );
// };

// // Note Section Component
// const NoteSection = ({ note, onNoteSubmit }) => {
//     const [editMode, setEditMode] = useState(false);
//     const [currentNote, setCurrentNote] = useState(note);

//     useEffect(() => {
//         setCurrentNote(note); // Update local state if note prop changes
//     }, [note]);

//     const handleSave = () => {
//         onNoteSubmit(currentNote);
//         setEditMode(false);
//     };

//     return (
        // <div className="note-section">
        //     {editMode ? (
        //         <>
        //             <textarea
        //                 value={currentNote}
        //                 onChange={(e) => setCurrentNote(e.target.value)}
        //                 placeholder="Write your note here..."
        //             />
        //             <button onClick={handleSave}>Save</button>
        //             <button onClick={() => setEditMode(false)}>Cancel</button>
        //         </>
        //     ) : (
        //         <>
        //             <p>{currentNote || 'No notes yet.'}</p>
        //             <button onClick={() => setEditMode(true)}>Edit</button>
        //         </>
        //     )}
        // </div>
//     );
// };

// export default CodingChallenges;

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
            const solvedStatus = localStorage.getItem(`problem-${problem._id}`);
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
        
        // Optimistically update the UI
        const optimisticUpdate = {
            _id: noteId || Date.now(), // Use a temporary ID for new notes
            content: newContent,
            user_id: userId
        };
        
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
            // Now replace the temporary ID with the actual ID from the server
            setProblems(prevProblems => 
                prevProblems.map(problem => 
                    problem._id === problemId 
                        ? {
                            ...problem,
                            note: noteId 
                                ? problem.note.map(n => n._id === noteId ? updatedNote : n) 
                                : [...problem.note, updatedNote] // Replace optimistic update with the actual response
                        } 
                        : problem
                )
            );
            // Clear the current note state
            setEditMode(false);
            setCurrentNoteId(null);
            setCurrentNoteContent('');
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
                localStorage.setItem(`problem-${id}`, newSolvedStatus);
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
                            // Switch to edit mode with selected note's content
                            setEditMode(true);
                            setCurrentNoteId(note._id);
                            setCurrentNoteContent(note.content);
                        }}>Edit Note</button>
                    </>
                )}
            </div>
        ))
    ) : (
        <div>
            {editMode ? (
                <>
                    {/* Adding a new note */}
                    <textarea
                        value={currentNoteContent}
                        onChange={(e) => setCurrentNoteContent(e.target.value)}
                    />
                    <button onClick={() => handleNoteSubmit(problem._id, null, currentNoteContent)}>Save</button>
                    <button onClick={() => {
                        // Cancel new note creation and reset states
                        setEditMode(false);
                        setCurrentNoteId(null);
                        setCurrentNoteContent('');
                    }}>Cancel</button>
                </>
            ) : (
                <button onClick={() => {
                    // Initiating adding a new note
                    setCurrentNoteContent('');
                    setEditMode(true);
                    setCurrentNoteId(null); // No ID for a new note
                }}>Add Note</button>
            )}
        </div>
    )}
</td>


                            <td>{problem.difficulty}</td>
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
        </div>
    );
};

export default CodingChallenges;
