import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AutoTranslate from './components/test';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/translate" element={<AutoTranslate/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
