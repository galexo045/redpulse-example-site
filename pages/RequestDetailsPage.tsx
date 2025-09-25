import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { BloodRequest, User, UserRole } from '../types';
import { useAuth } from '../hooks/useAuth';
import VolunteerProfileCard from '../components/VolunteerProfileCard';
import Notification from '../components/Notification';
import DonationConfirmationModal from '../components/DonationConfirmationModal';

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [requestor, setRequestor] = useState<User | null>(null);
  const [matches, setMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const fetchRequestDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const reqData = await apiService.getRequestById(id);
      if (reqData) {
        setRequest(reqData);
        const requestorData = await apiService.getUserById(reqData.requestorId);
        setRequestor(requestorData || null);

        if (currentUser && currentUser.id === reqData.requestorId) {
          const matchData = await apiService.findMatches(reqData.id);
          setMatches(matchData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  const handleNotify = (volunteer: User) => {
    // Simulate email notification
    console.log(`Simulating email to ${volunteer.email} for request ${request?.id}`);
    setNotification({ message: `A notification has been sent to ${volunteer.name}'s registered email.`, type: 'info' });
  };
  
  const handleAcceptRequest = async () => {
      if (!currentUser || !request) return;
      try {
        await apiService.recordDonation(currentUser.id, request.id);
        localStorage.setItem('lastDonationDate', new Date().toISOString());
        setShowConfirmationModal(true);
        fetchRequestDetails(); // Re-fetch to update status on page
      } catch (error) {
        console.error("Failed to accept request:", error);
        setNotification({ message: 'There was an error recording your donation. Please try again.', type: 'error' });
      }
  };

  if (loading) return <p className="text-center">Loading request details...</p>;
  if (!request || !requestor) return <p className="text-center">Request not found.</p>;

  const isOwner = currentUser?.id === request.requestorId;
  const isVolunteer = currentUser && (currentUser.role === UserRole.Volunteer || currentUser.role === UserRole.Both);


  return (
    <div className="max-w-4xl mx-auto">
        <DonationConfirmationModal isOpen={showConfirmationModal} onClose={() => setShowConfirmationModal(false)} />
        {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                 <h1 className="text-3xl font-bold text-brand-dark">Request for {request.patientName}</h1>
                 <span className={`text-sm font-bold px-3 py-1 rounded-full ${request.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{request.status}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-gray-700">
                <p><strong>Blood Group Required:</strong> <span className="text-2xl font-bold text-brand-red">{request.bloodGroup}</span></p>
                <p><strong>Units:</strong> <span className="font-bold">{request.units}</span></p>
                <p><strong>Location:</strong> <span className="font-bold">{request.hospital}, {request.locality}</span></p>
                <p><strong>Posted:</strong> <span className="font-bold">{new Date(request.createdAt).toLocaleDateString()}</span></p>
                <div>
                    <p><strong>Requestor:</strong> <span className="font-bold">{requestor.name}</span></p>
                    {isOwner && (
                        <div className="mt-1 pl-4 text-sm text-gray-600 border-l-2 border-gray-200">
                            <p><strong>Email:</strong> {requestor.email}</p>
                            <p><strong>Phone:</strong> {requestor.phone}</p>
                        </div>
                    )}
                </div>
            </div>

            {isOwner && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4 border-b-2 border-brand-red pb-2">Potential Donors</h2>
                    {matches.length > 0 ? (
                        <div className="space-y-4">
                            {matches.map(volunteer => (
                                <VolunteerProfileCard key={volunteer.id} volunteer={volunteer} onNotify={handleNotify} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border">No volunteers found matching this specific request's criteria in your locality. You can expand your search or wait for new volunteers to sign up.</p>
                    )}
                </div>
            )}

            {isVolunteer && !isOwner && request.status === 'Open' && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4 text-brand-dark">Ready to Help?</h2>
                    <p className="text-gray-600 mb-6">You are a potential match for this request. Please contact the requestor for coordination or accept the request to notify them of your willingness to donate.</p>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleAcceptRequest}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
                        >
                            Accept Request
                        </button>
                        <Link 
                            to={`/chat/${request.requestorId}`}
                            className="px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition-transform transform hover:scale-105 text-center"
                        >
                            Contact Requestor
                        </Link>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default RequestDetailsPage;