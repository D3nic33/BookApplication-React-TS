import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../Layouts/DefaultLayout";
import ReadingGoalHistory from "../../Components/Profile/View/ReadingGoalHistory";

function ReadingGoalHistoryPage() {
    const navigate = useNavigate();

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-amber-50 px-4 sm:px-6 py-12">
                <div className="max-w-xl mx-auto mb-8">
                    <button
                        onClick={() => navigate("/profile")}
                        className="text-sm text-orange-400 hover:text-orange-500 font-medium mb-4 flex items-center gap-1"
                    >
                        ← Back to profile
                    </button>
                    <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                        History
                    </span>
                    <h1 className="text-4xl font-bold text-stone-800 leading-tight">
                        Reading Goal History
                    </h1>
                </div>

                <ReadingGoalHistory />
            </div>
        </DefaultLayout>
    );
}

export default ReadingGoalHistoryPage;
