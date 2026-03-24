import { useState } from 'react';
import './AddBookFormInput';
import AddBookFormInput from './AddBookFormInput';
import SubmitPopup from '../../Popup/SubmitPopup';
import { useAuth } from '../../../Context/AuthContext';

interface Book {
    id: number;
    title: string;
    author: string;
    releaseDate: string;
    genre: string;
    rating: number;
    shelf: string;
    description: string;
}

function AddBook() {
    const { token } = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newBook, setNewBook] = useState<Book>({
        id: 0,
        title: "",
        author: "",
        releaseDate: "",
        genre: "",
        rating: 0.0,
        shelf: "",
        description: "",
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) return;

        await addBookData(newBook, token);

        setNewBook({ id: 0, title: "", author: "", releaseDate: "", genre: "", rating: 0.0, shelf: "", description: "" });
        setIsPopupOpen(true);
    };

    return (
        <div className="min-h-screen bg-amber-50 px-6 py-12">

            {/* Page header */}
            <div className="max-w-xl mx-auto mb-8">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                    Your Library
                </span>
                <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                    Add a new book 📖
                </h1>
                <p className="text-stone-400 mt-2 text-sm">Fill in the details below to add a book to your collection.</p>
            </div>

            {/* Card */}
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <AddBookFormInput book={newBook} setBook={setNewBook} title="title" type="text" />
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="author" type="text" />
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="description" type="text" />
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="releaseDate" type="Date" />
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="genre" type="text" />
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="shelf" type="text" />

                    {newBook.shelf.toLowerCase() === "read" && (
                        <AddBookFormInput book={newBook} setBook={setNewBook} title="rating" type="number" />
                    )}

                    {/* Divider */}
                    <div className="h-px bg-orange-100 my-1" />

                    <button
                        type="submit"
                        className="w-full bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-full shadow transition-all"
                    >
                        Add to Library ✨
                    </button>

                </form>
            </div>

            <SubmitPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Success!"
                message="The book is successfully added."
            />
        </div>
    );

    async function addBookData(newBook: Book, token: string) {
        await fetch('/api/Books', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newBook)
        });
    }
}

export default AddBook;