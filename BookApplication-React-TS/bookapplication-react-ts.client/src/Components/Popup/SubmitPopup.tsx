interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

function SubmitPopup({ isOpen, onClose, title, message }: PopupProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-80 flex flex-col items-center gap-4 z-10">
                <div className="text-4xl"></div>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <p className="text-gray-500 text-center">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-2 w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 rounded-lg transition-colors"
                >
                    OK
                </button>
            </div>
        </div>
    );
}


export default SubmitPopup;