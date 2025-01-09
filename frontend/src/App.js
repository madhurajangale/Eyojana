import './App.css';
import { useContext } from 'react';
import Home from './pages/Home';
import Category from './components/Category';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AutoTranslate from './components/test';
import Login from './pages/Login';
import UserSignUp from './pages/sign-up';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from "./context/AuthContext";
import SchemeApplicationForm from './pages/SchemeApplicationForm';
import ApplicationDocuments from './components/ApplicationDocuments';
import UserApplications from './components/UserApplications';
import Scheme from './pages/Scheme';
import SchemeDetail from './pages/SchemeDetail';
import Chat from './components/Chat';
import AdminHome from './pages/AdminHome';
import Contact from './components/Contact';
import Map from './components/Map';
import Applications from './components/Applications';
import Recommendation from './components/recommendation';

function App() {
    
  return (
    <div className="App">
      
{/*       
      <BrowserRouter>
      <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Category" element={<Category />} />
                <Route path="/signup" element={<UserSignUp />} />
                <Route path="/translate" element={<AutoTranslate/>}/>
            </Routes>
        </BrowserRouter> */}
        <AuthProvider>
        <LanguageProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Category" element={<Category />} />
                <Route path="/signup" element={<UserSignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/translate" element={<AutoTranslate/>}/>
                <Route path="/schemeform" element={<SchemeApplicationForm/>}/>
                <Route path="/myapplications" element={<UserApplications/>}/>     
                <Route path="/application-documents" element={<ApplicationDocuments />} />
                <Route path="/scheme" element={<Scheme />}/>
                <Route path="/scheme-details" element={<SchemeDetail />}/>
                <Route path="/chat" element={<Chat />}/>
                <Route path="/contact" element={<Contact />}/>
                <Route path='/adminhome' element={<AdminHome />} />
                <Route path='/map' element={<Map />} />
                <Route path="/applications/:category" element={<Applications />} />
                <Route path="/recommendation" element={<Recommendation />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
    </AuthProvider>
    </div>
  );
}

export default App;