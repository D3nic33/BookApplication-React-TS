import { useEffect, useState } from 'react';
import BooksByShelf from './ViewBookByShelf';
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


function ViewBook() {
    const { token } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [shelves, setShelves] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/books/shelves', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setShelves(data));

        populateBookData();
    }, []);

    return (
        <div className="min-h-screen bg-amber-50 px-6 py-12">

            {/* Page header */}
            <div className="max-w-5xl mx-auto mb-10">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                    Your Collection
                </span>
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                        My Library 📚
                    </h1>
                    <a
                        href="/books/add"
                        className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-full shadow transition-all text-sm"
                    >
                        + Add a Book
                    </a>
                </div>
            </div>

            {/* Shelves */}
            <div className="max-w-5xl mx-auto flex flex-col gap-10">
                {shelves.map(shelf => (
                    <BooksByShelf
                        key={shelf}
                        shelf={shelf}
                        title={shelf.charAt(0).toUpperCase() + shelf.slice(1)}
                    />
                ))}
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

export default ViewBook;