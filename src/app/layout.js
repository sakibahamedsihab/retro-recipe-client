import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "RecipeHub | Retro Modern Recipes",
  description:
    "A centralized space for recipe sharing and culinary inspiration.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 
        bg-[#FDFBF7]: Warm vintage paper background
        selection:bg-[#FFC900]: Custom text selection highlight 
      */}
      <body className="flex flex-col min-h-screen bg-[#FDFBF7] text-black font-sans antialiased selection:bg-[#FFC900] selection:text-black">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
