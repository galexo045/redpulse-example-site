import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import { BloodRequest, UserRole } from '../types';
import RequestCard from '../components/RequestCard';
import { Link } from 'react-router-dom';
import DonationCooldownTimer from '../components/DonationCooldownTimer';
import Notification from '../components/Notification';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const requestCreated = sessionStorage.getItem('requestCreated');
    if (requestCreated) {
        setNotification({
            message: 'Request submitted! Matching volunteers are being notified.',
            type: 'success'
        });
        sessionStorage.removeItem('requestCreated');
    }

    const fetchRequests = async () => {
      setLoading(true);
      const allRequests = await apiService.getRequests();
      setRequests(allRequests);
      setLoading(false);
    };
    fetchRequests();
  }, []);
  
  const isVolunteer = currentUser?.role === UserRole.Volunteer || currentUser?.role === UserRole.Both;
  const isRequestor = currentUser?.role === UserRole.Requestor || currentUser?.role === UserRole.Both;

  const myRequests = useMemo(() => 
    requests.filter(req => req.requestorId === currentUser?.id),
  [requests, currentUser]);

  const matchingRequests = useMemo(() => {
    if (!isVolunteer || !currentUser) return [];
    // A simplified matching for dashboard view: same blood group and locality
    return requests.filter(req => req.bloodGroup === currentUser.bloodGroup && req.locality === currentUser.locality && req.status === 'Open');
  }, [requests, currentUser, isVolunteer]);


  if (!currentUser) return null;

  return (
    <div>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Welcome, {currentUser.name}!</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            {isVolunteer && (
                <div className="mb-8 space-y-8">
                    <DonationCooldownTimer />
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 border-b-2 border-brand-red pb-2">Matching Requests for You</h2>
                        {loading ? <p>Finding requests...</p> : (
                            matchingRequests.length > 0 ? (
                                <div className="space-y-4">
                                    {matchingRequests.map(req => <RequestCard key={req.id} request={req} />)}
                                </div>
                            ) : (
                                <p className="text-gray-600 bg-white p-4 rounded-lg border">No open requests matching your blood group and locality right now. We'll notify you!</p>
                            )
                        )}
                    </div>
                </div>
            )}
             {isRequestor && (
                <div>
                    <div className="flex justify-between items-center mb-4 border-b-2 border-brand-red pb-2">
                        <h2 className="text-2xl font-semibold">Your Active Requests</h2>
                        <Link to="/request/new" className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 transition">
                            + New Request
                        </Link>
                    </div>
                    {loading ? <p>Loading your requests...</p> : (
                        myRequests.length > 0 ? (
                            <div className="space-y-4">
                                {myRequests.map(req => <RequestCard key={req.id} request={req} />)}
                            </div>
                        ) : (
                            <p className="text-gray-600 bg-white p-4 rounded-lg border">You haven't made any requests yet.</p>
                        )
                    )}
                </div>
            )}
        </div>
        <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-bold mb-4">Your Profile</h3>
                <div className="space-y-2">
                    <p><span className="font-semibold">Email:</span> {currentUser.email}</p>
                    <p><span className="font-semibold">Phone:</span> {currentUser.phone}</p>
                    <p><span className="font-semibold">Blood Group:</span> <span className="font-bold text-brand-red">{currentUser.bloodGroup}</span></p>
                    <p><span className="font-semibold">Locality:</span> {currentUser.locality}</p>
                    <p><span className="font-semibold">Role:</span> {currentUser.role}</p>
                    <Link to="/profile" className="text-brand-blue hover:underline mt-4 block">View Full Profile →</Link>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
