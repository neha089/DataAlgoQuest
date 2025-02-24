import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';// useLocation 
import DataAlgoQuestNavbar from './components/Navbar/DataAlgoQuestNavbar';
import LearningPaths from './components/LearningPaths';
import DataStructureDetail from './components/DataStructureDetail';
import DataStructureQuiz from './components/Quiz/DataStructureQuiz';
import DataStructurePage from './components/Main/DSMainPage';
import Integer from './components/DataType/Integer';
import Float from './components/DataType/Float';
import Character from './components/DataType/Character';
import Boolean from './components/DataType/Boolean';
import CodingChallenges from './components/CodingChallenge/CodingChallenges';
import Admin from './components/Admin/Admin';
import HomePage from './components/HomePage/HomePage'; // Import the new HomePage
import BinaryTree from './components/BinaryTree/BinaryTree';
import Login from './components/User/login';
import Signup from './components/User/signup';
import LearningPathsaa from './components/Algorithm/aa';
import SortingVisualization from './components/Sorting/SortingVisulization';
import GraphVisualization from './components/Graph/GraphVisualizer'
import DynamicProgrammingVisualization from './components/DP/dp'
import Profile from './components/User/Profile';
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
