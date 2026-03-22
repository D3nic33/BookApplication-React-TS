import AddBook from '../../Components/Books/AddBookForm';
import DefaultLayout from '../../Layouts/DefaultLayout';
function HomePage() {
    return (
        <div>
            <DefaultLayout>
                <AddBook />
            </DefaultLayout>
        </div>
    );
}

export default HomePage;