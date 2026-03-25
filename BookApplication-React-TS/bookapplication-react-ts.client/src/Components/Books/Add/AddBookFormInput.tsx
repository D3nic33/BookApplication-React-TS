import StarRatingPicker from "../../Rating/StarRatingPicker";
import DropdownShelf from "./DropDownShelf";

interface Book {
    id: number;
    title: string;
    author: string;
    releaseDate: string;
    genre: string;
    rating: number;
    shelf: string;
    description: string;
}

function AddBookFormInput({book, setBook, title, type } : {
    book: Book,
    setBook: React.Dispatch<React.SetStateAction<Book>>,
    title: keyof Book,
    type: string
    }) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBook((prevData : Book) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const isNumeric = type == "number"

    return isNumeric ?
        (
            <StarRatingPicker
                value={book[title] as number ?? 0}
                onChange={(val: number) =>
                    setBook((prevData: Book) => ({
                        ...prevData,
                        [title]: val,
                    }))
                }
            />
        )
        : title === "shelf" ?
            (
                <div className="flex flex-col w-80 mx-auto items-center justify-center py-3">
                    <label>{title}</label>
                    <DropdownShelf
                        value={book.shelf}
                        onChange={(val) => setBook({ ...book, shelf: val })} />
                </div>
            )
            :
            (
                <div className="flex flex-col w-80 mx-auto items-center justify-center py-3">
                    <label className="">
                        {title}
                    </label>
                    <input
                        type={type}
                        className="w-full border border-yellow-500/75 rounded-lg"
                        name={title}
                        value={(book[title] ?? "") as string} 
                        onChange={handleChange}
                        required
                    />
                </div>
            )
}

export default AddBookFormInput;