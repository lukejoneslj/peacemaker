# Peacemaker Tool

A beautiful web application that evaluates text along a 10-point Toxicity Scale using Google's Gemini 2.0 Flash Lite AI model.

## About The Toxicity Scale

The Toxicity Scale measures language from non-toxic to severe along a 10-point scale:

* **Levels 1-2 (Non-toxic)**: Completely respectful and constructive communication
* **Levels 3-4 (Mild)**: Critical but still respectful and civil language
* **Levels 5-6 (Moderate)**: Negative tone with moderate hostility and sarcasm
* **Levels 7-8 (Toxic)**: Clearly hostile language with insults and inflammatory content
* **Levels 9-10 (Severe)**: Extreme hostility, threats, harassment, or hate speech

By evaluating where communication falls on this scale, we can work toward more constructive dialogue and healthier interactions.

## Features

* Analyze any text (social media posts, writings, speeches) against the 10-point Toxicity Scale
* Beautiful, modern UI built with Next.js and shadcn/ui components
* Real-time analysis using Google's Gemini 2.0 Flash Lite AI model
* Detailed explanations of why text received a particular score
* Interactive visualization of the Toxicity Scale

## Tech Stack

* **Framework**: Next.js
* **UI Components**: shadcn/ui
* **Styling**: Tailwind CSS
* **AI**: Google Gemini 2.0 Flash Lite
* **Toast Notifications**: sonner

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables:  
   * Create a `.env.local` file with your Google Gemini API key:  
   ```  
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here  
   ```
4. Run the development server: `npm run dev`
5. Open <http://localhost:3000> in your browser

## Running in Production

To build the application for production:

```
npm run build
npm start
``` 