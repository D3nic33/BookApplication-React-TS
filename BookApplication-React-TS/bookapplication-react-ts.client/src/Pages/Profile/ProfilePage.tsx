import ViewProfile from "../../Components/Profile/View/ViewProfile";
import DefaultLayout from "../../Layouts/DefaultLayout";

function ProfilePage() {
    return (
        <div>
            <DefaultLayout>
                <ViewProfile />
            </DefaultLayout>
        </div>
    );
}

export default ProfilePage;