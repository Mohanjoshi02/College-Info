# MIT ADT Smart Campus Portal

A comprehensive college management system built with Node.js, Express, MongoDB, and EJS templating.

## Features

### Authentication System
- Custom email/password authentication (no external OAuth)
- Role-based access (Student/Admin)
- Secure session management with express-session
- Password hashing with bcrypt

### Student Dashboard
- View assignments with due date tracking
- Attendance monitoring with percentage calculation
- Latest notices and announcements
- Fee status with payment progress
- Low attendance warnings (< 75%)

### Admin Dashboard
- Assignment management (Create/Delete)
- Notice management (Create/Delete)
- Student attendance management
- Real-time data updates

### Public Features
- Campus information page for visitors
- Image gallery with campus photos
- Google Maps integration
- Responsive design with Bootstrap 5

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Templating:** EJS
- **Authentication:** express-session + bcrypt
- **Frontend:** Bootstrap 5, Font Awesome
- **Styling:** Custom CSS with university theme

## Installation Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- express: Web framework
- mongoose: MongoDB ODM
- ejs: Templating engine
- express-session: Session management
- bcrypt: Password hashing
- dotenv: Environment variables

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mitadt_campus
SESSION_SECRET=mitadt_secret_key_2024
NODE_ENV=development
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. Use the default connection string in `.env`

#### Option B: MongoDB Atlas (Recommended for Replit)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Get connection string from Atlas dashboard
4. Update `MONGODB_URI` in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mitadt_campus
   ```

### 4. Campus Images Setup

Place the provided campus images in `public/images/` directory:
- `campus-1.jpg` - Main campus building
- `campus-2.jpg` - Central dome  
- `campus-3.jpg` - Campus architecture
- `campus-4.jpg` - Aerial view
- `campus-5.jpg` - Campus facilities
- `campus-6.jpg` - University grounds

### 5. Run the Application

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

## Default Test Users

The system automatically creates default users on first startup:

### Student Account
- **Email:** student@mitadt.edu
- **Password:** 123456
- **Role:** Student

### Admin Account  
- **Email:** admin@mitadt.edu
- **Password:** admin123
- **Role:** Admin

## Project Structure

```
mit-adt-smart-campus-portal/
├── models/
│   ├── User.js          # User model (students/admins)
│   ├── Assignment.js    # Assignment model
│   ├── Attendance.js    # Attendance model
│   └── Notice.js        # Notice model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── student.js       # Student dashboard routes
│   ├── admin.js         # Admin dashboard routes
│   └── visitor.js       # Public visitor routes
├── views/
│   ├── auth/
│   │   ├── login.ejs    # Login page
│   │   └── signup.ejs   # Registration page
│   ├── student/
│   │   └── dashboard.ejs # Student dashboard
│   ├── admin/
│   │   └── dashboard.ejs # Admin dashboard
│   ├── visitors/
│   │   └── index.ejs    # Campus information page
│   ├── layout.ejs       # Base layout template
│   └── error.ejs        # Error page
├── public/
│   ├── css/
│   │   └── style.css    # Custom styles
│   └── images/          # Campus images
├── server.js            # Main application file
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables
```

## Key Features Explained

### Security Features
- Password hashing with bcrypt (salt rounds: 10)
- Session-based authentication (no JWT complexity)
- Protected routes with role-based access control
- Input validation and sanitization

### Database Models
- **User:** Stores student/admin information with roles
- **Assignment:** Subject, title, description, due dates
- **Attendance:** Student attendance with auto-calculated percentages
- **Notice:** Announcements with timestamps

### UI/UX Features
- Responsive design optimized for mobile and desktop
- Blue and white university theme
- Sidebar navigation for dashboards
- Progress bars for fee status and attendance
- Alert system for overdue assignments and low attendance
- Smooth animations and hover effects

## Deployment on Replit

1. Import this project to Replit
2. Set up MongoDB Atlas connection
3. Add environment variables in Replit secrets:
   - `MONGODB_URI`
   - `SESSION_SECRET`
4. Upload campus images to `public/images/`
5. Run with: `node server.js`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB service is running (local)
   - Verify connection string format (Atlas)
   - Ensure network access is allowed (Atlas)

2. **Session Issues**
   - Clear browser cookies
   - Check SESSION_SECRET is set
   - Verify express-session configuration

3. **Images Not Loading**
   - Ensure images are in `public/images/` directory
   - Check file names match exactly
   - Verify file permissions

4. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing Node processes

### Performance Optimization

- Images are optimized for web (recommended < 2MB each)
- Database queries use proper indexing
- Session store can be upgraded to Redis for production
- Static files served efficiently with Express

## License

MIT License - Feel free to use this project for educational purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure MongoDB connection is working
4. Check browser console for client-side errors

---

**MIT ADT Smart Campus Portal** - A complete college management solution optimized for stability and ease of use.