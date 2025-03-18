const API_BASE_URL = 'http://localhost:8000/api'

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
}

export class ApiClient {
  private baseUrl: string
  private token: string | null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    })
  }

  async logout(): Promise<void> {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('token')
    if (!token) {
      return null
    }
    
    try {
      return await this.makeRequest('/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    } catch (error) {
      // If the token is invalid, clear it
      localStorage.removeItem('token')
      return null
    }
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }
    return this.makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async updateUser(data: Partial<User>): Promise<User> {
    return this.makeRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
  }

  async deleteUser(): Promise<void> {
    return this.makeRequest('/users/me', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
}

export const apiClient = new ApiClient() 