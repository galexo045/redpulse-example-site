
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { USER_ROLES } from '../constants';
import Notification from '../components/Notification';

const SettingsPage: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  
  // State for profile info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Volunteer);

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [passwordError, setPasswordError] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      setLocality(currentUser.locality);
      setRole(currentUser.role);
    }
  }, [currentUser]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);
    setProfileError('');
    try {
      await updateUser({ name, email, phone, locality, role });
      setNotification({ message: 'Profile updated successfully!', type: 'success' });
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setNotification(null);
    try {
      await updateUser({ currentPassword, newPassword });
      setNotification({ message: 'Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (e) {
        setPasswordError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red";

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <h1 className="text-3xl font-bold text-brand-dark">Account Settings</h1>
      
      {/* Profile Information Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Locality</label>
              <input type="text" value={locality} onChange={e => setLocality(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <select value={role} onChange={e => setRole(e.target.value as UserRole)} className={inputClass}>
                {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          {profileError && <p className="text-red-500 text-sm mt-2">{profileError}</p>}
          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full md:w-auto flex justify-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required className={inputClass} />
          </div>
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full md:w-auto flex justify-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:bg-gray-400">
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
