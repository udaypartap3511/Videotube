# Backend API

A production-style backend REST API built with **Node.js, Express.js, MongoDB, and Mongoose**.  
This project implements authentication, video management, tweets, comments, likes, subscriptions, playlists, and channel dashboard statistics.

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Access and refresh token system
- Protected routes using authentication middleware
- Logout functionality
- Password management
- User ownership and authorization checks

### 👤 User Management
- Create and manage user profiles
- Update account details
- Update avatar and cover image
- Fetch user information
- Channel profile information

### 🎥 Video Management
- Publish videos
- Upload video and thumbnail
- Cloudinary integration
- Get videos with pagination
- Search videos
- Sort videos
- Filter videos by user
- Get video by ID
- Update video information
- Delete videos
- Toggle video publish status

### 💬 Comments
- Add comments to videos
- Get video comments
- Update comments
- Delete comments
- Pagination for comments

### ❤️ Likes
- Like/unlike videos
- Like/unlike comments
- Like/unlike tweets
- Get videos liked by the user

### 🐦 Tweets
- Create tweets
- Get user's tweets
- Update tweets
- Delete tweets

### 🔔 Subscriptions
- Subscribe/unsubscribe to channels
- Get channel subscribers
- Get channels subscribed to by a user

### 📂 Playlists
- Create playlists
- Get user's playlists
- Get playlist by ID
- Add videos to playlists
- Remove videos from playlists
- Update playlists
- Delete playlists

### 📊 Channel Dashboard
- Total videos
- Total views
- Total subscribers
- Total likes
- Get videos uploaded by a channel
- MongoDB aggregation for channel statistics

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT**
- **Cloudinary**
- **Multer**
- **bcrypt**
- **Postman**

## 📁 Project Structure

```text
src/
├── controllers/
├── db/
├── middlewares/
├── models/
├── routes/
├── utils/
├── app.js
└── index.js

public/
└── temp/

```

## ModelLink

-[Model link](https://app.eraser.io/workspace/NJEcNPO8L4wnKhXNJVGF?origin=share)