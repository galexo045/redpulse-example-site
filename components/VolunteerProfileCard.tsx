
import React from 'react';
import { User } from '../types';
import StarRating from './StarRating';
import { Link } from 'react-router-dom';

interface VolunteerProfileCardProps {
  volunteer: User;
  onNotify: (volunteer: User) => void;
}

const VolunteerProfileCard: React.FC<VolunteerProfileCardProps> = ({ volunteer, onNotify }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
          {volunteer.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-lg text-brand-dark">{volunteer.name}</h4>
          <p className="text-sm text-gray-500">{volunteer.locality}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="font-semibold text-brand-red">{volunteer.bloodGroup}</span>
            <StarRating donations={volunteer.donations} />
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => onNotify(volunteer)}
          className="px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
        >
          Notify
        </button>
        <Link
          to={`/chat/${volunteer.id}`}
          className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 transition text-center"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default VolunteerProfileCard;
