# 💬 PingMe - Real-Time Chat Application

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=react)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-black?style=for-the-badge&logo=socket.io)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styled-38B2AC?style=for-the-badge&logo=tailwind-css)

PingMe is a robust, full-stack real-time chat application built with the **MERN** stack and **Socket.io**. Designed with a focus on seamless user experience, scalable architecture, and clean UI/UX. It supports both direct 1-on-1 messaging and fully-featured group chats with admin access controls.

## ✨ Key Features

- **3-Column Dashboard Layout**: A highly responsive layout featuring a collapsible left sidebar for contacts and a dedicated right sidebar for live tech news, ensuring maximum space for the main chat interface.
- **Live Tech News Feed 📰**: Integrated with the Dev.to public API via a custom Node.js backend proxy. Displays the top 10 trending software engineering articles in real-time without exposing API keys or triggering CORS blocks.
- **Synchronized Watch Parties 🍿**: Paste a YouTube URL in any group chat to launch a real-time synchronized video player. When anyone hits play, pause, or skips ahead, it instantly syncs across all connected clients via WebSockets!
- **Real-Time Communication**: Instant messaging powered by WebSockets (Socket.io) with zero-polling architecture.
- **Group Chats & Admin Controls**: Users can create groups, add/remove members, and manage permissions. Normal users can gracefully leave groups.
- **Live Typing Indicators**: Real-time "User is typing..." feedback synced across connected clients.
- **Infinite Scrolling**: Cursor-based pagination with `IntersectionObserver` to load older messages seamlessly without blocking the UI or overloading the database.
- **Secure Authentication**: JWT-based authentication with HTTP-only cookies and bcrypt password hashing.
- **Modern State Management**: Utilizes `Zustand` for lightweight, predictable global state without React Context re-render bottlenecks.
- **Beautiful UI/UX**: Fully responsive design crafted with Tailwind CSS and DaisyUI, featuring smooth loading skeletons, hover animations, and toast notifications.

## 🛠️ Tech Stack

**Client:**
- React (Vite)
- Zustand (State Management)
- Tailwind CSS & DaisyUI
- React Router DOM
- Axios
- Lucide React (Icons)

**Server:**
- Node.js & Express.js
- MongoDB & Mongoose
- Socket.io (WebSockets)
- JSON Web Tokens (JWT)
- Bcrypt.js

## 📸 Screenshots

*(Added Screenshots!)*

| Login Page | Chat Dashboard | Group Management |
| :---: | :---: | :---: |
| <img width="1860" height="890" alt="Screenshot (54)" src="https://github.com/user-attachments/assets/9472fb50-dc24-4d21-aa1a-df275bd575ce" /> | <img width="1867" height="892" alt="Screenshot (55)" src="https://github.com/user-attachments/assets/7a5ecbf5-4a53-49b3-a459-337abaa5c164" /> | <img width="1861" height="899" alt="Screenshot (56)" src="https://github.com/user-attachments/assets/e7c92c41-4c93-465e-b7bd-7efafa787b70" /> |

<img width="1782" height="883" alt="Screenshot (58)" src="https://github.com/user-attachments/assets/e70fffb2-71cd-4521-8d5e-ecd3b770ddcc" />

<img width="1788" height="882" alt="Screenshot (57)" src="https://github.com/user-attachments/assets/78a82cad-f18e-4572-932a-4b24ab9dcfa2" />


## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB URI (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mrinal-xx-Singha/PingMe.git
   cd PingMe
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧠 Architecture Highlights (For Developers/Recruiters)

- **Cursor-Based Pagination**: Standard offset pagination slows down as databases grow. PingMe uses the `_id` of the oldest loaded message as a cursor (`&before=id`) to perform highly indexed, `$lt` queries in MongoDB, ensuring constant time `O(1)` query performance regardless of chat history size.
- **Optimistic UI Updates**: The Zustand store is designed to instantly append outgoing messages and group creations to the UI while the background API request processes, ensuring the app feels snappy and native.
- **Connection Efficiency**: Socket.io event listeners are tightly coupled with React's `useEffect` cleanup functions (`socket.off`) to prevent memory leaks and duplicate event firings during re-renders.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
