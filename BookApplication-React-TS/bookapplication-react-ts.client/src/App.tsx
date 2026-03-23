import './App.css';
import BookOverview from './Pages/Book/View/BooksOverview.tsx'
import Home from '../src/Pages/Home/HomePage.tsx'
import AddBook from './Pages/Book/Add/AddBook.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditBook from './Pages/Book/Edit/EditBook.tsx';
import Login from './Pages/Login/Login.tsx';
import EditProfile from './Pages/Profile/EditProfilePage.tsx';
import Profile from './Pages/Profile/ProfilePage.tsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile/" element={< Profile />} />
                <Route path="/profile/edit" element={< EditProfile />} />
                <Route path="/bookOverview" element={<BookOverview />} />
                <Route path="/addBook" element={<AddBook />} />
                <Route path="/books/:id/edit" element={<EditBook />} />
            </Routes>
        </Router>
    );
}

export default App;