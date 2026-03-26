import GoogleBooksSearch from "../../../Components/Books/Search/GoogleBooksSearch";
import DefaultLayout from "../../../Layouts/DefaultLayout";

function GoogleBooksSearchPage() {
    return (
        <div>
            <DefaultLayout>
                <GoogleBooksSearch />
            </DefaultLayout>
        </div>
    );
}

export default GoogleBooksSearchPage;