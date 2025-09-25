
import React from 'react';
import { Link } from 'react-router-dom';
import { BloodRequest } from '../types';

interface RequestCardProps {
  request: BloodRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const urgencyColor = {
    High: 'bg-red-100 text-red-800 border-red-500',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-500',
    Low: 'bg-green-100 text-green-800 border-green-500',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            Need {request.bloodGroup} Blood
          </h3>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${urgencyColor[request.urgency]}`}>
            {request.urgency.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Patient:</span> {request.patientName}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Location:</span> {request.hospital}, {request.locality}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Units Required:</span> {request.units}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{timeSince(request.createdAt)}</p>
          <Link
            to={`/request/${request.id}`}
            className="inline-flex items-center px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition"
          >
            View Details
            <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
