import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PutBookFormField from "./PutBookFormField";
import DropdownShelf from "../Add/DropDownShelf";
import StarRating from "../../Rating/StarRating";
import { useAuth } from "../../../Context/AuthContext";

interface Book {
    id: number;
    title: string;
    author: string;
    releaseDate: string;
    genre: string;
    rating: number;
    shelf: string;
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
    });

    // Load existing book data
    useEffect(() => {
        fetch(`/api/books/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setBook({
                ...data,
                releaseDate: data.releaseDate ? data.releaseDate.split("T")[0] : "",
            }));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        await fetch(`/api/books/${id}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(book),
        });
        navigate("/bookOverview"); // Go back to list after saving
    };

    return (
        <div className="flex flex-col items-center py-8">
            <h2 className="text-xl font-bold mb-4">Edit Book</h2>

            <PutBookFormField label="title" name="title" value={book.title} onChange={handleChange} />
            <PutBookFormField label="author" name="author" value={book.author} onChange={handleChange} />
            <PutBookFormField label="genre" name="genre" value={book.genre} onChange={handleChange} />
            <PutBookFormField label="release date" name="releaseDate" value={book.releaseDate} onChange={handleChange} type="date" />

            <div className="flex flex-col w-80 mx-auto items-center justify-center py-3">
                <label className="capitalize">shelf</label>
                <DropdownShelf
                    value={book.shelf}
                    onChange={(val) => setBook({ ...book, shelf: val })}
                />
            </div>

            {book.shelf.toLowerCase() === "read" && (
                <div className="flex flex-col w-80 mx-auto items-center justify-center py-3">
                    <StarRating
                        value={book.rating}
                        onChange={(val: number) => setBook({ ...book, rating: val })}
                    />
                </div>
            )}

            <button
                className="py-4 bg-orange-400 hover:bg-orange-500 text-white w-80 mx-auto rounded-lg mt-2"
                onClick={handleSave}
            >
                Save
            </button>
            <button
                className="py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 w-80 mx-auto rounded-lg mt-2"
                onClick={() => navigate("/bookOverview")}
            >
                Cancel
            </button>
        </div>
    );
};

export default EditBook;