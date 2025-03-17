import { User } from 'firebase/auth';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
}

export interface UseAuth extends Omit<AuthState, 'initialized'> {
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface UserData {
  twitterHandle: string;
  commitmentLevel: 'casual' | 'serious' | 'hardcore';
  lastTweetDate?: string;
  streakCount: number;
  totalTweets: number;
  createdAt: string;
  updatedAt: string;
} 