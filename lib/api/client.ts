export interface User {
  id: string
  email: string | null
  photoURL: string | null
  twitterHandle: string | null
  name: string | null
  commitmentLevel: 'casual' | 'serious' | 'hardcore'
  projectDescription: string
  isOnboarded: boolean
  totalShips: number
  streakCount: number
  stars: number
  lastShipDate: string | null
  createdAt: string
  updatedAt: string
}

export interface LeaderboardUser {
  id: string
  commitmentLevel: string
  projectDescription: string
  twitterHandle: string
  totalShips: number
}

export interface OnboardingData {
  projectDescription: string
  commitmentLevel: 'casual' | 'serious' | 'hardcore'
}

export interface AuthResponse {
  uid: string
  email: string | null
  token: string
  isOnboarded: boolean
}

export class ApiClient {
  private baseUrl: string
  private token: string | null

  constructor() {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ship-backend-production.up.railway.app'
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'API request failed')
    }

    return response.json()
  }

  async login(idToken: string): Promise<AuthResponse> {
    if (!idToken) {
      throw new Error('ID token is required')
    }
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    })
    
    // Set the token in the instance after successful login
    if (response.token) {
      this.token = response.token
    }
    
    return response
  }

  async logout(): Promise<void> {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    })
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null
    }
    
    try {
      return await this.makeRequest('/users/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      })
    } catch (error) {
      // If the token is invalid, clear it
      this.token = null
      localStorage.removeItem('token')
      return null
    }
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token found')
    }
    return this.makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    })
  }

  async updateUser(data: Partial<User>): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token found')
    }
    return this.makeRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    })
  }

  async deleteUser(): Promise<void> {
    if (!this.token) {
      throw new Error('No authentication token found')
    }
    return this.makeRequest('/users/me', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    })
  }

  async getOnboardingStatus(): Promise<{ isOnboarded: boolean }> {
    return this.makeRequest('/onboarding/status', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
  }

  async onboardUser(data: OnboardingData): Promise<User> {
    return this.makeRequest('/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
  }

  async getLeaderboard(limit: number = 5): Promise<LeaderboardUser[]> {
    return this.makeRequest(`/leaderboard?limit=${limit}`)
  }

  async ping(): Promise<{ status: string; message: string }> {
    return this.makeRequest('/ping')
  }
}

export const apiClient = new ApiClient() 