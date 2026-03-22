import AddBookForm from '../../../Components/Books/Add/AddBookForm';
import DefaultLayout from '../../../Layouts/DefaultLayout';
function AddBookPage() {
    return (
        <div>
            <DefaultLayout>
                <AddBookForm />
            </DefaultLayout>
        </div>
    );
}

export default AddBookPage;