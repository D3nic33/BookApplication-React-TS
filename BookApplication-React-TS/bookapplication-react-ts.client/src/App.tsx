import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import BookOverviewPage from './Pages/Book/View/BooksOverviewPage.tsx'
import Home from '../src/Pages/Home/HomePage.tsx'
import AddBookPage from './Pages/Book/Add/AddBookPage.tsx'
import EditBookPage from './Pages/Book/Edit/EditBookPage.tsx';
import Login from './Pages/Login/Login.tsx';
import EditProfile from './Pages/Profile/EditProfilePage.tsx';
import ProfilePage from './Pages/Profile/ProfilePage.tsx';
import PrivateRoute from './Components/Menu/PrivateRoute.tsx';
import BookDetailPage from './Pages/Book/View/BookDetailPage.tsx';
import SearchUsersPage from './Pages/Users/SearchUsersPage.tsx';
import PublicProfilePage from './Pages/Profile/PublicProfilePage.tsx';
import GoogleBooksSearchPage from './Pages/Book/Search/GoogleBooksSearchPage.tsx';

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
                        <ProfilePage />
                    </PrivateRoute>
                } />
                <Route path="/profile/edit" element={
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                } />
                <Route path="/books" element={
                    <PrivateRoute>
                        <BookOverviewPage />
                    </PrivateRoute>
                } />
                <Route path="/books/add" element={
                    <PrivateRoute>
                        <AddBookPage />
                    </PrivateRoute>
                } />
                <Route path="/books/:id/edit" element={
                    <PrivateRoute>
                        <EditBookPage />
                    </PrivateRoute>
                } />
                <Route path="/books/:id" element={
                    <PrivateRoute>
                        <BookDetailPage />
                    </PrivateRoute>
                } />
                <Route path="/users" element={
                    <PrivateRoute>
                        <SearchUsersPage />
                    </PrivateRoute>
                } />
                <Route path="/profile/:userId" element={
                    <PrivateRoute>
                        <PublicProfilePage />
                    </PrivateRoute>
                } />
                <Route path="/books/search" element={
                    <PrivateRoute>
                        <GoogleBooksSearchPage />
                    </PrivateRoute>
                } />

            </Routes>
        </Router>
    );
}

export default App;