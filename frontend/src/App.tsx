import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotesProvider } from "./contexts/NotesContext";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute"; // Add this

function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute> {/* Wrap with ProtectedRoute */}
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;
