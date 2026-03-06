import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard2 from './pages/Dashboard/Dashboard2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard2 />} />
        <Route path="/dashboard" element={<Dashboard2 />} />
        <Route path="/dashboard-v2" element={<Dashboard2 />} />
      </Routes>
    </Router>
  );
}

export default App;
