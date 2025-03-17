import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, updateDoc, increment, setDoc, getDoc, doc } from "firebase/firestore";
import { getTweetsForUser } from "@/lib/twitter";
import { sendEmail } from "@/lib/email";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeTweet(tweet: string) {
  const prompt = `Analyze this tweet and determine if it's a valid project update. A valid update should:
1. Be about the user's own project or work
2. Show progress, learning, or challenges
3. Not be a retweet or reply
4. Be substantive (not just a link or emoji)

Tweet: "${tweet}"

Respond with only "true" or "false".`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content?.toLowerCase() === "true";
}

export async function GET() {
  try {
    if (!db) {
      throw new Error("Database not initialized");
    }

    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const { twitterUsername, email } = userData;

      if (!twitterUsername || !email) continue;

      try {
        const tweets = await getTweetsForUser(twitterUsername);
        let hasValidTweet = false;

        for (const tweet of tweets) {
          const isValid = await analyzeTweet(tweet.text);
          if (isValid) {
            hasValidTweet = true;
            break;
          }
        }

        const userRef = doc(db, "users", userDoc.id);
        const userSnap = await getDoc(userRef);
        const userStats = userSnap.data()?.stats || { streak: 0, totalTweets: 0, lastTweetDate: null };

        if (hasValidTweet) {
          // Update streak and stats
          const today = new Date();
          const lastTweetDate = userStats.lastTweetDate ? new Date(userStats.lastTweetDate) : null;
          
          if (!lastTweetDate || lastTweetDate.getDate() !== today.getDate()) {
            const streakIncrement = (!lastTweetDate || lastTweetDate.getDate() === today.getDate() - 1) ? 1 : 0;
            
            await updateDoc(userRef, {
              "stats.streak": increment(streakIncrement),
              "stats.totalTweets": increment(1),
              "stats.lastTweetDate": today.toISOString(),
            });

            // Send streak email if streak is a multiple of 7
            if (streakIncrement > 0 && (userStats.streak + 1) % 7 === 0) {
              await sendEmail("streak", {
                email,
                username: twitterUsername,
                streak: userStats.streak + 1,
              });
            }

            // Send milestone email for every 50 tweets
            if ((userStats.totalTweets + 1) % 50 === 0) {
              await sendEmail("milestone", {
                email,
                username: twitterUsername,
                totalTweets: userStats.totalTweets + 1,
              });
            }
          }
        } else {
          // Check for inactivity and send appropriate email
          const daysSinceLastTweet = userStats.lastTweetDate 
            ? Math.floor((new Date().getTime() - new Date(userStats.lastTweetDate).getTime()) / (1000 * 60 * 60 * 24))
            : 0;

          if (daysSinceLastTweet >= 3 && daysSinceLastTweet < 7) {
            await sendEmail("encouragement", {
              email,
              username: twitterUsername,
              daysSinceLastTweet,
            });
          } else if (daysSinceLastTweet >= 7) {
            await sendEmail("disappointment", {
              email,
              username: twitterUsername,
              daysSinceLastTweet,
            });
          }

          // Reset streak if no valid tweets
          if (userStats.streak > 0) {
            await updateDoc(userRef, {
              "stats.streak": 0,
            });
          }
        }
      } catch (error) {
        console.error(`Error processing user ${twitterUsername}:`, error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in check-tweets:", error);
    return NextResponse.json({ error: "Failed to check tweets" }, { status: 500 });
  }
} 