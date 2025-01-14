import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Info } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('1234');
  const [password, setPassword] = useState('1234');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(username, password);
    } else {
      onRegister(username, password);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <Info size={20} />
          <h3 className="font-semibold">Demo Credentials</h3>
        </div>
        <p className="text-blue-600 text-sm">
          Username: <span className="font-mono bg-white px-2 py-0.5 rounded">1234</span>
        </p>
        <p className="text-blue-600 text-sm">
          Password: <span className="font-mono bg-white px-2 py-0.5 rounded">1234</span>
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 flex items-center justify-center gap-2"
        >
          {isLogin ? (
            <>
              <LogIn size={20} />
              Login
            </>
          ) : (
            <>
              <UserPlus size={20} />
              Register
            </>
          )}
        </motion.button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-purple-600 hover:text-purple-700 text-sm text-center w-full"
      >
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </motion.div>
  );
};