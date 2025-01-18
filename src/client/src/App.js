import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePollPage from './pages/CreatePollPage';
import PollPage from './pages/PollPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CreatePollPage />} />
                <Route path="/poll/:id" element={<PollPage />} />
            </Routes>
        </Router>
    );
}

export default App;
