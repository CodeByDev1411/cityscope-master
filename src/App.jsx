import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage1 from './pages/Landingpage1';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CityMap from './pages/CityMap';
import { ReportIssue } from './pages/ReportIssue';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage1 />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<CityMap />} />
        <Route path="/report" element={<ReportIssue />} />
      </Routes>
    </Router>
  );
}

export default App;
