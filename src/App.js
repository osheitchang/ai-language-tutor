import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Lessons from './components/Lessons';
import Practice from './components/Practice';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/practice" element={<Practice />} />
        <Route path="/lessons" element={<Lessons />} />
      </Routes>
    </Router>
  );
}

export default App;
