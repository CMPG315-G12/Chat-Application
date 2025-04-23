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

Clone the repository and follow the setup instructions in the `/client` and `/server` directories to run the app locally.

```bash
git clone https://github.com/CMPG315-G12/Chat-Application.git
cd Chat-Application
```

📄 Check out the full documentation in the [README](./README.md) for installation steps, environment setup, and more.

## ENV
Please ensure you add a .env to the root of the server file
must include:

MONGODB_URI= <Your URI - Get from mongodb atlas>
PORT= 5001
JWT_SECRET="CMPG315"
NODE_ENV= "development"
