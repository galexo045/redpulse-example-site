
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import StarRating from '../components/StarRating';
import { Navigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Donation } from '../types';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [donationHistory, setDonationHistory] = useState<Donation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchDonationHistory = async () => {
        try {
          setLoadingHistory(true);
          const history = await apiService.getDonationsByUserId(currentUser.id);
          setDonationHistory(history);
        } catch (error) {
          console.error("Failed to fetch donation history", error);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchDonationHistory();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const isVolunteer = currentUser.role.includes('Volunteer');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-brand-blue h-32 p-6">
           <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-white text-brand-blue rounded-full flex items-center justify-center font-bold text-5xl border-4 border-white shadow-md">
                    {currentUser.name.charAt(0)}
                </div>
                <div>
                     <h1 className="text-3xl font-bold text-white">{currentUser.name}</h1>
                     <p className="text-blue-200">{currentUser.email}</p>
                </div>
           </div>
        </div>
        <div className="p-6">
            <h2 className="text-xl font-bold text-brand-dark mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="bg-gray-50 p-3 rounded-lg"><strong>Phone:</strong> {currentUser.phone}</div>
                <div className="bg-gray-50 p-3 rounded-lg"><strong>Sex:</strong> {currentUser.sex}</div>
                <div className="bg-gray-50 p-3 rounded-lg"><strong>Locality:</strong> {currentUser.locality}</div>
                <div className="bg-gray-50 p-3 rounded-lg"><strong>Role:</strong> {currentUser.role}</div>
            </div>
            
            {isVolunteer && (
                <>
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-brand-dark mb-4">Volunteer Status</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-red-50 p-4 rounded-lg text-center">
                                <p className="text-sm text-red-700 font-semibold">Blood Group</p>
                                <p className="text-3xl font-extrabold text-brand-red">{currentUser.bloodGroup}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                <p className="text-sm text-yellow-700 font-semibold">Donations Made</p>
                                <p className="text-3xl font-extrabold text-yellow-800">{currentUser.donations}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-sm text-blue-700 font-semibold">Volunteer Rank</p>
                                <div className="flex justify-center mt-2">
                                <StarRating donations={currentUser.donations} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-brand-dark mb-4">Donation History</h2>
                        {loadingHistory ? (
                            <p className="text-gray-500">Loading donation history...</p>
                        ) : donationHistory.length > 0 ? (
                            <div className="border border-gray-200 rounded-lg">
                                <ul className="divide-y divide-gray-200">
                                {donationHistory.map(donation => (
                                    <li key={donation.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div>
                                            <p className="font-semibold text-brand-dark">Donated to: <span className="font-normal">{donation.patientName}</span></p>
                                            <p className="text-sm text-gray-500">Request ID: {donation.requestId}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">{new Date(donation.donationDate).toLocaleDateString()}</p>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border">No past donations recorded.</p>
                        )}
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;