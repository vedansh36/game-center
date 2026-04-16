import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Signup() {
  const { signup }  = useAuth();
  const navigate    = useNavigate();
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6)       return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/games');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-dark-800 border border-dark-500 rounded-2xl p-8 shadow-2xl shadow-purple-500/5">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🚀</div>
            <h1 className="font-display text-2xl font-bold text-white">Join Game Centre</h1>
            <p className="text-gray-500 text-sm mt-2">Create your free account and start playing</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {[
              { name:'name',     label:'Name',            type:'text',     placeholder:'Your name',      autoComplete:'name' },
              { name:'email',    label:'Email',           type:'email',    placeholder:'you@example.com', autoComplete:'email' },
              { name:'password', label:'Password',        type:'password', placeholder:'Min 6 characters',autoComplete:'new-password' },
              { name:'confirm',  label:'Confirm Password',type:'password', placeholder:'••••••••',        autoComplete:'new-password' },
            ].map(f => (
              <div key={f.name}>
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5 block">{f.label}</label>
                <input
                  name={f.name} type={f.type} required autoComplete={f.autoComplete}
                  className="input-field" placeholder={f.placeholder}
                  value={form[f.name]} onChange={handle}
                />
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2 flex items-center justify-center gap-2">
              {loading ? <><LoadingSpinner size="sm" /> Creating account…</> : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
