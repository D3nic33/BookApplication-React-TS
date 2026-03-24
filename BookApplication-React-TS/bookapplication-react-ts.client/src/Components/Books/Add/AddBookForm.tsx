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
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission behavior

        if (!token) return; {
            await addBookData(newBook, token);
        }
        
        setNewBook({ id: 0, title: "", author: "", releaseDate: "", genre: "", rating: 0.0, shelf: "" });

        setIsPopupOpen(true);
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col"
            >
                <AddBookFormInput book={newBook} setBook={setNewBook} title="title" type="text" />
                <AddBookFormInput book={newBook} setBook={setNewBook} title="author" type="text" />
                <AddBookFormInput book={newBook} setBook={setNewBook} title="releaseDate" type="Date" />
                <AddBookFormInput book={newBook} setBook={setNewBook} title="genre" type="text" />
                <AddBookFormInput book={newBook} setBook={setNewBook} title="shelf" type="text" />

                {newBook.shelf.toLowerCase() === "read" && (
                    <AddBookFormInput book={newBook} setBook={setNewBook} title="rating" type="number" />
                )}

                <button className="py-4 bg-orange-400 hover:bg-orange-500 text-white w-80 mx-auto rounded-lg" type="submit">Submit</button>

                <SubmitPopup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    title="Success!"
                    message="The book is successfully added."
                />
            </form>
        </div>
    );

    async function addBookData(newBook: Book, token: string) {
        await fetch('api/Books', {
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