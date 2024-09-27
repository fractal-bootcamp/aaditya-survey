import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListSurveysPage from './ListSurveysPage';
import CreateSurveyPage from './CreateSurveyPage';
import TakeSurveyPage from './TakeSurveyPage';
import SurveyResultsPage from './SurveyResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListSurveysPage />} />
        <Route path="/create-survey" element={<CreateSurveyPage />} />
        <Route path="/survey/:surveyId" element={<TakeSurveyPage />} />
        <Route path="/survey/:surveyId/results" element={<SurveyResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
