import React from 'react';

interface DonationConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationConfirmationModal: React.FC<DonationConfirmationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-6 text-center transform transition-all">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-brand-dark" id="modal-title">Thank You!</h3>
        <div className="mt-2 px-4 text-gray-600">
          <p>
            Your willingness to donate is a true gift. The requestor has been notified, and your donation has been recorded.
          </p>
        </div>
        <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-left">
            <p className="font-bold">Health &amp; Safety Reminder</p>
            <p className="text-sm">To ensure your well-being, there is a mandatory 59-day waiting period before your next blood donation.</p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-red text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationConfirmationModal;
