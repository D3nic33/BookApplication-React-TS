import { useState } from 'react';
import '../../App.css';
import './AddBookFormInput';
import AddBookFormInput from './AddBookFormInput';
import SubmitPopup from '../Popup/SubmitPopup';

interface Book {
    title: string;
    author: string;
    releaseDate: Date;
    genre: string;
    rating: number;
}

function AddBook() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [book, setBook] = useState<Book>({
        title: "",
        author: "",
        releaseDate: new Date,
        genre: "",
        rating: 0.0
,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission behavior

        addBookData(book);

        setBook({ title: "", author: "", releaseDate: new Date, genre: "", rating: 0.0 });

        setIsPopupOpen(true);
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col"
            >
                <AddBookFormInput book={book} setBook={setBook} title="title" type="text" />
                <AddBookFormInput book={book} setBook={setBook} title="author" type="text" />
                <AddBookFormInput book={book} setBook={setBook} title="releaseDate" type="Date" />
                <AddBookFormInput book={book} setBook={setBook} title="genre" type="text" />
                <AddBookFormInput book={book} setBook={setBook} title="rating" type="number" rating={rating} setRating={setRating} />

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

    async function addBookData(newbook: Book) {
        await fetch('api/Books', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(newbook)
        });
    }
}

export default AddBook;