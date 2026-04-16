import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/games');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-dark-800 border border-dark-500 rounded-2xl p-8 shadow-2xl shadow-purple-500/5">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="font-display text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-2">Login to your Game Centre account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                name="email" type="email" required autoComplete="email"
                className="input-field" placeholder="you@example.com"
                value={form.email} onChange={handle}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5 block">Password</label>
              <input
                name="password" type="password" required autoComplete="current-password"
                className="input-field" placeholder="••••••••"
                value={form.password} onChange={handle}
              />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2 flex items-center justify-center gap-2">
              {loading ? <><LoadingSpinner size="sm" /> Logging in…</> : 'Login →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{' '}
            <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
