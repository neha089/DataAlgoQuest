import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';// useLocation 
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
import HomePage from './components/HomePage'; // Import the new HomePage
import BinaryTree from './components/BinaryTree';
import Login from './components/login';
import Signup from './components/signup';
import LearningPathsaa from './components/aa';
import SortingVisualization from './components/SortingVisulization';
import GraphVisualization from './components/GraphVisualizer'
import DynamicProgrammingVisualization from './components/dp'
import Profile from './components/Profile';
const AppContent = () => {
    // const location = useLocation();

    return (
        <div>  
              {/* {!location.pathname.startsWith('/admin') && <DataAlgoQuestNavbar />} */}
            {<DataAlgoQuestNavbar />}
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/login" element={<Login/>}/>
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
                <Route path="/aa" element={<LearningPathsaa />} />
                <Route path="/profile" element={ <Profile />} />
                <Route path="/data-structure/Tree/BinaryTree" element={<BinaryTree/>}/>
                <Route path="/sorting-visualization" element={<SortingVisualization />} />
                <Route path="/graph-visualization" element={<GraphVisualization />} />
                <Route path="/dynamic-programming-visualization" element={<DynamicProgrammingVisualization />} />
            </Routes>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
