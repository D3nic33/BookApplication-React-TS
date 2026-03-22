import { useEffect, useState } from 'react';
import BookShelf from './ViewBookByShelf';

interface Book {
    id: number;
    title: string;
    author: string;
    releaseDate: string;
    genre: string;
    rating: number;
    shelf: string;
}

function ViewBook() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        populateBookData();
    }, []);

    return (
        <div>
            <div className="py-6">
                <BookShelf shelf="want to read" title="Want to Read" />
            </div>
            <div className="py-6">
                <BookShelf shelf="read" title="Read" />
            </div>
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

export default ViewBook
