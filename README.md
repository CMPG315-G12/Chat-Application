### 🛠️ Tech Stack

- ![React](https://img.shields.io/badge/Frontend-React-blue?logo=react) + ![Tailwind](https://img.shields.io/badge/Styling-Tailwind-cyan?logo=tailwindcss) +![Electron](https://img.shields.io/badge/Desktop-Electron-9cf?logo=electron) 
- ![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=nodedotjs) + ![Express](https://img.shields.io/badge/Server-Express.js-lightgrey?logo=express)
- ![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
- ![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-black?logo=socketdotio)
- ![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens) + ![Oauth](https://img.shields.io/badge/TBD-auth0-purple?logo=auth0
)

## 📱 Real-Time Chat App

A full-featured real-time chat application built with the **MERN stack**, powered by **Socket.io** for live messaging, **JWT** for secure authentication, and **Electron** for a seamless cross-platform desktop experience.

### 🚀 Features

- 🔒 **Authentication** using JSON Web Tokens (JWT)
- 💬 **Real-time messaging** with Socket.io
- 🗅️ **Cross-platform desktop support** via Electron
- 🧑‍🧹 User-friendly UI and intuitive chat interface
- 🗂️ Organized conversations with support for multiple chat rooms or DMs
- 🌐 Built with MongoDB, Express.js, React, and Node.js

### 📦 Getting Started

Clone the repository
```bash
git clone https://github.com/CMPG315-G12/Chat-Application.git
cd Chat-Application
```

Install Required Dependencies
```bash
npm i
```

If there are issues
```bash
npm audit fix
```

#### Start Server

Run the server in developement mode - there are a few packages that are there to assist in Development.

```bash
cd server
npm run dev
```

#### Run Client

Start the Client - Server must be running aswell

```bash
cd client
npm run dev
```

📄 Check out the full documentation in the [README](./README.md) for installation steps, environment setup, and more.

## ENV
Please ensure you add a .env to the root of the server file
must include:

### --- Database Connection URI ---
- MONGODB_URI= your_mongodb_connection_string_here
- PORT= 5001
- JWT_SECRET="CMPG315"

### --- Environment ---
- NODE_ENV= "development" 

### -- URLS --
- CLIENT_URL=  Your Client URL || localhost:5173
- SERVER_URL=  Your Server URL || localhost:5001

### --- Google OAuth Credentials ---
- GOOGLE_CLIENT_ID= your_google_client_id
- GOOGLE_CLIENT_SECRET= your_google_client_secret
#### Ensure this matches the callback route in auth.routes.js and Google Console settings
- GOOGLE_CALLBACK_URL= Callback URL

### --- Discord OAuth Credentials ---
- DISCORD_CLIENT_ID= your_discord_client_id
- DISCORD_CLIENT_SECRET= your_discord_client_secret
#### Ensure this matches the callback route in auth.routes.js and Discord Developer Portal settings 
- DISCORD_CALLBACK_URL= Callback URL

### --- GitHub OAuth Credentials ---
- GITHUB_CLIENT_ID= your_github_client_id
- GITHUB_CLIENT_SECRET= your_github_client_secret
#### Ensure this matches the callback route in auth.routes.js and GitHub OAuth App settings
- GITHUB_CALLBACK_URL= Callback URL

### --- Cookie Settings (Optional - defaults are often fine) ---
COOKIE_MAX_AGE_MS=604800000 # Example: 7 days (7 * 24 * 60 * 60 * 1000) - Matches your utils.js



