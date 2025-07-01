import localFont from "next/font/local";
import "./globals.css";
import "./assets/icons/lucide.css";
import connectDB from "./DBconnection";

// Connect to MongoDB
connectDB();

const myFont = localFont({
    src: "./assets/fonts/Montserrat/Montserrat-Regular.ttf",
});

export const metadata = {
    title: "TrainLink Platform",
};

export default async function RootLayouts({ children }) {
    return (
        <html lang="en">
            <body className={myFont.className}>{children}</body>
        </html>
    );
}
