# MIT ADT Smart Campus Portal - Setup Checklist

Use this checklist to ensure everything is properly installed and configured.

## ✅ Pre-Installation

- [ ] **Node.js Installed**
  - Download from: https://nodejs.org
  - Version 16.x or higher
  - Verify: `node --version` shows version number
  - Verify: `npm --version` shows version number

- [ ] **Project Files Downloaded**
  - All files extracted to a folder
  - Folder path has no special characters
  - Example: `C:\Users\mohan\OneDrive\Desktop\dt prototype 2`

## ✅ Dependencies Installation

- [ ] **Open PowerShell/Command Prompt**
  - Navigate to project folder
  - Right-click folder → "Open in Terminal" or "Open PowerShell here"

- [ ] **Run npm install**
  - Command: `npm install`
  - Wait for completion (30-60 seconds)
  - Should see: "added 190 packages"
  - No critical errors

- [ ] **Check node_modules folder created**
  - Folder `node_modules` should exist in project
  - Contains many subfolders

## ✅ MongoDB Setup (Choose ONE)

### Option A: MongoDB Atlas (Cloud - Recommended)

- [ ] **Create Atlas Account**
  - Visit: https://www.mongodb.com/cloud/atlas/register
  - Sign up with email or Google
  - Verify email address

- [ ] **Create Free Cluster**
  - Click "Build a Database"
  - Select "M0 FREE" tier
  - Choose cloud provider (AWS)
  - Choose region (closest to you)
  - Click "Create Cluster"
  - Wait 3-5 minutes for cluster creation

- [ ] **Create Database User**
  - Go to "Database Access"
  - Click "Add New Database User"
  - Username: `mitadt_admin`
  - Password: (create and save it!)
  - Privileges: "Read and write to any database"
  - Click "Add User"

- [ ] **Configure Network Access**
  - Go to "Network Access"
  - Click "Add IP Address"
  - Click "Allow Access from Anywhere" (for development)
  - Click "Confirm"

- [ ] **Get Connection String**
  - Go to "Database" (Clusters)
  - Click "Connect" button
  - Choose "Connect your application"
  - Select "Node.js" driver
  - Copy connection string
  - Example: `mongodb+srv://mitadt_admin:<password>@cluster0.xxxxx.mongodb.net/`

- [ ] **Update .env File**
  - Open `.env` file in project
  - Find line: `MONGODB_URI=mongodb://localhost:27017/mitadt_campus`
  - Replace with your Atlas connection string
  - Replace `<password>` with your actual password
  - Add database name at end: `/mitadt_campus`
  - Example: `MONGODB_URI=mongodb+srv://mitadt_admin:MyPass123@cluster0.xxxxx.mongodb.net/mitadt_campus`
  - Save file

### Option B: MongoDB Local Installation

- [ ] **Download MongoDB**
  - Visit: https://www.mongodb.com/try/download/community
  - Select Windows platform
  - Download MSI installer

- [ ] **Install MongoDB**
  - Run downloaded .msi file
  - Choose "Complete" installation
  - Install as Windows Service: ✓ checked
  - Install MongoDB Compass: ✓ checked (optional)
  - Complete installation

- [ ] **Verify MongoDB Running**
  - Open Command Prompt
  - Type: `mongosh`
  - Should connect to MongoDB shell
  - Type: `exit` to quit

- [ ] **Keep Default .env**
  - `.env` file already has correct local connection
  - No changes needed
  - Line should be: `MONGODB_URI=mongodb://localhost:27017/mitadt_campus`

## ✅ Campus Images Setup

- [ ] **Locate Images Folder**
  - Navigate to: `public/images/`
  - Folder should exist

- [ ] **Add Campus Images**
  - Copy 6 campus images to this folder
  - Required filenames:
    - [ ] `campus-1.jpg` - Main building
    - [ ] `campus-2.jpg` - Central dome
    - [ ] `campus-3.jpg` - Architecture
    - [ ] `campus-4.jpg` - Aerial view
    - [ ] `campus-5.jpg` - Facilities
    - [ ] `campus-6.jpg` - Grounds

- [ ] **Verify Image Format**
  - All files are .jpg or .jpeg
  - Filenames are lowercase
  - No spaces in filenames
  - File sizes under 2MB each

## ✅ Environment Configuration

- [ ] **.env File Exists**
  - File named `.env` in project root
  - Not `.env.txt` or `env`

- [ ] **Check .env Contents**
  ```
  PORT=3000
  MONGODB_URI=(your connection string)
  SESSION_SECRET=mitadt_secret_key_2024
  NODE_ENV=development
  ```

- [ ] **All Values Set**
  - PORT has a number
  - MONGODB_URI has connection string
  - SESSION_SECRET has a value
  - No empty values

## ✅ Starting the Application

