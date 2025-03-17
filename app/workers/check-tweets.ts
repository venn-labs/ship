import { db } from '@/lib/firebase/index'
import { collection, query, getDocs, where, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { getTweetsForUser } from '@/lib/twitter'
import OpenAI from 'openai'

export interface Env {
  OPENAI_API_KEY: string
  TWITTER_BEARER_TOKEN: string
  CRON_SECRET: string
}

const openai = new OpenAI()

async function analyzeTweet(tweetText: string, projectDescription: string, env: Env) {
  const openaiClient = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  })

  const prompt = `
    Analyze if this tweet is about the user's project described as: "${projectDescription}"
    
    Tweet: "${tweetText}"
    
    Consider:
    1. Does the tweet mention work, progress, updates, or shipping related to the project?
    2. Are there specific features, bugs, or improvements mentioned?
    3. Is this a meaningful update (not just a retweet or casual mention)?
    
    Respond with just "true" if this is a valid project update, or "false" if not.
  `

  const response = await openaiClient.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  })

  return response.choices[0].message.content?.toLowerCase().includes('true')
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    if (!db) {
      console.error('Database not initialized')
      return
    }

    try {
      // Get all users
      const usersRef = collection(db, 'users')
      const usersSnapshot = await getDocs(usersRef)
      
      const now = new Date()
      const yesterday = new Date(now.setDate(now.getDate() - 1))

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data()
        
        // Skip if user has already shipped today
        if (userData.lastShipDate && new Date(userData.lastShipDate.seconds * 1000) > yesterday) {
          continue
        }

        // Skip if no project or Twitter handle
        if (!userData.project || !userData.twitterHandle) {
          continue
        }

        // Get user's recent tweets
        const tweets = await getTweetsForUser(userData.twitterHandle)
        
        // Check each tweet from the last 24 hours
        for (const tweet of tweets) {
          const tweetDate = new Date(tweet.created_at)
          if (tweetDate < yesterday) continue

          // Analyze tweet content
          const isProjectUpdate = await analyzeTweet(tweet.text, userData.project, env)
          
          if (isProjectUpdate) {
            // Update user's stats
            const userRef = doc(db, 'users', userDoc.id)
            await updateDoc(userRef, {
              lastShipDate: Timestamp.now(),
              streakCount: (userData.streakCount || 0) + 1,
              totalShips: (userData.totalShips || 0) + 1,
              stars: (userData.stars || 0) + (userData.streakCount % 7 === 0 ? 5 : 1),
              lastCheckedTweet: tweet.id,
            })
            break // Stop checking tweets once we find a valid update
          }
        }

        // Check if streak should be reset (no valid tweets found)
        if (!userData.lastShipDate || 
            new Date(userData.lastShipDate.seconds * 1000) < yesterday) {
          const userRef = doc(db, 'users', userDoc.id)
          await updateDoc(userRef, {
            streakCount: 0,
          })
        }
      }
    } catch (error) {
      console.error('Error checking tweets:', error)
    }
  },
} 