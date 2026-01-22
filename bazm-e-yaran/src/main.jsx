import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import AddUser from "./components/AddUser";
import StudentPortal from "./components/StudentPortal";
import LoginForm from "./components/LoginForm";
import AdminPage from "./components/AdminPage";
import AlumniLogin from "./components/AlumniLogin";
import FacultyLogin from "./components/FacultyLogin";
import Register from "./components/Register";
import AddAlumni from "./components/AddAlumni";
import StudentList from "./components/StudentList";
import UpdateStudent from "./components/UpdateStudent";
import EditStudent from "./components/EditStudent";
import StudentPage from "./components/StudentPage"
import FacultyList from "./components/FacultyList";
import EditFaculty from "./components/EditFaculty";
import AddFaculty from "./components/AddFaculty";
import FacultyPage from "./components/FacultyPage";
import Questions from "./components/Questions";
import AddQuestion from "./components/AddQuestion";
import AddTest from "./components/AddTest";
import ListTests from "./components/ListTests";
import TestDetails from "./components/TestDetails";
import AllTests from "./components/AllTests";
import TestPage from "./components/TestPage";
import AttemptTest from "./components/AttemptTest";
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from "./components/ResetPassword"
import AddTestDetails from "./components/AddTestDetails";
import ListTestDetails from "./components/ListTestDetails";
import ViewQuestions from "./components/ViewQuestions";
import AlumniMap from "./components/AlumniMap";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/studentPortal" element={<StudentPortal />} />
      <Route path="/LoginForm" element={<LoginForm />} />
      <Route path="/AdminPage" element={<AdminPage />} />
      <Route path="/AlumniLogin" element={<AlumniLogin />} />
      <Route path="/FacultyLogin" element={<FacultyLogin />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/AddAlumni" element={<AddAlumni />} />
      <Route path="/StudentList" element={<StudentList />} />
      <Route path="/UpdateStudent" element={<UpdateStudent />} />
      <Route path="/editStudent/:id" element={<EditStudent />} />
      <Route path="/StudentPage" element={<StudentPage />} />
      <Route path="/FacultyList" element={<FacultyList />} />
      <Route path="/editFaculty/:id" element={<EditFaculty />} />
      <Route path="/addFaculty" element={<AddFaculty />} />
      <Route path="/FacultyPage" element={<FacultyPage />} />
      <Route path="/Questions" element={<Questions />} />
      <Route path="/AddQuestion" element={<AddQuestion />} />
      <Route path="/AddTest" element={<AddTest />} />
      <Route path="/ListTests" element={<ListTests />} />
      <Route path="/test/:id" element={<TestDetails />} />
      <Route path="/allTests" element={<AllTests/> } />
      <Route path="/testPage/:id" element={<TestPage/> } />
      <Route path="/attemptTest" element={<AttemptTest/> } />
      <Route path="/forgotPassword" element={<ForgotPassword/> } />
      <Route path="/resetPassword" element={<ResetPassword/>} />
      <Route path="/addTestDetails" element={<AddTestDetails/>} />
      <Route path="/listTestDetails" element={<ListTestDetails/>} />
      <Route path="/viewQuestions" element={<ViewQuestions />} />
      <Route path="/AlumniMap" element={<AlumniMap/>} />
    </Routes>
  </BrowserRouter>
</React.StrictMode>
);
