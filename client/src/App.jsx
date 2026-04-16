import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar    from './components/Navbar';
import Footer    from './components/Footer';
import Home      from './pages/Home';
import Login     from './pages/Login';
import Signup    from './pages/Signup';
import Games     from './pages/Games';
import GamePlay  from './pages/GamePlay';
import Profile   from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/signup"      element={<Signup />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/games"       element={<ProtectedRoute><Games /></ProtectedRoute>} />
              <Route path="/games/:slug" element={<ProtectedRoute><GamePlay /></ProtectedRoute>} />
              <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
