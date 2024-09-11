import React, { useState } from 'react';
import './style.css';

const CodingChallenges = () => {
    const [progress, setProgress] = useState({ total: 6, completed: 0 });
    const [showRevisions, setShowRevisions] = useState(false); // Toggle revision view
    const [problems, setProblems] = useState([
        {
            id: 1,
            title: 'Set Matrix Zeros',
            articleLink: 'https://www.geeksforgeeks.org/set-matrix-zeros',
            practiceLink: 'https://leetcode.com/problems/set-matrix-zeroes',
            difficulty: 'Medium',
            note: '',
            revision: false,
            completed: false,
        },
        {
            id: 2,
            title: 'Pascal\'s Triangle',
            articleLink: 'https://www.geeksforgeeks.org/pascals-triangle',
            practiceLink: 'https://leetcode.com/problems/pascals-triangle',
            difficulty: 'Medium',
            note: '',
            revision: false,
            completed: false,
        },
        {
            id: 3,
            title: 'Next Permutation',
            articleLink: 'https://www.geeksforgeeks.org/next-permutation',
            practiceLink: 'https://leetcode.com/problems/next-permutation',
            difficulty: 'Medium',
            note: '',
            revision: false,
            completed: false,
        },
        {
            id: 4,
            title: 'Kadane\'s Algorithm',
            articleLink: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray',
            practiceLink: 'https://leetcode.com/problems/maximum-subarray',
            difficulty: 'Easy',
            note: '',
            revision: false,
            completed: false,
        }
    ]);

    const handleCheck = (id) => {
        const updatedProblems = problems.map(problem => {
            if (problem.id === id) {
                problem.completed = !problem.completed;
            }
            return problem;
        });
        const completedProblems = updatedProblems.filter(problem => problem.completed).length;
        setProgress({ ...progress, completed: completedProblems });
        setProblems(updatedProblems);
    };

    const handleStar = (id) => {
        const updatedProblems = problems.map(problem => {
            if (problem.id === id) {
                problem.revision = !problem.revision;
            }
            return problem;
        });
        setProblems(updatedProblems);
    };

    const handleNoteSubmit = (id, newNote) => {
        const updatedProblems = problems.map(problem => {
            if (problem.id === id) {
                problem.note = newNote;
            }
            return problem;
        });
        setProblems(updatedProblems);
    };

    const handleShowRevisions = () => {
        setShowRevisions(!showRevisions); // Toggle between all problems and revision problems
    };

    const problemsToDisplay = showRevisions ? problems.filter(problem => problem.revision) : problems;

    return (
        <div className="coding-challenges-container">
            <div className="action-buttons">
                <button onClick={handleShowRevisions}>
                    {showRevisions ? 'Show All Problems' : 'Show Revisions'}
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
                        <th>Article</th>
                        <th>Practice</th>
                        <th>Note</th>
                        <th>Difficulty</th>
                        <th>Revision</th>
                    </tr>
                </thead>
                <tbody>
                    {problemsToDisplay.map(problem => (
                        <tr key={problem.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={problem.completed}
                                    onChange={() => handleCheck(problem.id)}
                                />
                            </td>
                            <td>{problem.title}</td>
                            <td>
                                <a href={problem.articleLink} target="_blank" rel="noopener noreferrer">
                                    <img src="gfg-logo.png" alt="GeeksForGeeks" className="icon" />
                                </a>
                            </td>
                            <td>
                                <a href={problem.practiceLink} target="_blank" rel="noopener noreferrer">
                                    <img src="leetcode-logo.png" alt="LeetCode" className="icon" />
                                </a>
                            </td>
                            <td>
                                <NoteSection 
                                    note={problem.note} 
                                    onNoteSubmit={(newNote) => handleNoteSubmit(problem.id, newNote)} 
                                />
                            </td>
                            <td>
                                <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                                    {problem.difficulty}
                                </span>
                            </td>
                            <td>
                                <span 
                                    className={`star-icon ${problem.revision ? 'starred' : ''}`} 
                                    onClick={() => handleStar(problem.id)}
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

// Note Section Component
const NoteSection = ({ note, onNoteSubmit }) => {
    const [editMode, setEditMode] = useState(false);
    const [currentNote, setCurrentNote] = useState(note);

    const handleSave = () => {
        onNoteSubmit(currentNote);
        setEditMode(false);
    };

    return (
        <div className="note-section">
            {editMode ? (
                <>
                    <textarea 
                        value={currentNote} 
                        onChange={(e) => setCurrentNote(e.target.value)} 
                        rows="3"
                    />
                    <div className="note-buttons">
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                </>
            ) : (
                <>
                    <p>{note || 'No notes available'}</p>
                    <button onClick={() => setEditMode(true)}>Edit</button>
                </>
            )}
        </div>
    );
};

export default CodingChallenges;