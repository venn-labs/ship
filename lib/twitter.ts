import { Client } from 'twitter-api-sdk'

const client = new Client(process.env.TWITTER_BEARER_TOKEN!)

export async function getTweetsForUser(username: string) {
  try {
    // Get user ID from username
    const user = await client.users.findUserByUsername(username)
    if (!user.data) {
      throw new Error('User not found')
    }

    // Get recent tweets
    const tweets = await client.tweets.usersIdTweets(user.data.id, {
      max_results: 10,
      'tweet.fields': ['created_at', 'text'],
      exclude: ['retweets', 'replies']
    })

    return tweets.data || []
  } catch (error) {
    console.error('Error fetching tweets:', error)
    return []
  }
} 