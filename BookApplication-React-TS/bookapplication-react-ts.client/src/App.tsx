import './App.css';
import BookOverview from '../src/Pages/Book/BooksOverview.tsx'
import Home from '../src/Pages/Home/HomePage.tsx'
import AddBook from '../src/Pages/Book/AddBook.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bookOverview" element={<BookOverview />} />
                <Route path="/addBook" element={<AddBook />} />
            </Routes>
        </Router>
    );
}

export default App;