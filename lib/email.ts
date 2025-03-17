import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailType = 'encouragement' | 'disappointment' | 'streak' | 'milestone';

interface EmailData {
  email: string;
  username: string;
  streak?: number;
  daysSinceLastTweet?: number;
  totalTweets?: number;
}

const emailTemplates = {
  encouragement: ({ username, daysSinceLastTweet }: EmailData) => ({
    subject: "Hey! We miss your updates!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF2DAB;">Hey ${username}! 👋</h1>
        <p>We noticed you haven't shared an update in ${daysSinceLastTweet} days. Remember, consistency is key to building in public!</p>
        <p>Even small updates matter. Share your progress, challenges, or learnings - your community is here to support you!</p>
        <p style="color: #666; font-size: 14px;">Keep building, keep shipping! 🚀</p>
      </div>
    `
  }),
  disappointment: ({ username, daysSinceLastTweet }: EmailData) => ({
    subject: "We're worried about your progress",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF2DAB;">${username}, we need to talk</h1>
        <p>It's been ${daysSinceLastTweet} days since your last update. Building in public is about consistency and accountability.</p>
        <p>Are you facing any challenges? We're here to help! Join our community and share what's blocking you.</p>
        <p style="color: #666; font-size: 14px;">Let's get back on track together! 💪</p>
      </div>
    `
  }),
  streak: ({ username, streak }: EmailData) => ({
    subject: `🔥 ${streak} Day Streak! Keep it up!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF2DAB;">Amazing work, ${username}! 🎉</h1>
        <p>You're on a ${streak}-day streak! This is incredible consistency!</p>
        <p>Your dedication to building in public is inspiring. Keep pushing forward!</p>
        <p style="color: #666; font-size: 14px;">You're crushing it! 💪</p>
      </div>
    `
  }),
  milestone: ({ username, totalTweets }: EmailData) => ({
    subject: `🎉 Milestone Alert: ${totalTweets} Updates!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF2DAB;">Congratulations ${username}! 🎉</h1>
        <p>You've reached an amazing milestone: ${totalTweets} public updates!</p>
        <p>Your commitment to building in public is truly inspiring. Keep sharing your journey!</p>
        <p style="color: #666; font-size: 14px;">Here's to many more updates! 🚀</p>
      </div>
    `
  })
};

export async function sendEmail(type: EmailType, data: EmailData) {
  try {
    const template = emailTemplates[type](data);
    
    await resend.emails.send({
      from: 'Ship <notifications@ship.vennlabs.io>',
      to: data.email,
      ...template
    });

    console.log(`Email sent successfully to ${data.email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 