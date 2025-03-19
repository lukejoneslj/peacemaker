# Dignity Index Evaluator

A beautiful web application that evaluates text along the Dignity Index scale using Google's Gemini 2.0 Flash Lite AI model.

## About The Dignity Index

The Dignity Index is designed to prevent violence, ease divisions, and solve problems. It scores distinct phrases along an eight-point scale from contempt to dignity:

- **Lower scores (1-4)** reflect divisive language and contempt
- **Higher scores (5-8)** reflect language grounded in dignity

By focusing on the speech and not the speaker, the Dignity Index aims to draw attention away from political biases and toward the power we each have to heal our country and each other.

## Features

- Analyze any text (social media posts, writings, speeches) against the 8-point Dignity Index
- Beautiful, modern UI built with Next.js and shadcn/ui components
- Real-time analysis using Google's Gemini 2.0 Flash Lite AI model
- Detailed explanations of why text received a particular score
- Interactive visualization of the Dignity Index scale

## Tech Stack

- **Framework**: Next.js
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.0 Flash Lite
- **Toast Notifications**: sonner

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables:
   - Create a `.env.local` file with your Google Gemini API key:
     ```
     NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
     ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Running in Production

To build the application for production:

```bash
npm run build
npm start
``` 