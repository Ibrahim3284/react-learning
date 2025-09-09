// src/pages/Home.jsx
import HomePage from "../components/HomePage";
import CoursesOffered from "../components/CoursesOffered";
import OurFounders from "../components/OurFounders";
import Footer from "../components/Footer";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomePage />
      <CoursesOffered />
      <OurFounders />
      <Footer />
    </>
  );
}
