import BookDetail from '../../../Components/Books/View/BookDetail';
import DefaultLayout from '../../../Layouts/DefaultLayout';
function BookDetailPage() {
    return (
        <div>
            <DefaultLayout>
                <BookDetail />
            </DefaultLayout>
        </div>
    );
}

export default BookDetailPage;