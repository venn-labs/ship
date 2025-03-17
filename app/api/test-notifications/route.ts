import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    if (!db) {
      throw new Error("Database not initialized");
    }

    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    const testResults = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const { twitterUsername, email } = userData;

      if (!twitterUsername || !email) continue;

      const userRef = doc(db, "users", userDoc.id);
      const userSnap = await getDoc(userRef);
      const userStats = userSnap.data()?.stats || { streak: 0, totalTweets: 0, lastTweetDate: null };

      // Test all email types
      const emailTests = [
        {
          type: "encouragement" as const,
          data: {
            email,
            username: twitterUsername,
            daysSinceLastTweet: 5,
          },
        },
        {
          type: "disappointment" as const,
          data: {
            email,
            username: twitterUsername,
            daysSinceLastTweet: 10,
          },
        },
        {
          type: "streak" as const,
          data: {
            email,
            username: twitterUsername,
            streak: 7,
          },
        },
        {
          type: "milestone" as const,
          data: {
            email,
            username: twitterUsername,
            totalTweets: 50,
          },
        },
      ];

      for (const test of emailTests) {
        try {
          const result = await sendEmail(test.type, test.data);
          testResults.push({
            user: twitterUsername,
            emailType: test.type,
            success: result,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          testResults.push({
            user: twitterUsername,
            emailType: test.type,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      results: testResults,
      message: `Tested ${testResults.length} email notifications`,
    });
  } catch (error) {
    console.error("Error in test-notifications:", error);
    return NextResponse.json(
      { error: "Failed to run test notifications" },
      { status: 500 }
    );
  }
} 