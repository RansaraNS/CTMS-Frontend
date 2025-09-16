# CTMS Frontend 🎯

**Candidate Tracking Management System - Frontend Application**

[![Under Development](https://img.shields.io/badge/Status-Under%20Development-orange.svg)](https://github.com/your-username/CTMS-Frontend)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

> 🚧 **This project is currently under active development** 🚧

A modern, responsive web application for managing job candidates, interviews, and recruitment processes. Built with React.js and designed to streamline HR operations with an intuitive user interface.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Contributing](#contributing)
- [Contact](#contact)

## 🎯 About the Project

The CTMS Frontend is the client-side application of the Candidate Tracking Management System, designed to optimize and streamline the recruitment process. It provides a centralized platform for managing candidate records, scheduling interviews, and tracking recruitment history.

**Submitted to:** Miss Jayani Bandara (Supervisor)  
**Developed by:** Sasin Ransara  
**Project Start Date:** September 1, 2025

## ✨ Features

### 🔐 Authentication & Authorization
- Secure login system for Admins and HR personnel
- Role-based access control
- Session management

### 👥 Admin Dashboard
- Monitor recruitment activities
- Generate comprehensive reports
- Create and manage HR accounts
- Oversee scheduled meetings and interviews

### 🏢 HR Management Interface
- Add and manage candidate details
- Quick scan functionality to detect existing records
- Interview scheduling with automated notifications
- Feedback recording and outcome tracking

### 📊 Candidate Management
- Centralized candidate database
- Duplicate detection system
- Interview history tracking
- Status management (Active, Rejected, Terminated)

### 📅 Interview Scheduling
- Interactive calendar interface
- Automated email invitations
- Meeting link integration
- Interview outcome recording

### 📈 Reporting & Analytics
- Real-time dashboards
- Detailed candidate reports
- Historical data visualization
- Export functionality

## 🛠 Tech Stack

- **Frontend Framework:** React.js 18.x
- **Styling:** CSS3, SCSS/Styled Components
- **State Management:** Redux Toolkit / Context API
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Date Handling:** Date-fns / Moment.js
- **Charts:** Chart.js / Recharts
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RansaraNS/CTMS-Frontend.git
   cd CTMS-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the `.env.local` file with your configuration:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   REACT_APP_ENVIRONMENT=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
CTMS-Frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   ├── HR/
│   │   ├── Common/
│   │   └── UI/
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Candidates/
│   │   ├── Interviews/
│   │   └── Reports/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── contexts/
│   ├── styles/
│   ├── App.js
│   └── index.js
├── package.json
├── README.md
└── .env.example
```

## 👨‍💼 User Roles

### 🔴 Admin
- **Access Level:** Full system access
- **Key Functions:**
  - Create HR accounts with validated email format
  - Monitor all recruitment activities
  - Generate system-wide reports
  - Oversee scheduled meetings

### 🟡 HR Personnel
- **Access Level:** Candidate and interview management
- **Key Functions:**
  - Add and manage candidate details
  - Schedule interviews and send invitations
  - Record feedback and outcomes
  - Run duplicate candidate checks

## 🚧 Development Status

This project is currently under active development. Here's what's implemented and what's coming:

### ✅ Completed Features
- [ ] Basic project setup and structure
- [ ] Authentication system
- [ ] Admin dashboard layout
- [ ] HR interface design

### 🔄 In Progress
- [ ] Candidate management system
- [ ] Interview scheduling functionality
- [ ] Reporting dashboard

### 📅 Upcoming Features
- [ ] Email notification system
- [ ] Advanced filtering and search
- [ ] Data export functionality
- [ ] Mobile responsiveness optimisation


### Development Guidelines
1. Follow React best practices
2. Maintain consistent code formatting
3. Write meaningful commit messages
4. Test your changes thoroughly

**Project:** Candidate Tracking Management System (CTMS)

---

⭐ **Star this repository if you find it helpful!**

**Note:** This project is part of an academic/professional development initiative and is currently under active development.
