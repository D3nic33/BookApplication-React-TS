import { useEffect, useState } from 'react';
import BookShelf from './ViewBookByShelf';
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

function ViewBook() {
    const { token } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        populateBookData();
    }, []);

    return (
        <div>
            <div className="py-4">
                <BookShelf shelf="want to read" title="Want to Read" />
            </div>
            <div className="py-4">
                <BookShelf shelf="read" title="Read" />
            </div>
            <div className="py-4">
                <BookShelf shelf="did not finish" title="Did not Finish" />
            </div>
        </div>
    );

    async function populateBookData() {
        const response = await fetch('api/Books', {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (response.ok) {
            const data = await response.json();
            setBooks(data);
        }
    }
}

export default ViewBook
