import { User, BloodRequest, BloodGroup, Sex, UserRole, Donation } from '../types';

// --- MOCK DATA & API LOGIC ---
// To create a self-contained example, the mock API is now part of this service file.

// Internal type for mock data that includes a password
type MockUser = User & { password?: string };

const users: MockUser[] = [
  { id: '1', name: 'S.gopikrishna', email: 'sgopikrishna0045@gmail.com', password: 'sgopikrishna123', phone: '123-456-7890', bloodGroup: BloodGroup.APositive, sex: Sex.Male, locality: 'Kollam Town', role: UserRole.Volunteer, donations: 3 },
  { id: '2', name: 'akshay sunil', email: 'akshaypadmagiri@gmail.com', password: 'akshaysunil123', phone: '234-567-8901', bloodGroup: BloodGroup.ONegative, sex: Sex.Female, locality: 'Umayanalloor', role: UserRole.Both, donations: 5 },
  { id: '3', name: 'ransom tasya', email: 'ransomtasya2006@gmail.com', password: 'tasya123', phone: '345-678-9012', bloodGroup: BloodGroup.BPositive, sex: Sex.Male, locality: 'Palathara', role: UserRole.Requestor, donations: 0 },
  { id: '4', name: 'adithyan p', email: 'adithyanpmanikuttan@gmail.com', password: 'adithyan123', phone: '456-789-0123', bloodGroup: BloodGroup.APositive, sex: Sex.Female, locality: 'Kollam Town', role: UserRole.Volunteer, donations: 1 },
];

let requests: BloodRequest[] = [
  { id: '101', requestorId: '3', patientName: 'Anil Kumar', bloodGroup: BloodGroup.BPositive, units: 2, hospital: 'N.S. Memorial Hospital', locality: 'Palathara', urgency: 'High', status: 'Open', createdAt: new Date(Date.now() - 86400000) },
  { id: '102', requestorId: '2', patientName: 'Sunitha George', bloodGroup: BloodGroup.ONegative, units: 1, hospital: 'Travancore Medicity', locality: 'Umayanalloor', urgency: 'Medium', status: 'Open', createdAt: new Date(Date.now() - 172800000) },
  { id: '103', requestorId: '3', patientName: 'Ramesh Pillai', bloodGroup: BloodGroup.APositive, units: 3, hospital: 'Bishop Benziger Hospital', locality: 'Kollam Town', urgency: 'High', status: 'Open', createdAt: new Date(Date.now() - 259200000)},
  { id: '104', requestorId: '2', patientName: 'Fathima Beevi', bloodGroup: BloodGroup.ABPositive, units: 1, hospital: 'Azeezia Medical College', locality: 'Meeyannoor', urgency: 'Low', status: 'Open', createdAt: new Date(Date.now() - 345600000)},
  { id: '105', requestorId: '3', patientName: 'Varghese Mathew', bloodGroup: BloodGroup.OPositive, units: 4, hospital: 'Holy Cross Hospital', locality: 'Kottiyam', urgency: 'High', status: 'Matched', createdAt: new Date(Date.now() - 86400000)},
];

