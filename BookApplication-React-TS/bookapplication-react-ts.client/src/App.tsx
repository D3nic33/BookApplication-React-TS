import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import BookOverview from './Pages/Book/View/BooksOverview.tsx'
import Home from '../src/Pages/Home/HomePage.tsx'
import AddBook from './Pages/Book/Add/AddBook.tsx'
import EditBook from './Pages/Book/Edit/EditBook.tsx';
import Login from './Pages/Login/Login.tsx';
import EditProfile from './Pages/Profile/EditProfilePage.tsx';
import Profile from './Pages/Profile/ProfilePage.tsx';
import PrivateRoute from './Components/Menu/PrivateRoute.tsx';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route path="/profile" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="/profile/edit" element={
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                } />
                <Route path="/books" element={
                    <PrivateRoute>
                        <BookOverview />
                    </PrivateRoute>
                } />
                <Route path="/books/add" element={
                    <PrivateRoute>
                        <AddBook />
                    </PrivateRoute>
                } />
                <Route path="/books/:id/edit" element={
                    <PrivateRoute>
                        <EditBook />
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;