import { useState } from 'react';
import '../../App.css';
import DefaultLayout from '../../Layouts/DefaultLayout';

interface Book {
    title: string;
    author: string;
    releaseDate: Date;
    genre: string;
    rating: number;
}

function AddBook() {
    const [book, setBook] = useState<Book>({
        title: "",
        author: "",
        releaseDate: new Date,
        genre: "",
        rating: 0.0,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBook((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission behavior

        addBookData(book);

        setBook({ title: "", author: "", releaseDate: new Date, genre: "", rating: 0.0 });
    };

    const contents =
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={book.title}
                        onChange={handleChange}
                        required
                    />
                    
                </div>
                <div>
                    <label>Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={book.author}
                        onChange={handleChange}
                        required
                    />

                </div>
                <div>
                    <label>releaseDate</label>
                    <input
                        type="date"
                        id="releaseDate"
                        name="releaseDate"
                        value={book.releaseDate}
                        onChange={handleChange}
                        required
                    />

                </div>
                <div>
                    <label>Genre</label>
                    <input
                        type="text"
                        id="genre"
                        name="genre"
                        value={book.genre}
                        onChange={handleChange}
                        required
                    />

                </div>
                <div>
                    <label>Rating</label>
                    <input
                        type="number"
                        id="rating"
                        name="rating"
                        value={book.rating}
                        onChange={handleChange}
                        required
                    />

                </div>
                <button type="submit">Submit</button>
            </form>
        </div>

    return (
        <div>
            <DefaultLayout>{contents}</DefaultLayout>
        </div>
    );

    async function addBookData(newbook: Book) {
        const response = await fetch('api/Books', {
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