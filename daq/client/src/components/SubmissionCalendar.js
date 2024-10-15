import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import './SubmissionCalendar.css'; // Your custom styles

const SubmissionCalendar = ({ submissions = [] }) => {
    const [date, setDate] = useState(new Date());

    const getSubmissionsForDate = (date) => {
        const submission = submissions.find(sub => sub.date.toDateString() === date.toDateString());
        return submission ? submission.count : 0;
    };

    const getBoxColor = (count) => {
        if (count === 0) return 'rgb(158 167 174)'; 
        if (count <= 3) return 'rgb(141 200 247)';
        if (count <= 6) return 'rgb(106 170 219);';
        if (count <= 10) return 'rgb(82 142 189)';
        return 'rgb(31 115 181)';
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
