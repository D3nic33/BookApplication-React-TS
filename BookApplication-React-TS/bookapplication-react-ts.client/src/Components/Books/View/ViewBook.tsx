import { useEffect, useState } from 'react';
import WantToReadOverview from './WantToReadOverview';
import ReadOverview from './ReadOverview';

interface Book {
    id: number;
    title: string;
    author: string;
    releaseDate: string;
    genre: string;
    rating: number;
}

function ViewBook() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        populateBookData();
    }, []);

    return (
        <div>
            <div className="py-6">
                <p className="text-2xl px-4">Want to Read</p>
                <WantToReadOverview />
            </div>
            <div className="py-6">
                <p className="text-2xl px-4">Read</p>
                <ReadOverview />
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
