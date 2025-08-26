import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import AddUser from "./components/AddUser";
import StudentPortal from "./components/StudentPortal";
import LoginForm from "./components/LoginForm";
import AdminPage from "./components/AdminPage";
import StudentLogin from "./components/StudentLogin";
import FacultyLogin from "./components/FacultyLogin";
import Register from "./components/Register";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";
import UpdateStudent from "./components/UpdateStudent";
import EditStudent from "./components/EditStudent";
import StudentPage from "./components/StudentPage"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/studentPortal" element={<StudentPortal />} />
      <Route path="/LoginForm" element={<LoginForm />} />
      <Route path="/AdminPage" element={<AdminPage />} />
      <Route path="/StudentLogin" element={<StudentLogin />} />
      <Route path="/FacultyLogin" element={<FacultyLogin />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/AddStudent" element={<AddStudent />} />
      <Route path="/StudentList" element={<StudentList />} />
      <Route path="/UpdateStudent" element={<UpdateStudent />} />
      <Route path="/editStudent/:id" element={<EditStudent />} />
      <Route path="/StudentPage" element={<StudentPage />} />
    </Routes>
  </BrowserRouter>
</React.StrictMode>
);
