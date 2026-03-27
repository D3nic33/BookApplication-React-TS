import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

import EditBookFormField from "./EditBookFormField";
import DropdownShelf from "../Add/DropDownShelf";
import ReadingProgressTracker from "../ProgressTracker/ReadingProgressTracker";

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

const EditBook = () => {
    const { token } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book>({
        id: 0,
        title: "",
        author: "",
        releaseDate: "",
        genre: "",
        rating: 0,
        shelf: "",
        description: "",
        currentPage: null,
        totalPages: null,
        coverUrl: ""
    });

    // Fetch book from your API
    useEffect(() => {
        fetch(`/api/books/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data =>
                setBook({
                    ...data,
                    releaseDate: data.releaseDate ? data.releaseDate.split("T")[0] : "",
                    shelf: data.shelf ? data.shelf.toLowerCase() : "",
                    currentPage: data.currentPage ?? null,
                    totalPages: data.totalPages ?? null,
                })
            );
    }, [id]);

    // Auto-populate total pages from Google Books when shelf is set to Reading or Read
    useEffect(() => {
        const shelfLower = book.shelf.toLowerCase();
        if (shelfLower !== "reading" && shelfLower !== "read") return;
        if (book.totalPages != null) return;
        if (!book.title) return; // wait until book has loaded

        const query = `${book.title} ${book.author}`.trim();

        fetch(`/api/googlebooks/search?q=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                const pageCount = data.items?.[0]?.volumeInfo?.pageCount;
                if (pageCount) {
                    setBook(prev => ({ ...prev, totalPages: pageCount }));
                }
            });
    }, [book.shelf, book.title]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        await fetch(`/api/books/${id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(book),
        });
        navigate("/books");
    };

    const isReading = book.shelf.toLowerCase() === "reading";

    return (
        <div className="min-h-screen bg-amber-50 px-6 py-12">

            {/* Back link */}
            <div className="max-w-xl mx-auto mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-orange-400 hover:text-orange-500 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                    ← Back
                </button>
            </div>

            {/* Page header */}
            <div className="max-w-xl mx-auto mb-8">
                <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                    Your Library
                </span>
                <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                    Edit Book ✏️
                </h1>
                <p className="text-stone-400 mt-2 text-sm">Update the details of your book below.</p>
            </div>

            {/* Card */}
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-orange-100 p-8">
                <div className="flex flex-col gap-5">

                    <EditBookFormField label="title" name="title" value={book.title} onChange={handleChange} />
                    <EditBookFormField label="author" name="author" value={book.author} onChange={handleChange} />
                    <EditBookFormField label="genre" name="genre" value={book.genre} onChange={handleChange} />
                    <EditBookFormField label="release date" name="releaseDate" value={book.releaseDate} onChange={handleChange} type="date" />

                    {/* Shelf dropdown */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-stone-600 capitalize">Shelf</label>
                        <DropdownShelf
                            value={book.shelf}
                            onChange={(val) => setBook({ ...book, shelf: val })}
                        />
                    </div>

                    {/* Reading progress — only for currently reading */}
                    {isReading && (
                        <ReadingProgressTracker
                            currentPage={book.currentPage}
                            totalPages={book.totalPages}
                            onCurrentPageChange={(val) => setBook({ ...book, currentPage: val })}
                            onTotalPagesChange={(val) => setBook({ ...book, totalPages: val })}
                        />
                    )}

                    <div className="h-px bg-orange-100 my-1" />

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            className="flex-1 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-full shadow transition-all"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                        <button
                            className="flex-1 bg-white border-2 border-orange-200 text-orange-400 hover:bg-orange-50 font-semibold py-3 rounded-full transition-all"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditBook;