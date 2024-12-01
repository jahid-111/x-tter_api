# X-Twitter Clone

A Twitter clone built with the **MERN** stack (MongoDB, Express, React, Node.js). The project includes secure backend routes for **Tweets**, **Comments**, **User Authentication**, and **User** management. All routes are secured, requiring user authentication via sign-in or sign-up.

### Features

- **Secure Routes**: Every route is secured, requiring the user to sign in or sign up before performing any operations.
- **Password Encryption**: User passwords are securely hashed using **Crypto** and **Salt** for extra security.
- **CRUD Operations**: Create, read, update, and delete tweets and comments.
- **Like Feature**: Users can like tweets and comments.

### API Endpoints

---

## TWEET

- **GET**: [/api/tweet](http://localhost:8000/api/tweet)  
  Retrieve all tweets.
- **GET**: [/api/tweet/[tweetid]](http://localhost:8000/api/tweet/[tweetid])  
  Retrieve a single tweet by its ID.
- **PATCH**: [/api/tweet/[tweetid]](http://localhost:8000/api/tweet/[tweetid])  
  Update a tweet by its ID.
- **DELETE**: [/api/tweet/[tweetid]](http://localhost:8000/api/tweet/[tweetid])  
  Delete a tweet by its ID.
- **PUT**: [/api/tweet/[tweetid]/like](http://localhost:8000/api/tweet/[tweetid]/like)  
  Like a tweet by its ID.
- **POST**: [/api/tweet](http://localhost:8000/api/tweet)  
  Create a new tweet.

---

## AUTH

- **POST**: [/api/auth](http://localhost:8000/api/auth)  
  Register a new user by sending user credentials (userName, email, password, dateOfBirth).
- **GET**: [/api/auth](http://localhost:8000/api/auth)  
  Get user credentials after registration.

---

## COMMENT

- **GET**: [/api/comment](http://localhost:8000/api/comment)  
  Retrieve all comments.
- **POST**: [/api/comment](http://localhost:8000/api/comment)  
  Create a new comment.
- **DELETE**: [/api/comment/[commentid]](http://localhost:8000/api/comment/[commentid])  
  Delete a comment by its ID.
- **PUT**: [/api/comment/[commentid]/like](http://localhost:8000/api/comment/[commentid]/like)  
  Like a comment by its ID.

---

## USER

- **GET**: [/api/user](http://localhost:8000/api/user)  
  Retrieve all users.
- **GET**: [/api/user/[userid]](http://localhost:8000/api/user/[userid])  
  Retrieve a specific user by their ID.
- **PATCH**: [/api/user/[userid]](http://localhost:8000/api/user/[userid])  
  Update a user's details.
- **DELETE**: [/api/user/[userid]](http://localhost:8000/api/user/[userid])  
  Delete a user by their ID.
- **PUT** : [/api/user/[targetUser]/follow] http://localhost:8000/api/user/[targetUser]/follow
  Follow Each other

---

### Installation

| https://github.com/jahid-111/x-tter_api.git

#### Prerequisites

- **Node.js** (>=14.x)
- **MongoDB** (local or cloud instance, e.g., MongoDB Atlas)

#### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone  https://github.com/jahid-111/x-tter_api.git
   ```

### Security

- User Authentication: All routes require the user to sign in via a secure authentication system.
- Password Encryption: Passwords are securely hashed using Crypto and Salt for added security.
- JWT Tokens: Use of JSON Web Tokens (JWT) for maintaining user sessions.

# ⚠️⚠️⚠️

<span style="color: #FFA500;"> ©️ All Rights Reserved </span>

---

# Dev Contact

- [LinkedIn](https://www.linkedin.com/in/mohd-jahidul-2622a7176/)
- [Email](mailto:jahidjob5@outlook.com)
