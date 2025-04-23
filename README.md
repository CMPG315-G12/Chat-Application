# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## ENV
Please ensure you add a .env to the root of the server file
must include:

MONGODB_URI= <Your URI - Get from mongodb atlas>
PORT= 5001
JWT_SECRET="CMPG315"
NODE_ENV= "development"

## 📱 Real-Time Chat App

A full-featured real-time chat application built with the **MERN stack**, powered by **Socket.io** for live messaging, **JWT** for secure authentication, and **Electron** for a seamless cross-platform desktop experience.

### 🚀 Features

- 🔒 **Authentication** using JSON Web Tokens (JWT)
- 💬 **Real-time messaging** with Socket.io
- 🗅️ **Cross-platform desktop support** via Electron
- 🧑‍🧹 User-friendly UI and intuitive chat interface
- 🗂️ Organized conversations with support for multiple chat rooms or DMs
- 🌐 Built with MongoDB, Express.js, React, and Node.js

### 🛠️ Tech Stack

&#x20;    &#x20;

### 📦 Getting Started

Clone the repository and follow the setup instructions in the `/client` and `/server` directories to run the app locally.

```bash
git clone https://github.com/CMPG315-G12/Chat-Application.git
cd Chat-Application
```

📄 Check out the full documentation in the [README](./README.md) for installation steps, environment setup, and more.