- [ ] **Open Terminal in Project Folder**
  - PowerShell or Command Prompt
  - Current directory is project folder

- [ ] **Start Server**
  - Command: `npm start`
  - Press Enter

- [ ] **Check Console Output**
  - Should see: "MIT ADT Smart Campus Portal running on port 3000"
  - Should see: "Visit: http://localhost:3000"
  - Should see: "✅ Connected to MongoDB successfully!"
  - Should see: "Default users created successfully!"

- [ ] **No Critical Errors**
  - Warnings are OK (deprecation warnings)
  - No "Error:" messages
  - No "ECONNREFUSED" errors

## ✅ Testing the Website

- [ ] **Open Browser**
  - Chrome, Firefox, Edge, or Safari
  - Open new tab

- [ ] **Visit Login Page**
  - URL: `http://localhost:3000`
  - Should see MIT ADT login page
  - Blue and white theme
  - Login form visible

- [ ] **Test Student Login**
  - Email: `student@mitadt.edu`
  - Password: `123456`
  - Click "Login"
  - Should redirect to student dashboard

- [ ] **Check Student Dashboard**
  - Sidebar visible
  - Welcome message shows
  - Assignments section loads
  - Attendance section loads
  - Notices section loads
  - Fee status section loads

- [ ] **Test Logout**
  - Click "Logout" button
  - Should redirect to login page

- [ ] **Test Admin Login**
  - Email: `admin@mitadt.edu`
  - Password: `admin123`
  - Click "Login"
  - Should redirect to admin dashboard

- [ ] **Check Admin Dashboard**
  - Sidebar visible
  - Assignment management section
  - Notice management section
  - Attendance management section
  - Can add new assignment
  - Can add new notice

- [ ] **Test Visitors Page**
  - URL: `http://localhost:3000/visitors`
  - Campus information visible
  - Image gallery shows (if images added)
  - Google Maps embedded
  - Contact information visible

- [ ] **Test Signup**
  - URL: `http://localhost:3000/signup`
  - Fill in all fields
  - Create new account
  - Should show success message
  - Can login with new account

## ✅ Functionality Testing

- [ ] **Admin: Add Assignment**
  - Login as admin
  - Fill assignment form
  - Click "Add Assignment"
  - Assignment appears in list

- [ ] **Admin: Delete Assignment**
  - Click delete button on assignment
  - Confirm deletion
  - Assignment removed from list

- [ ] **Admin: Add Notice**
  - Fill notice form
  - Click "Add Notice"
  - Notice appears in list

- [ ] **Admin: Update Attendance**
  - Select a student
  - Enter subject name
  - Enter total and attended classes
  - Click "Update Attendance"
  - Success (no errors)

- [ ] **Student: View Assignments**
  - Login as student
  - Assignments section shows data
  - Overdue assignments highlighted in red

- [ ] **Student: View Attendance**
  - Attendance section shows data
  - Percentage calculated correctly
  - Low attendance (<75%) shown in red

- [ ] **Student: View Notices**
  - Notices section shows data
  - Latest notices displayed
  - Dates shown correctly

## ✅ Final Verification

- [ ] **All Pages Load Without Errors**
  - No 404 errors
  - No 500 errors
  - No blank pages

- [ ] **Responsive Design Works**
  - Resize browser window
  - Layout adjusts properly
  - Mobile view works

- [ ] **Session Persistence**
  - Login and refresh page
  - Still logged in
  - Don't need to login again

- [ ] **Data Persistence**
  - Add assignment/notice
  - Restart server
  - Data still exists

- [ ] **Images Display Correctly**
  - Visitors page shows all images
  - No broken image icons
  - Images load properly

## ✅ Documentation Review

- [ ] **Read README.md**
  - Understand project structure
  - Know available features
  - Understand tech stack

- [ ] **Read INSTALLATION_GUIDE.md**
  - Detailed setup instructions
  - Troubleshooting section
  - Common issues and solutions

- [ ] **Read QUICK_START.txt**
  - Quick reference guide
  - Test account credentials
  - Important URLs

## 🎉 Installation Complete!

If all items are checked, your MIT ADT Smart Campus Portal is fully installed and working!

### Quick Reference:

**Website URL:** http://localhost:3000

**Test Accounts:**
- Student: student@mitadt.edu / 123456
- Admin: admin@mitadt.edu / admin123

**Start Server:** `npm start`
**Stop Server:** `Ctrl + C`

### Next Steps:

1. Customize the portal for your needs
2. Add more students and admins
3. Create assignments and notices
4. Update campus images
5. Modify styling in `public/css/style.css`

---

**Need Help?**
- Check INSTALLATION_GUIDE.md for detailed troubleshooting
- Review console output for error messages
- Ensure MongoDB is connected
- Verify all dependencies installed

**Congratulations on setting up your Smart Campus Portal! 🎓**