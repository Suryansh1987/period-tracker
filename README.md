🌸 Period Tracker
A responsive and user-friendly menstrual cycle tracking web app built with modern React components. It helps users track, manage, and better understand their period cycles for improved wellness and prediction accuracy.

✨ Features
Track Period Cycles

Log start and end dates of your cycle

Record symptoms, flow intensity, and notes

Multiple Cycle Entries

Add, view, and edit multiple period cycles

Entries are displayed side by side for easy comparison

Interactive Dashboard

Overview of your most recent cycle

Quick edit access via cards

Settings Page

Update existing cycle information

Add new cycle entries

Modern UI/UX

Built using ShadCN UI components

Mobile-friendly and accessible layout

Notifications

Real-time feedback with toast messages for saving, errors, and more

🧩 Tech Stack
Framework: Next.js (App Router)

Frontend: React + Tailwind CSS

Components: ShadCN UI

State & Logic: React Hooks (useState, useEffect)

Toasts: sonner

Mock User: DUMMY_USER_ID for development/testing

📁 Project Structure (Important Files)
sql
Copy
Edit
components/
  ├── period-form.tsx         // Form to create/update period entry
  ├── period-card.tsx         // Displays period entry in card format
  ├── period-stats.tsx        // (Optional) Show statistics
pages/
  ├── index.tsx               // Home/Dashboard
  ├── settings.tsx            // Settings page to manage all entries
lib/
  ├── constants.ts            // Contains DUMMY_USER_ID or other constants
🔧 How to Run Locally
bash
Copy
Edit
git clone https://github.com/your-username/period-tracker.git
cd period-tracker
npm install
npm run dev
