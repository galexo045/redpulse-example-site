import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { BLOOD_GROUPS, SEX_OPTIONS, USER_ROLES } from '../constants';
import { BloodGroup, Sex, UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(BloodGroup.APositive);
  const [sex, setSex] = useState<Sex>(Sex.Male);
  const [locality, setLocality] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Volunteer);
  const [passwordError, setPasswordError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!isLogin && password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({ name, email, phone, bloodGroup, sex, locality, role, password });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-center font-semibold transition ${isLogin ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-center font-semibold transition ${!isLogin ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-500'}`}
          >
            Register
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
             <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
              </div>
             </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
          </div>
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Locality</label>
                <input type="text" value={locality} onChange={e => setLocality(e.target.value)} required placeholder="e.g., Downtown" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                  <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value as BloodGroup)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red">
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sex</label>
                  <select value={sex} onChange={e => setSex(e.target.value as Sex)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red">
                    {SEX_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">I want to be a</label>
                <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red">
                  {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </>
          )}

          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:bg-gray-400">
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;