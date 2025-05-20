import { useEffect, useState } from 'react';
import '../../App.css';
import DefaultLayout from '../../Layouts/DefaultLayout';

interface Book {
    title: string;
    author: number;
    releaseDate: string;
    genre: string;
    rating: string;
}

function Book() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        populateBookData();
    }, []);

    const contents = books.length == 0
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <div>
            {books.map(book =>
                <div>
                    <div className="bookCover" />
                    <div>
                        <p>{book.title}</p>
                        <p>{book.author}</p>
                    </div>
                </div>

/*
                <tr key={book.title}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.releaseDate}</td>
                    <td>{book.genre}</td>
                    <td>{book.rating}</td>
                </tr>*/
            )}
        </div>;

    return (
        <div>
            <DefaultLayout>{contents}</DefaultLayout>
        </div>
    );

    async function populateBookData() {
        const response = await fetch('api/Books');
        if (response.ok) {
            const data = await response.json();
            setBooks(data);
        }
    }
}

export default Book;