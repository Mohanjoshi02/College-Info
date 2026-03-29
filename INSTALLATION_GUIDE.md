# MIT ADT Smart Campus Portal - Complete Installation Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [MongoDB Setup (Choose One)](#mongodb-setup)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### 1. Node.js Installation
- **Download:** https://nodejs.org/en/download/
- **Version Required:** Node.js 16.x or higher
- **Includes:** npm (Node Package Manager)

**Installation Steps:**
1. Download the Windows Installer (.msi) - LTS version
2. Run the installer
3. Follow the installation wizard (keep all defaults)
4. Restart your computer after installation

**Verify Installation:**
```bash
node --version
npm --version
```

---

## 🚀 Quick Start

### Step 1: Install Project Dependencies

Open PowerShell or Command Prompt in your project folder and run:

```bash
npm install
```

This will install all required packages:
- express (Web framework)
- mongoose (MongoDB driver)
- ejs (Template engine)
- express-session (Session management)
- bcrypt (Password hashing)
- dotenv (Environment variables)

**Expected Output:**
```
added 190 packages in 30s
```

---

## 🗄️ MongoDB Setup

You have TWO options. Choose the one that works best for you:

### Option A: MongoDB Atlas (Recommended - FREE & Cloud-based)

**Why Atlas?**
- ✅ Free forever (512MB storage)
- ✅ No local installation needed
- ✅ Works from anywhere
- ✅ Automatic backups
- ✅ Easy to set up (5 minutes)

**Setup Steps:**

#### 1. Create Account
- Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up with email or Google account
- Verify your email

#### 2. Create a Free Cluster
- Click "Build a Database"
- Choose "M0 FREE" tier
- Select a cloud provider (AWS recommended)
- Choose a region closest to you (e.g., Mumbai for India)
- Click "Create Cluster" (takes 3-5 minutes)

#### 3. Create Database User
- Go to "Database Access" in left sidebar
- Click "Add New Database User"
- Choose "Password" authentication
- Username: `mitadt_admin`
- Password: Create a strong password (save it!)
- User Privileges: "Read and write to any database"
- Click "Add User"

#### 4. Whitelist Your IP Address
- Go to "Network Access" in left sidebar
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for development)
- Or add your current IP address
- Click "Confirm"

#### 5. Get Connection String
- Go back to "Database" (Clusters)
- Click "Connect" button on your cluster
- Choose "Connect your application"
- Select "Node.js" and version "4.1 or later"
- Copy the connection string (looks like this):
  ```
  mongodb+srv://mitadt_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

#### 6. Update .env File
Open the `.env` file in your project and update the `MONGODB_URI`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://mitadt_admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/mitadt_campus?retryWrites=true&w=majority
SESSION_SECRET=mitadt_secret_key_2024
NODE_ENV=development
```

**Important:** Replace:
- `YOUR_PASSWORD_HERE` with your actual database user password
- `cluster0.xxxxx.mongodb.net` with your actual cluster address

---

### Option B: MongoDB Local Installation

**Why Local?**
- ✅ Works offline
- ✅ Full control
- ✅ No internet required after setup

**Setup Steps:**

#### 1. Download MongoDB
- Go to: https://www.mongodb.com/try/download/community
- Select:
  - Version: Latest (7.0 or higher)
  - Platform: Windows
  - Package: MSI
- Click "Download"

#### 2. Install MongoDB
- Run the downloaded .msi file
- Choose "Complete" installation
- Install as a Windows Service (recommended)
- Install MongoDB Compass (GUI tool) - optional but helpful
- Complete the installation

#### 3. Verify MongoDB is Running
Open Command Prompt and run:
```bash
mongosh
```

If you see MongoDB shell, it's working! Type `exit` to quit.

#### 4. Keep Default .env Configuration
Your `.env` file should have:
```env
MONGODB_URI=mongodb://localhost:27017/mitadt_campus
```

This is already set by default, so no changes needed!

---

## 🎯 Running the Application

### Step 1: Start the Server

In your project folder, run:

```bash
npm start
```

**Expected Output:**
```
MIT ADT Smart Campus Portal running on port 3000
Visit: http://localhost:3000
✅ Connected to MongoDB successfully!
Creating default test users...
Default users created successfully!
Student: student@mitadt.edu / 123456
Admin: admin@mitadt.edu / admin123
```

### Step 2: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

You should see the MIT ADT login page!

### Step 3: Login with Test Accounts

**Student Account:**
- Email: `student@mitadt.edu`
- Password: `123456`

**Admin Account:**
- Email: `admin@mitadt.edu`
- Password: `admin123`

---

## 🖼️ Adding Campus Images

The website needs campus images to display in the gallery.

### Step 1: Locate Images Folder
Navigate to: `public/images/`

### Step 2: Add Images
Place these 6 images in the folder:
- `campus-1.jpg` - Main campus building
- `campus-2.jpg` - Central dome
- `campus-3.jpg` - Campus architecture
- `campus-4.jpg` - Aerial view
- `campus-5.jpg` - Campus facilities
- `campus-6.jpg` - University grounds

**Image Requirements:**
- Format: JPG/JPEG
- Recommended size: 800x600 pixels or higher
- File size: Under 2MB each

### Step 3: View Gallery
Visit: `http://localhost:3000/visitors` to see the campus gallery

---

