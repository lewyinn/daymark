# 🧭 Daymark

![Daymark Banner](public/Logo.png)

> **Navigate your day with clarity.** > Daymark is a modern, all-in-one productivity workspace designed to help you manage tasks, organize thoughts, and track your entertainment list in one aesthetic interface.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248) ![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-blue)

## ✨ Features

Daymark is equipped with three core modules to streamline your life:

### ✅ Task Management
- **Smart Organization:** Filter tasks by status (Pending/Completed).
- **Prioritization:** Visual priority indicators (High, Medium, Low).
- **Deadlines:** Track due dates with visual cues for overdue items.
- **Progress Tracking:** Interactive completion toggles.

### 📝 Notes & Ideas
- **Capture Everything:** Create and edit notes instantly.
- **Media Support:** Upload images to notes (Powered by **Cloudinary**).
- **Searchable:** Real-time search functionality for your ideas.
- **Auto-date:** Automatic timestamps for creation and updates.

### 🎬 Watchlist Tracker
- **Universal Tracking:** Track both Movies and TV Series.
- **Detailed Progress:** Log watch time (minutes) or Episodes/Seasons for series.
- **Rating System:** 5-star rating system with personal notes.
- **Status Workflow:** Organize by 'Plan to Watch', 'Watching', and 'Completed'.

### 🔐 Security & UX
- **Authentication:** Secure Sign-in/Sign-up using **NextAuth.js**.
- **Responsive Design:** Fully responsive layout optimized for Desktop, Tablet, and Mobile.
- **Modern UI:** Glassmorphism effects, smooth animations, and interactive modals.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/)
* **Image Storage:** [Cloudinary](https://cloudinary.com/)
* **Icons:** Heroicons

---

## 🚀 Getting Started

Follow these steps to run Daymark locally on your machine.

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas Account
* Cloudinary Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/lewyinn/daymark.git](https://github.com/lewyinn/daymark.git)
    cd daymark
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add the following keys:

    ```env
    # Database
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/daymark

    # Authentication
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_super_secret_string_here

    # Image Upload (Cloudinary)
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📂 Project Structure

```bash
├── app/
│   ├── api/            # Backend API Routes (Movies, Notes, Tasks, Auth)
│   ├── dashboard/      # Protected App Pages
│   ├── sign-in/        # Authentication Pages
│   └── layout.js       # Root Layout & Metadata
├── components/         # Reusable UI Components (Cards, Modals, Header)
├── lib/                # Database & Service Configurations
└── models/             # Mongoose Schemas (User, Task, Note, Movie)