

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import Home from "./pages/Home.jsx";
// import Register from "./pages/Register.jsx";
// import Login from "./pages/Login.jsx";
// import RaiseComplaint from "./pages/RaiseComplaint.jsx";
// import MyComplaints from "./pages/MyComplaints.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import Header from "./components/Header.jsx"; // ✅ import Header

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         {/* ✅ Use the Header component */}
//         <Header />

//         <Routes>
//           <Route path="/" element={<Home />} />
         

//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />

//           <Route
//             path="/raise"
//             element={
//               <ProtectedRoute>
//                 <RaiseComplaint />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/my-complaints"
//             element={
//               <ProtectedRoute>
//                 <MyComplaints />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RaiseComplaint from "./pages/RaiseComplaint";
import MyComplaints from "./pages/MyComplaints";
import ManageComplaints from "./pages/ManageComplaints";

import AllComplaints from "./pages/AllComplaints";
import CreateFaculty from "./pages/CreateFaculty";
import ForgotPassword from "./pages/ForgotPassword";
import ManageFaculty from "./pages/ManageFaculty";
import FacultyComplaints from "./pages/FacultyComplaints";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          
          

          {/* Student Routes */}
          <Route
            path="/raise-complaint"
            element={
              <ProtectedRoute roles={["student"]}>
                <RaiseComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-complaints"
            element={
              <ProtectedRoute roles={["student"]}>
                <MyComplaints />
              </ProtectedRoute>
            }
          />

          {/* Staff/Admin Routes */}
          <Route
            path="/manage-complaints"
            element={
              <ProtectedRoute roles={["staff", "admin"]}>
                <ManageComplaints />
              </ProtectedRoute>
            }
          />
          <Route
  path="/department-complaints"
  element={
    <ProtectedRoute roles={["faculty"]}>
      <FacultyComplaints />
    </ProtectedRoute>
  }
/>

        
          {/* Admin Only */}
          
        
          {/* Admin / Staff Routes */}
          <Route
            path="/all-complaints"
            element={
              <ProtectedRoute roles={["staff", "admin"]}>
                <AllComplaints />
              </ProtectedRoute>
            }
          />
        
          <Route
        path="/create-faculty"
        element={
          <ProtectedRoute roles={["admin"]}>
            <CreateFaculty />
            
          </ProtectedRoute>
        }
        />
         <Route
        path="/manage-faculty"
        element={
          <ProtectedRoute roles={["admin"]}>
            <ManageFaculty />
            
          </ProtectedRoute>
        }
        />


          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


