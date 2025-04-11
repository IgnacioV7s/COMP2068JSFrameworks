# 💼 RealUnionFees Application

**RealUnionFees** is a web application designed to manage union fee payments with **robust authentication** and **role-based access control**.

---

## ✨ Key Features

- 🔐 **Secure Authentication**
  - Login and registration with credential validation.
  - Google OAuth 2.0 integration for easy access.

- 🧑‍🤝‍🧑 **Role-Based Access Control**
  - Tailored dashboards for different user roles: `admin` and `player`.

- 🛡️ **Protected Routes**
  - Only authenticated users with complete profiles can access sensitive routes.

- 🗄️ **MongoDB Integration**
  - Stores user data and application information securely in a NoSQL database.

- 📧 **Email Notifications**
  - Sends verification or notification emails using Nodemailer.

---

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB (with Mongoose)**
- **Google OAuth 2.0**
- **Nodemailer**

---

## 🚀 Installation Guide

### ✅ Prerequisites

- [Node.js](https://nodejs.org/)
- A Google account (for OAuth 2.0 setup)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### 📥 Steps to Run Locally

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   CONNECTION_STRING_MONGODB=<your_mongodb_connection_string>
   GOOGLE_CLIENT_ID=<your_google_client_id>
   GOOGLE_CLIENT_SECRET=<your_google_client_secret>
   GOOGLE_CALLBACK_URL=<your_google_callback_url>
   SESSION_SECRET=<your_secret>
   EMAIL_USER=<your_email>
   EMAIL_PASS=<your_email_password>
   ```

   > 🛑 *Avoid committing the `.env` file to version control.*

4. **Start the Application:**

   ```bash
   npm start
   ```

5. **Open the App:**

   Visit: [https://real-union-fees.onrender.com](https://real-union-fees.onrender.com)

---

## 👤 Demo User (Admin)

You can use the following credentials for testing admin features:

- **Email**: `cata@gmail.com`
- **Password**: `catalan`

---

## 📌 Usage Highlights

- Users can **register** and **log in** securely.
- Depending on their role, users see different content and permissions.
- Non-authenticated users or incomplete profiles are **redirected** away from protected content.

---

## 🤝 Contributing

We welcome contributions! Follow these steps to collaborate:

1. Fork the repository
2. Create a new branch:

   ```bash
   git checkout -b feature/new-feature
   ```

3. Make your changes and commit:

   ```bash
   git commit -m "Add new feature"
   ```

4. Push your branch:

   ```bash
   git push origin feature/new-feature
   ```

5. Open a pull request on GitHub

---

## 📄 License

This project is for **educational purposes** only.

---

## 📬 Contact

Made with ❤️ by Ignacio Valenzuela  
✉️ [ignaciovalenzuela712@gmail.com](mailto:ignaciovalenzuela712@gmail.com)