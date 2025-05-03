import localFont from "next/font/local";
import "./globals.css";
import "./assets/icons/lucide.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StudentBar from "./components/StudentBar";

const myFont = localFont({
    src: "./assets/fonts/Montserrat/Montserrat-Regular.ttf",
});

export const metadata = {
    title: "TrainLink Platform",
};

export default function RootLayouts({ children }) {
    return (
        <html lang="en">
            <body className={myFont.className}>
                <div className="page">
                    <Sidebar />
                    <div className="main-home">
                        <Header />
                        {children}
                    </div>
                    <StudentBar />
                </div>
            </body>
        </html>
    );
}
