# Otter Note App

A local note app based on React Native and Expo, supporting user authentication and SQLite database storage.

## ⚠️ Important Note

**This app cannot run in Expo Snack!**

Since the app uses SQLite database (requiring native modules), it must be run on a real device or simulator. Please check `SNACK_LIMITATIONS.md` for details.

## 🚀 Quick Start

### Method 1: Use Expo Go on Mobile (Recommended)

1. **Install Expo Go on Mobile**
   - iOS: Download from App Store
   - Android: Download from Google Play

2. **Clone Repository Locally**
   ```bash
   git clone https://github.com/zq12345678/app1.git
   cd app1
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npx expo start
   ```

5. **Scan QR Code**
   - iOS: Scan using Camera app
   - Android: Scan using Expo Go app

### Method 2: Use iOS Simulator (Mac Only)

```bash
npm install
npx expo start
# Press 'i' to open in iOS simulator
```

### Method 3: Use Android Emulator

```bash
npm install
npx expo start
# Press 'a' to open in Android emulator
```

## 📱 Features

### ✅ Implemented Features

- **User Authentication System**
  - User Registration (Email, Username, Password)
  - User Login
  - Session Management (Using AsyncStorage)
  - Auto Login

- **Database Functions**
  - SQLite Local Database
  - User Data Isolation
  - Cascade Delete (Deleting a course automatically deletes related lectures and notes)

- **Course Management**
  - Create Course
  - View Course List
  - Delete Course

- **Lecture Management**
  - Create Lecture under Course
  - View Lecture List
  - Delete Lecture

- **Note/Transcript Management**
  - Create Note under Lecture
  - View Note Content
  - Delete Note

## 🗂️ Project Structure

```
app1/
├── App.js                          # Main app entry, includes database initialization
├── components/
│   ├── HomeScreen.js              # Home screen (Course list)
│   ├── FolderDetailScreen.js     # Course detail (Lecture list)
│   ├── NoteDetailScreen.js       # Lecture detail (Note list)
│   ├── LoginScreen.js            # Login screen
│   ├── RegisterScreen.js         # Register screen
│   ├── AIChatScreen.js           # AI Chat (Placeholder)
│   ├── StyleGuideScreen.js       # Style guide
│   └── LanguageSelectionScreen.js # Language selection
├── contexts/
│   ├── AuthContext.js            # Auth context (User state management)
│   └── RecordingContext.js       # Recording context
├── services/
│   └── database.js               # Database service layer (All CRUD operations)
├── TESTING_GUIDE.md              # Testing guide (English)
├── IMPLEMENTATION_SUMMARY.md     # Implementation summary
├── SNACK_LIMITATIONS.md          # Snack limitations explanation
└── README_ZH_TRANSLATED.md       # This file
```

## 🧪 Testing the App

Please check `TESTING_GUIDE.md` for detailed testing steps.

### Quick Test Flow

1. **Register New User**
   - Email: test@example.com
   - Username: testuser
   - Password: 123456

2. **Create Course**
   - Click "+" button
   - Enter course name

3. **Create Lecture**
   - Click course to enter details
   - Click "+" button
   - Enter lecture title

4. **Create Note**
   - Click lecture to enter details
   - Click "+" button
   - Enter note content

5. **Test Logout/Login**
   - Logout and login again
   - Verify data retention

## 🔧 Tech Stack

- **React Native** - Cross-platform mobile application framework
- **Expo** - React Native development toolchain
- **React Navigation** - Navigation library
- **expo-sqlite** - SQLite database
- **AsyncStorage** - Local storage (Session management)
- **React Context API** - State management

## 📊 Database Schema

### Users Table (users)
- id (Primary Key)
- email (Unique)
- username
- password
- created_at

### Courses Table (courses)
- id (Primary Key)
- user_id (Foreign Key → users)
- name
- created_at

### Lectures Table (lectures)
- id (Primary Key)
- course_id (Foreign Key → courses)
- user_id (Foreign Key → users)
- title
- lecture_number
- created_at

### Notes Table (transcripts)
- id (Primary Key)
- lecture_id (Foreign Key → lectures)
- user_id (Foreign Key → users)
- content
- timestamp
- created_at

## 🐛 Troubleshooting

### App Stuck on Loading

**Cause**: Database initialization failed

**Solution**:
1. Check if running on real device or simulator (not Snack)
2. Check error messages in console logs
3. Try clearing cache: `npx expo start -c`

### Cannot Connect to Development Server

**Solution**:
1. Ensure mobile and computer are on the same WiFi network
2. Check firewall settings
3. Try using tunnel mode: `npx expo start --tunnel`

### Dependency Installation Failed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development Notes

### Adding New Features

1. To modify database structure, edit `services/database.js`
2. To add new screens, create new files in `components/` directory
3. To modify navigation, edit `App.js`

### Debugging Tips

1. Use `console.log()` to output debug info
2. Shake device in Expo Go to open developer menu
3. Enable remote debugging: Developer Menu → Debug Remote JS

## 🔐 Security Notes

⚠️ **Current Implementation is for Demonstration Only**

Production environment needs improvements:
- Hash passwords using bcrypt or similar libraries
- Implement JWT or OAuth authentication
- Add input validation and sanitization
- Use HTTPS
- Implement rate limiting

## 📄 License

MIT

## 👥 Contribution

Issues and Pull Requests are welcome!

## 📞 Contact

If you have questions, please create an Issue on GitHub.
