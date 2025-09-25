import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import { User } from '../types';

interface Message {
  id: number;
  text: string;
  senderId: string;
}

const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
  const [recipient, setRecipient] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  useEffect(() => {
    const fetchRecipient = async () => {
      if (userId) {
        const user = await apiService.getUserById(userId);
        setRecipient(user || null);
        // Simulate loading initial messages
        setMessages([
            { id: 1, text: `Hi! I saw your request for blood donation. How can I help?`, senderId: currentUser?.id || ''},
        ]);
      }
    };
    fetchRecipient();
  }, [userId, currentUser]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    
    const msg: Message = {
      id: Date.now(),
      text: newMessage,
      senderId: currentUser.id,
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');

    // Simulate a reply
    setTimeout(() => {
        const reply: Message = {
            id: Date.now() + 1,
            text: `Thank you for reaching out! We are at City General Hospital, room 302.`,
            senderId: userId || '',
        };
        setMessages(prev => [...prev, reply]);
    }, 1500);
  };
  
//   const generateEncouragingMessage = async () => {
//     // Placeholder for Gemini API call
//     const aiMessage = "Stay strong! Help is on the way. We're all thinking of you and your family during this time.";
//     setNewMessage(aiMessage);
//   };

  if (!recipient || !currentUser) {
    return <div>Loading chat...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[70vh]">
        <div className="p-4 border-b flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg">
                {recipient.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-brand-dark">Chat with {recipient.name}</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser.id ? 'bg-brand-blue text-white' : 'bg-gray-200 text-brand-dark'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          {/* 
          <button onClick={generateEncouragingMessage} className="text-xs text-brand-blue hover:underline mb-2">
            Generate Encouraging Message with AI
          </button>
          */}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
            <button type="submit" className="px-5 py-2 bg-brand-red text-white font-semibold rounded-full hover:bg-red-700">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
