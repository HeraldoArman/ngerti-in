# Ngerti.in

**Hackathon Theme: Education & Equity**

Ngerti.in is an innovative AI-powered tutor designed to provide personalized and interactive learning experiences for students. This platform connects students with AI tutors for various subjects, facilitating engaging and effective learning sessions with AI Agents.

## 🚀 Background / Inspiration

Have you ever struggled to understand a teacher’s lecture in class? Or, even simpler, have you been scared to ask someone about the lecture because you thought you might be judged? You’re not alone. Most students, in every part of the world, have felt the same way.

What if you could have someone to help you understand what you are studying, 24/7, and without judging you in the process? With the advancement of AI, we saw an opportunity where AI can be used to help students to learn anytime, anywhere, in real-time.

### Pain Points Addressed:

  * Students who don’t have access to education
  * Students who struggle to understand their teacher’s lectures
  * Students who feel scared to be judged when asking questions
  * Students who feel studying on YouTube is passive & not effective
  * Students who don’t have access to private tutoring

## ✨ Solution

Ngerti.in is an AI-powered learning platform designed to help students understand what they are learning through interactive voice integration and real-time whiteboard explanations.

For students who are afraid to ask questions, struggle to understand class material, or can’t afford private tutoring, Ngerti.in offers an active and personal learning experience — as if you had your own private tutor, available anytime. This is not passive video learning — it’s real dialogue and real understanding.

## Features

  * **AI Talk:** An interactive AI who can answer students with real-time voices.
  * **Interactive Whiteboard:** The AI can write and explain directly on the whiteboard.
  * **Automatic Summary:** After the study session is done, the user can ask for a summary.
  * **Export:** Users can export the whiteboard/study session to a PDF format.
  * **AI-Powered Tutoring:** Get instant help from AI tutors in a variety of subjects including Math, Bahasa Indonesia, Natural Science, Social Science, and English.
  * **Interactive Video Calls:** Engage in one-on-one video sessions with AI tutors for a more personalized learning experience.
  * **Meeting Management:** Easily schedule, manage, and review your tutoring sessions through the dashboard.
  * **Session Recordings and Transcripts:** Access recordings and transcripts of your past sessions to review and reinforce your learning.
  * **Automated Summaries:** Receive AI-generated summaries of your tutoring sessions to quickly recap the key concepts covered.

## 🛠️ Technologies Used

  * **Frontend:** Next.js, React, TypeScript, Tailwind CSS
  * **Backend:** Next.js API Routes, tRPC
  * **Database:** Drizzle ORM with a PostgreSQL database
  * **Authentication:** better-auth
  * **Video Streaming:** Stream
  * **AI:** Inngest, OpenAI

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js (v18 or higher)
  * npm or yarn

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/heraldoarman/ngerti-in.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Set up your environment variables by creating a `.env` file and adding the necessary credentials for your database, authentication, and other services.

```sh
DATABASE_URL=""
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

NEXT_PUBLIC_APP_URL=""
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=""
STREAM_VIDEO_SECRET=""
OPENAI_API_KEY=""

NEXT_PUBLIC_STREAM_CHAT_API_KEY=""
STREAM_CHAT_SECRET_KEY=""
```
4.  Run the development server
    ```sh
    npm run dev
    ```
5.  Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

