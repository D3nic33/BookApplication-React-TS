import { useEffect, useState } from 'react';
import DefaultLayout from '../../Layouts/DefaultLayout';

interface Book {
    title: string;
    author: number;
    releaseDate: string;
    genre: string;
    rating: string;
}

function BooksOverview() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        populateBookData();
    }, []);

    const contents = books.length == 0
        ? <p>Geen data</p>
        : <table id="myForm" className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Release Date</th>
                    <th>Genre</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
                {books.map(book =>
                    <tr key={book.title}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.releaseDate}</td>
                        <td>{book.genre}</td>
                        <td>{book.rating}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <DefaultLayout>{contents}</DefaultLayout>
        </div>
    );

    async function populateBookData() {
        const response = await fetch('api/Books', {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const data = await response.json();
            setBooks(data);
        }
    }
}

export default BooksOverview;