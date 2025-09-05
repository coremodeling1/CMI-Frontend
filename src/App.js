import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Login from "./components/Login";
import HomePage from "./components/Homepage";
import ArtistsPage from "./components/ArtistsPage";
import AdminArtistsPage from "./components/AdminArtistsPage";
import Projects from "./components/Projects";
import RecruiterProjects from "./components/RecruiterProjects";
import AdminProjects from "./components/AdminProjects";
import Blogs from "./components/Blogs";
import AdminBlogs from "./components/AdminBlogs";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import PostedJobs from "./components/PostedJobs";
import AppliedJobs from "./components/AppliedJobs";
import Gallery from "./components/Gallery";   
import Recruiters from "./components/Recruiters";  // ✅ add this at the top

import BuyPremium from "./components/BuyPremium"; // ✅ Import

// Wrapper to conditionally render Navbar
const AppWrapper = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/signup"]; // paths where Navbar should be hidden
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/" />} />

        {/* ✅ New routes */}
        <Route
          path="/posted-jobs"
          element={
            <ProtectedRoute role="recruiter">
              <PostedJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applied-jobs"
          element={
            <ProtectedRoute role="artist">
              <AppliedJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Gallery />  {/* ✅ Logged-in user's gallery */}
            </ProtectedRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute role="artist">
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiterProjects"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminProjects"
          element={
            <ProtectedRoute role="admin">
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artists"
          element={
            <ProtectedRoute>
              {JSON.parse(localStorage.getItem("user"))?.role === "admin" ? (
                <AdminArtistsPage />
              ) : (
                <ArtistsPage />
              )}
            </ProtectedRoute>
          }
        />


        <Route
  path="/recruiters"
  element={
    <ProtectedRoute role="admin">
      <Recruiters />
    </ProtectedRoute>
  }
/>
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              {JSON.parse(localStorage.getItem("user"))?.role === "admin" ? (
                <Navigate to="/adminBlogs" />
              ) : (
                <Blogs />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminBlogs"
          element={
            <ProtectedRoute role="admin">
              <AdminBlogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
  path="/buy-premium"
  element={
    <ProtectedRoute>
      <BuyPremium />
    </ProtectedRoute>
  }
/>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
