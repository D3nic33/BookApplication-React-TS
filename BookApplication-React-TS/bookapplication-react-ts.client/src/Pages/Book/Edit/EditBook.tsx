import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditBook = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState({ title: "", author: "" });

    // Load existing book data
    useEffect(() => {
        fetch(`/api/books/${id}`)
            .then(res => res.json())
            .then(data => setBook(data));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        await fetch(`/api/books/${id}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book),
        });
        navigate("/bookOverview"); // Go back to list after saving
    };

    return (
        <div>
            <h2>Edit Book</h2>
            <input name="title" value={book.title} onChange={handleChange} />
            <input name="author" value={book.author} onChange={handleChange} />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => navigate("/")}>Cancel</button>
        </div>
    );
};

export default EditBook;