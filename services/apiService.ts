import { BloodGroup, Sex, UserRole, User, BloodRequest, Donation } from '../types';

// Mock Database to simulate a backend
// NOTE: Hint, all user passwords are 'password123'
const MOCK_USERS: (User & { password?: string })[] = [
  {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'password123',
    phone: '123-456-7890',
    bloodGroup: BloodGroup.APositive,
    sex: Sex.Female,
    locality: 'Kollam City',
    role: UserRole.Volunteer,
    donations: 3,
  },
  {
    id: 'user-2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    password: 'password123',
    phone: '098-765-4321',
    bloodGroup: BloodGroup.ONegative,
    sex: Sex.Male,
    locality: 'Trivandrum City',
    role: UserRole.Requestor,
    donations: 0,
  },
  {
    id: 'user-3',
    name: 'Alex Ray',
    email: 'alex.ray@example.com',
    password: 'password123',
    phone: '555-555-5555',
    bloodGroup: BloodGroup.BPositive,
    sex: Sex.Other,
    locality: 'Adoor', // Pathanamthitta District
    role: UserRole.Both,
    donations: 7,
  },
  {
    id: 'user-4',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    password: 'password123',
    phone: '111-222-3333',
    bloodGroup: BloodGroup.APositive,
    sex: Sex.Female,
    locality: 'Kollam City',
    role: UserRole.Volunteer,
    donations: 1,
  },
];

const MOCK_REQUESTS: BloodRequest[] = [
  {
    id: 'req-1',
    requestorId: 'user-2',
    patientName: 'Anjali Menon',
    bloodGroup: BloodGroup.ONegative,
    units: 2,
    hospital: 'KIMS Hospital',
    locality: 'Trivandrum City',
    urgency: 'High',
    status: 'Open',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: 'req-2',
    requestorId: 'user-3',
    patientName: 'Karthik Pillai',
    bloodGroup: BloodGroup.APositive,
    units: 4,
    hospital: 'Travancore Medicity',
    locality: 'Kollam City',
    urgency: 'Medium',
    status: 'Open',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: 'req-3',
    requestorId: 'user-2',
    patientName: 'Suresh Iyer',
    bloodGroup: BloodGroup.BPositive,
    units: 1,
    hospital: 'General Hospital Alappuzha',
    locality: 'Alappuzha',
    urgency: 'Low',
    status: 'Closed',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
  },
];

const MOCK_DONATIONS: Donation[] = [
  {
    id: 'don-1',
    donorId: 'user-1',
    requestId: 'req-3',
    donationDate: new Date(new Date().setDate(new Date().getDate() - 9)),
    patientName: 'Suresh Iyer'
  },
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


class ApiService {
  private users: (User & { password?: string })[];
  private requests: BloodRequest[];
  private donations: Donation[];

  constructor() {
    this.users = JSON.parse(localStorage.getItem('mock_users') || 'null') || MOCK_USERS;
    this.requests = JSON.parse(localStorage.getItem('mock_requests') || 'null', (key, value) => {
        if (key === 'createdAt' || key === 'donationDate') return new Date(value);
        return value;
    }) || MOCK_REQUESTS;
    this.donations = JSON.parse(localStorage.getItem('mock_donations') || 'null', (key, value) => {
      if (key === 'donationDate') return new Date(value);
      return value;
    }) || MOCK_DONATIONS;

    this.persist();
  }

  private persist() {
      localStorage.setItem('mock_users', JSON.stringify(this.users));
      localStorage.setItem('mock_requests', JSON.stringify(this.requests));
      localStorage.setItem('mock_donations', JSON.stringify(this.donations));
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500);
    const user = this.users.find(u => u.email === email);
    if (user && user.password === password) {
      const token = `mock-token-for-${user.id}`;
      localStorage.setItem('authToken', token);
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword as User, token };
    }
    throw new Error('Invalid credentials');
  }

  async logout() {
    await delay(100);
    localStorage.removeItem('authToken');
  }

  async register(userData: Omit<User, 'id' | 'donations'> & { password: string }): Promise<{ user: User; token: string }> {
    await delay(500);
    if (this.users.some(u => u.email === userData.email)) {
        throw new Error('User with this email already exists.');
    }
    const newUser: User & { password?: string } = {
        ...userData,
        id: `user-${Date.now()}`,
        donations: 0
    };
    this.users.push(newUser);
    this.persist();
    return this.login(newUser.email, newUser.password!);
  }
  
  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    const token = localStorage.getItem('authToken');
    if (!token || !token.startsWith('mock-token-for-')) return null;
    const userId = token.replace('mock-token-for-', '');
    return this.getUserById(userId);
  }

  async getUserById(id: string): Promise<User | null> {
    await delay(100);
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  async getRequests(): Promise<BloodRequest[]> {
      await delay(300);
      return [...this.requests].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRequestById(id: string): Promise<BloodRequest | null> {
    await delay(100);
    return this.requests.find(r => r.id === id) || null;
  }

  async createRequest(requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): Promise<BloodRequest> {
    await delay(400);
    const newRequest: BloodRequest = {
        ...requestData,
        id: `req-${Date.now()}`,
        createdAt: new Date(),
        status: 'Open'
    };
    this.requests.unshift(newRequest); // Add to the top of the list
    this.persist();
    return newRequest;
  }

  async findMatches(requestId: string): Promise<User[]> {
      await delay(600);
      const request = await this.getRequestById(requestId);
      if (!request) return [];

      return this.users.filter(user => 
        (user.role === UserRole.Volunteer || user.role === UserRole.Both) &&
        user.bloodGroup === request.bloodGroup &&
        user.locality.toLowerCase() === request.locality.toLowerCase() &&
        user.id !== request.requestorId
      ).map(u => {
          const { password: _, ...userWithoutPassword } = u;
          return userWithoutPassword as User;
      });
  }
  
  async getDonationsByUserId(userId: string): Promise<Donation[]> {
      await delay(300);
      return this.donations.filter(d => d.donorId === userId)
            .sort((a,b) => b.donationDate.getTime() - a.donationDate.getTime());
  }

  async recordDonation(donorId: string, requestId: string): Promise<Donation> {
      await delay(500);
      const request = this.requests.find(r => r.id === requestId);
      const donor = this.users.find(u => u.id === donorId);
      if (!request || !donor) {
          throw new Error('Request or Donor not found.');
      }

      const newDonation: Donation = {
          id: `don-${Date.now()}`,
          donorId,
          requestId,
          donationDate: new Date(),
          patientName: request.patientName,
      };

      this.donations.push(newDonation);
      request.status = 'Matched'; // Or 'Closed' depending on business logic
      donor.donations += 1;
      
      this.persist();
      return newDonation;
  }
}

export const apiService = new ApiService();