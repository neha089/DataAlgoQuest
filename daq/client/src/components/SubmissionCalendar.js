import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import './SubmissionCalendar.css'; // Your custom styles

const SubmissionCalendar = ({ submissions = [] }) => {
    const [date, setDate] = useState(new Date());

    const getSubmissionsForDate = (date) => {
        const dateString = date.toISOString().split('T')[0];
        const submission = submissions.find(sub => sub.date === dateString);
        return submission ? submission.count : 0;
    };

    const getBoxColor = (count) => {
        if (count === 0) return '#d3d3d3'; 
        if (count <= 3) return '#a8d8ff';
        if (count <= 6) return '#6fb8ff';
        if (count <= 10) return '#368bff';
        return '#0053cc';
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const count = getSubmissionsForDate(date);
            return (
                <div style={{ backgroundColor: getBoxColor(count), height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {count > 0 ? count : ''}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="submission-calendar">
            <Calendar
                onChange={setDate}
                value={date}
                tileContent={tileContent}
                className="custom-calendar"
            />
        </div>
    );
};

export default SubmissionCalendar;
