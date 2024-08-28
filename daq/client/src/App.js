// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataAlgoQuestNavbar from './components/DataAlgoQuestNavbar';
import LearningPaths from './components/LearningPaths';
import DataStructureDetail from './components/DataStructureDetail';

const App = () => {
    return (
        <Router>
            <DataAlgoQuestNavbar /> {/* Include the navbar */}
            <Routes>
                <Route path="/learning-paths" element={<LearningPaths />} />
                <Route path="/path/:id" element={<DataStructureDetail />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;

