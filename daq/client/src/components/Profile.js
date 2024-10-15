import React from 'react';
import UserInfo from './UserInfo';
import SubmissionCalendar from './SubmissionCalendar';
import ProgressGraph from './ProgressGraph';
import './Profile.css';

const submissions = [
    { date: '2024-10-01', count: 5 },
    { date: '2024-10-02', count: 2 },
    { date: '2024-10-15', count: 7 },
    // Add more submission data here
];
const Profile = () => {
    return (
        <div className="profile-container">
            <UserInfo />
            <SubmissionCalendar submissions={submissions} />           <ProgressGraph />
        </div>
    );
};

export default Profile;
