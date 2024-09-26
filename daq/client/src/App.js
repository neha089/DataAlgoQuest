import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import DataAlgoQuestNavbar from './components/DataAlgoQuestNavbar';
import LearningPaths from './components/LearningPaths';
import DataStructureDetail from './components/DataStructureDetail';
import DataStructureQuiz from './components/DataStructureQuiz';
import DataStructurePage from './components/DSMainPage';
import Integer from './components/Integer';
import Float from './components/Float';
import Character from './components/Character';
import Boolean from './components/Boolean';
import CodingChallenges from './components/CodingChallenges';
import Admin from './components/Admin';

// New component to handle location logic
const AppContent = () => {
    const location = useLocation();

    return (
        <div>
            {/* Conditionally render the navbar if the current path does not start with "/admin" */}
            {!location.pathname.startsWith('/admin') && <DataAlgoQuestNavbar />}
            <Routes>
            <Route path="/learning-paths" element={<LearningPaths />} />
                <Route path="/data-structure/:name" element={<DataStructureDetail />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/data-structure/:data_structure_id/quiz" element={<DataStructureQuiz />} />
                <Route path="/data-structure/:data_structure_id/challenges" element={<CodingChallenges />} />
                <Route path="/dsmainpage" element={<DataStructurePage/>} /> 
                <Route path="/Integer" element={<Integer/>}/>
                <Route path="/Float" element={<Float/>}/>
                <Route path="/Character" element={<Character/>}/>
                <Route path="/Boolean" element={<Boolean/>}/>

                {/* Add other routes as needed */}
            </Routes>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent /> {/* Use AppContent component inside the Router */}
        </Router>
    );
};

export default App;
