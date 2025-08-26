// src/pages/Home.jsx
import HomePage from "../components/HomePage";
import CoursesOffered from "../components/CoursesOffered";
import OurFaculty from "../components/OurFaculty";
import Footer from "../components/Footer";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomePage />
      <CoursesOffered />
      <OurFaculty />
      <Footer />
    </>
  );
}
