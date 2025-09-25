import React, { useState, useEffect } from 'react';

const COOLDOWN_DAYS = 59;

const DonationCooldownTimer: React.FC = () => {
  const [cooldownEndDate, setCooldownEndDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const lastDonationDateStr = localStorage.getItem('lastDonationDate');
    if (lastDonationDateStr) {
      const lastDonationDate = new Date(lastDonationDateStr);
      const endDate = new Date(lastDonationDate.getTime());
      endDate.setDate(endDate.getDate() + COOLDOWN_DAYS);
      setCooldownEndDate(endDate);
    }
  }, []);

  useEffect(() => {
    if (!cooldownEndDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = cooldownEndDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('');
        localStorage.removeItem('lastDonationDate');
        setCooldownEndDate(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft() || '');
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownEndDate]);

  if (!timeLeft) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-6 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-brand-blue mb-2">Next Donation Availability</h3>
      <p className="text-4xl font-bold text-brand-dark tracking-wider font-mono">{timeLeft}</p>
      <p className="text-sm text-gray-600 mt-2">
        You are in a cooldown period to ensure your health and safety. Thank you for your recent donation!
      </p>
    </div>
  );
};

export default DonationCooldownTimer;
