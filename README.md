# Notes Application with Google OAuth

A modern, full-stack notes application built with React, Node.js, and MongoDB. Features include Google OAuth authentication, beautiful UI with Tailwind CSS, and comprehensive note management capabilities.

## Features

- 🔐 **Authentication**: Email/password and Google OAuth login
- 📝 **Note Management**: Create, read, update, delete notes
- 🎨 **Customization**: Color-coded notes with color picker
- 📌 **Organization**: Pin important notes
- 🏷️ **Tagging**: Add tags to categorize notes
- 🔍 **Search**: Search notes by title, content, or tags
- 📱 **Responsive**: Mobile-friendly design
- 🎯 **Modern UI**: Beautiful interface built with Tailwind CSS

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Google OAuth integration
- bcrypt for password hashing

### Frontend
- React 19 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Axios for API calls
- Lucide React for icons
- React Hot Toast for notifications

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd notes-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Update the Google Client ID in `src/components/GoogleAuth.tsx`:
```typescript
client_id: 'YOUR_ACTUAL_GOOGLE_CLIENT_ID'
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set application type to "Web application"
6. Add authorized origins: `http://localhost:3000`
7. Add authorized redirect URIs: `http://localhost:3000`
8. Copy the Client ID and Client Secret

### 5. Start the application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/signin` - User login
- `POST /api/google` - Google OAuth
- `GET /api/profile` - Get user profile

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/pin` - Toggle pin
- `GET /api/notes/search/:query` - Search notes

## Usage

1. **Sign Up/Login**: Create an account or sign in with Google
2. **Create Notes**: Click "Create Note" to add new notes
3. **Customize**: Choose colors and add tags to organize notes
4. **Pin Notes**: Pin important notes to keep them at the top
5. **Search**: Use the search bar to find specific notes
6. **Filter**: Use the sidebar to filter notes by color
7. **View Modes**: Switch between grid and list views

## Project Structure

```
notes-app/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication middleware
│   │   ├── app.ts           # Express app
│   │   └── db.ts            # Database connection
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   └── App.tsx          # Main app component
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
