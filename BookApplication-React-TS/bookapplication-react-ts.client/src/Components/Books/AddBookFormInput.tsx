import StarRating from "../Rating/StarRating";

interface Book {
    title: string;
    author: string;
    releaseDate: Date;
    genre: string;
    rating: number;
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
            <StarRating
                value={book[title] as number ?? 0}
                onChange={(val: number) =>
                    setBook((prevData: Book) => ({
                        ...prevData,
                        [title]: val,
                    }))
                }
            />
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
                    value={book[title] as string}
                    onChange={handleChange}
                    required
                />
            </div>
        )
}

export default AddBookFormInput;