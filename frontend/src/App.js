import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AutoTranslate from './components/test';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { LanguageProvider } from './LanguageContext';
function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/translate" element={<AutoTranslate/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
