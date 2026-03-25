import ViewBook from '../../../Components/Books/View/ViewBook';
import DefaultLayout from '../../../Layouts/DefaultLayout';
function BookOverviewPage() {
    return (
        <div>
            <DefaultLayout>
                <ViewBook />
            </DefaultLayout>
        </div>
    );
}

export default BookOverviewPage;