let donations: Donation[] = [
  { id: 'd1', donorId: '1', requestId: '103', donationDate: new Date('2024-06-15T10:00:00Z'), patientName: 'Ramesh Pillai' },
  { id: 'd2', donorId: '1', requestId: 'past_req_1', donationDate: new Date('2024-04-01T14:30:00Z'), patientName: 'Past Patient A' },
  { id: 'd3', donorId: '1', requestId: 'past_req_2', donationDate: new Date('2024-01-20T09:00:00Z'), patientName: 'Past Patient B' },
  { id: 'd4', donorId: '2', requestId: '101', donationDate: new Date('2024-05-30T11:00:00Z'), patientName: 'Anil Kumar' },
  { id: 'd5', donorId: '2', requestId: 'past_req_3', donationDate: new Date('2024-03-10T18:00:00Z'), patientName: 'Past Patient C' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Notification Logic ---
const notifyMatches = (newRequest: BloodRequest) => {
  console.log(`--- Initiating notification for new request: ${newRequest.patientName} ---`);
  const matches = users.filter(user =>
    (user.role === UserRole.Volunteer || user.role === UserRole.Both) &&
    user.bloodGroup === newRequest.bloodGroup &&
    user.locality.toLowerCase() === newRequest.locality.toLowerCase()
  );

  if (matches.length > 0) {
    matches.forEach(match => {
      // In a real app, this would trigger an email, SMS, or push notification service.
      console.log(`[Notification] Simulating email to ${match.email} for new blood request for ${newRequest.bloodGroup} in ${newRequest.locality}.`);
    });
  } else {
    console.log(`[Notification] No matching volunteers found for request for ${newRequest.patientName}.`);
  }
};


// --- Service Functions ---

const login = async (email: string, password: string): Promise<{ user: User }> => {
  await delay(500);
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('authToken', user.id);
    const { password, ...userWithoutPassword } = user; // Don't send password to frontend state
    return { user: userWithoutPassword };
  }
  throw new Error("Invalid credentials. Hint: use an email from mock data and password 'password123'");
};

const register = async (userData: Omit<User, 'id' | 'donations'> & { password: string }): Promise<{ user: User }> => {
    await delay(500);
    if (users.some(u => u.email === userData.email)) {
        throw new Error("An account with this email already exists.");
    }

    const newUser: MockUser = {
      ...userData,
      id: String(Date.now()), // More robust ID
      donations: 0,
    };
    users.push(newUser);
    localStorage.setItem('authToken', newUser.id);
    
    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
};

const logout = (): void => {
    localStorage.removeItem('authToken');
};

const getCurrentUser = async (): Promise<User | null> => {
    const userId = localStorage.getItem('authToken');
    if (!userId) return null;
    await delay(50);
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const getRequests = async (): Promise<BloodRequest[]> => {
  await delay(500);
  return [...requests].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const getRequestById = async (id: string): Promise<BloodRequest | undefined> => {
  await delay(200);
  return requests.find(r => r.id === id);
};

const createRequest = async (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): Promise<BloodRequest> => {
  await delay(1000);
  const newRequest: BloodRequest = {
    ...requestData,
    id: String(Date.now()),
    createdAt: new Date(),
    status: 'Open',
  };
  requests.push(newRequest);
  
  // Trigger notification logic
  notifyMatches(newRequest);

  return newRequest;
};

const getUserById = async (id:string): Promise<User | undefined> => {
    await delay(200);
    const user = users.find(u => u.id === id);
    if (!user) return undefined;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const recordDonation = async (donorId: string, requestId: string): Promise<Donation> => {
  await delay(300);
  const user = users.find(u => u.id === donorId);
  const request = requests.find(r => r.id === requestId);

  if (!user || !request) {
    throw new Error('User or Request not found');
  }

  user.donations += 1;
  request.status = 'Matched';

  const newDonation: Donation = {
    id: `d${Date.now()}`,
    donorId,
    requestId,
    donationDate: new Date(),
    patientName: request.patientName,
  };
  donations.push(newDonation);
  return newDonation;
};

const getDonationsByUserId = async (userId: string): Promise<Donation[]> => {
    await delay(400);
    return donations.filter(d => d.donorId === userId).sort((a, b) => b.donationDate.getTime() - a.donationDate.getTime());
};

const findMatches = async (requestId: string): Promise<User[]> => {
  const request = await getRequestById(requestId);
  if(!request) return [];
  await delay(700);
  const matchingUsers = users.filter(user =>
      (user.role === UserRole.Volunteer || user.role === UserRole.Both) &&
      user.bloodGroup === request.bloodGroup &&
      user.locality.toLowerCase() === request.locality.toLowerCase()
  );
  // Remove password from returned users
  return matchingUsers.map(({password, ...user}) => user);
};


export const apiService = {
  login,
  register,
  logout,
  getCurrentUser,
  getRequests,
  getRequestById,
  createRequest,
  getUserById,
  recordDonation,
  getDonationsByUserId,
  findMatches,
};