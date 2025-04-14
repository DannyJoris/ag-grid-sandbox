import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resizeToFullScreen } from '@/utils/openfin';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [fullScreen, setFullScreen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('ag-grid-demo-user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    }
  };

  useEffect(() => {
    async function fullScreen() {
      await resizeToFullScreen();
      setFullScreen(true);
    }
    void fullScreen();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {fullScreen && (
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500 text-white p-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={credentials.username}
                name="ag-grid-demo-username"
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={credentials.password}
                name="ag-grid-demo-password"
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            <div className="mb-6 text-sm text-gray-500">Demo credentials: demo/password123</div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
        )}
    </div>
  );
};

export default Login; 