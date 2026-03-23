interface ShelfDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

const DropdownShelf = ({ value, onChange }: ShelfDropdownProps) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        >
            <option value="" disabled>Select a shelf...</option>
            <option value="read">Read</option>
            <option value="want to read">Want to Read</option>
            <option value="did not finish">Did Not Finish</option>
        </select>
    );
};

export default DropdownShelf;