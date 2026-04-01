interface FormFieldProps {
    label: string;
    name: string;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PutBookFormField = ({ label, name, value, type = "text", onChange }: FormFieldProps) => {
    return (
        <div className="flex flex-col w-full items-center justify-center py-3">
            <label className="capitalize">{label}</label>
            <input
                className="w-full border border-yellow-500/75 rounded-lg px-2 py-1"
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required
            />
        </div>
    );
};

export default PutBookFormField;