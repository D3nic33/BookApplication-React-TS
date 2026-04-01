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
    description?: string;
    currentPage: number | null;
    totalPages: number | null;
    coverUrl: string;
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
        currentPage: 0,
        totalPages: null,
        coverUrl: ""
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) return;
        await addBookData(newBook, token);
        setNewBook({ id: 0, title: "", author: "", releaseDate: "", genre: "", rating: 0.0, shelf: "", description: "", currentPage: 0, totalPages: null, coverUrl: ""});
        setIsPopupOpen(true);
    };

    return (
        <div className="min-h-screen bg-amber-50 px-4 sm:px-6 py-12">

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
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 p-5 sm:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <AddBookFormInput book={newBook} setBook={setNewBook} title="title" type="text" />
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="author" type="text" />
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="description" type="text" />
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="releaseDate" type="Date" />
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="genre" type="text" />
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="shelf" type="text" />

                    {/* Total pages */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-stone-600 capitalize">Total Pages</label>
                        <input
                            type="number"
                            min={1}
                            value={newBook.totalPages ?? ""}
                            onChange={e =>
                                setNewBook({
                                    ...newBook,
                                    totalPages: e.target.value === "" ? null : Math.max(1, parseInt(e.target.value)),
                                })
                            }
                            placeholder="e.g. 320"
                            className="w-full bg-amber-50 border border-orange-100 rounded-xl px-4 py-2 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        />
                    </div>

                    {/* Rating — only for Read shelf */}
                    {newBook.shelf.toLowerCase() === "read" && (
                        <AddBookFormInput book={newBook} setBook={setNewBook} title="rating" type="number" />
                    )}

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