## 🔧 Troubleshooting

### Issue 1: "npm is not recognized"

**Problem:** Node.js not installed or not in PATH

**Solution:**
1. Reinstall Node.js from https://nodejs.org
2. Restart your computer
3. Open a NEW PowerShell/Command Prompt window
4. Try again

---

### Issue 2: "Cannot load scripts - Execution Policy"

**Problem:** PowerShell script execution is disabled

**Solution:**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try `npm install` again.

---

### Issue 3: "MongoDB connection error: ECONNREFUSED"

**Problem:** MongoDB is not running or connection string is wrong

**Solutions:**

**For Local MongoDB:**
1. Check if MongoDB service is running:
   - Open "Services" (Windows + R, type `services.msc`)
   - Look for "MongoDB Server"
   - If stopped, right-click and select "Start"

2. Or restart MongoDB:
   ```bash
   net start MongoDB
   ```

**For MongoDB Atlas:**
1. Check your connection string in `.env`
2. Verify password is correct (no special characters issues)
3. Check IP whitelist in Atlas (Network Access)
4. Ensure cluster is active (not paused)

---

### Issue 4: "Port 3000 is already in use"

**Problem:** Another application is using port 3000

**Solution 1:** Stop the other application

**Solution 2:** Change port in `.env`:
```env
PORT=3001
```

Then visit: `http://localhost:3001`

---

### Issue 5: Images Not Showing

**Problem:** Images not in correct folder or wrong names

**Solution:**
1. Check images are in `public/images/` folder
2. Verify filenames match exactly:
   - `campus-1.jpg` (not `campus-1.JPG` or `Campus-1.jpg`)
3. Ensure files are JPG format
4. Refresh browser (Ctrl + F5)

---

### Issue 6: "Cannot find module 'express'"

**Problem:** Dependencies not installed

**Solution:**
```bash
npm install
```

Wait for installation to complete, then try `npm start` again.

---

### Issue 7: Login Not Working

**Problem:** MongoDB not connected or default users not created

**Check:**
1. Look at server console output
2. Should see: "✅ Connected to MongoDB successfully!"
3. Should see: "Default users created successfully!"

**Solution:**
1. Ensure MongoDB is connected (see Issue 3)
2. Restart the server: Stop (Ctrl + C) and run `npm start` again
3. Default users will be created automatically on first connection

---

### Issue 8: Session/Login Expires Immediately

**Problem:** SESSION_SECRET not set or cookies blocked

**Solution:**
1. Check `.env` file has `SESSION_SECRET` set
2. Clear browser cookies for localhost
3. Try in incognito/private browsing mode
4. Check browser console for errors (F12)

---

## 📱 Accessing from Other Devices

### On Same Network (LAN)

1. Find your computer's IP address:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update server.js to listen on all interfaces:
   ```javascript
   app.listen(PORT, '0.0.0.0', () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

3. On other device, visit:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   Example: `http://192.168.1.100:3000`

---

## 🛑 Stopping the Server

Press `Ctrl + C` in the terminal where server is running.

---

## 🔄 Restarting the Server

After making code changes:
1. Stop server: `Ctrl + C`
2. Start again: `npm start`

---

## 📊 Default Data

### Test Users (Auto-created)
- **Student:** student@mitadt.edu / 123456
- **Admin:** admin@mitadt.edu / admin123

### Creating More Users
1. Go to: `http://localhost:3000/signup`
2. Fill in the registration form
3. Choose role (Student or Admin)
4. Click "Create Account"
5. Login with new credentials

---

## 🎓 Features Overview

### Student Dashboard
- View assignments with due dates
- Check attendance (with percentage)
- Read notices
- View fee status
- Low attendance warnings

### Admin Dashboard
- Add/Delete assignments
- Add/Delete notices
- Manage student attendance
- View all students

### Public Pages
- Campus information
- Image gallery
- Google Maps location
- Contact details

---

## 📞 Support

### Common Commands

**Install dependencies:**
```bash
npm install
```

**Start server:**
```bash
npm start
```

**Check Node version:**
```bash
node --version
```

**Check npm version:**
```bash
npm --version
```

**Clear npm cache (if issues):**
```bash
npm cache clean --force
```

**Reinstall dependencies:**
```bash
rmdir /s node_modules
del package-lock.json
npm install
```

---

## ✅ Installation Checklist

- [ ] Node.js installed (v16+)
- [ ] npm working
- [ ] Project dependencies installed (`npm install`)
- [ ] MongoDB setup (Atlas or Local)
- [ ] `.env` file configured
- [ ] Campus images added to `public/images/`
- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can login with test accounts
- [ ] Student dashboard loads
- [ ] Admin dashboard loads
- [ ] Visitors page shows images

---

## 🎉 Success!

If you can:
1. ✅ Visit http://localhost:3000
2. ✅ See the login page
3. ✅ Login with test accounts
4. ✅ Access dashboards

**Congratulations! Your MIT ADT Smart Campus Portal is fully installed and working!**

---

## 📚 Additional Resources

- **Node.js Documentation:** https://nodejs.org/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Express.js Guide:** https://expressjs.com/en/guide/routing.html
- **Bootstrap 5 Docs:** https://getbootstrap.com/docs/5.3

---

**MIT ADT Smart Campus Portal**  
Version 1.0.0  
© 2024 MIT ADT University