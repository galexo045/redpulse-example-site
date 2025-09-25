import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import { BloodGroup, BloodRequest } from '../types';
import { BLOOD_GROUPS } from '../constants';
// Note: In a real app, geminiService would be implemented. Here we mock it.
// import { analyzeRequest } from '../services/geminiService';

const NewRequestPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(BloodGroup.APositive);
  const [units, setUnits] = useState(1);
  const [hospital, setHospital] = useState('');
  const [locality, setLocality] = useState(currentUser?.locality || '');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  // const [aiDescription, setAiDescription] = useState(''); // For Gemini feature
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        setError('You must be logged in to create a request.');
        return;
    }
    setLoading(true);
    setError('');
    try {
      const newRequestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'> = {
        requestorId: currentUser.id,
        patientName,
        bloodGroup,
        units,
        hospital,
        locality,
        urgency,
      };
      await apiService.createRequest(newRequestData);
      sessionStorage.setItem('requestCreated', 'true');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
//   const handleAiAnalysis = async () => {
//      // This is where you would call the Gemini API
//      // For now, it's a placeholder
//      alert("AI Analysis feature is not implemented in this demo.");
//   };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Create a Blood Request</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700">Describe your situation (AI-powered)</label>
              <textarea 
                value={aiDescription} 
                onChange={(e) => setAiDescription(e.target.value)}
                rows={3}
                placeholder="e.g., 'My father John needs 2 units of A+ blood urgently at City General Hospital in Downtown.'"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              ></textarea>
              <button type="button" onClick={handleAiAnalysis} className="mt-2 px-4 py-2 bg-brand-blue text-white text-sm rounded-md">Analyze with AI</button>
          </div>
          */}

          <div>
            <label className="block text-sm font-medium text-gray-700">Patient's Full Name</label>
            <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Group Needed</label>
              <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value as BloodGroup)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red">
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Units Required (Bags)</label>
              <input type="number" min="1" value={units} onChange={e => setUnits(parseInt(e.target.value))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700">Hospital</label>
              <input type="text" value={hospital} onChange={e => setHospital(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Locality</label>
              <input type="text" value={locality} onChange={e => setLocality(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Urgency Level</label>
            <select value={urgency} onChange={e => setUrgency(e.target.value as 'Low' | 'Medium' | 'High')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:bg-gray-400">
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewRequestPage;
