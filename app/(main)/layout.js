import { redirect } from "next/navigation";
import { getAuthUser } from "../auth";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StudentBar from "../components/StudentBar";
import { AuthProvider } from "../Providers";

export default async function RootLayouts({ children }) {
    const loggedUser = await getAuthUser();
    if (!loggedUser) return redirect("/login");

    return (
        <AuthProvider value={loggedUser}>
            <div className="page">
                <Sidebar />
                <div className="main-home">
                    <Header />
                    {children}
                </div>
                <StudentBar />
            </div>
        </AuthProvider>
    );
}
