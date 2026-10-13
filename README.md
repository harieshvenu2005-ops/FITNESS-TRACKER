# HealthTracker Pro

A world-class comprehensive full-stack fitness and health tracking application with synchronized dashboards for monitoring fitness activities, diet & nutrition, and healthcare metrics. Features advanced analytics, telemedicine capabilities, medication tracking, doctor communication, AI-powered insights, and complete data management. **All data is persisted in browser localStorage with optional backend synchronization for a complete full-stack experience.**

## Features

### 🔐 Authentication & Profiles
- Multi-user support with email/password login
- Administrator role can manage other accounts
- Front‑end uses JWT stored in localStorage

### 🏃 Fitness Tracker
- Log workouts with duration and calories burned
- Track daily steps and active minutes
- Monitor 7-day activity trends with interactive charts
- View workout history and statistics
- Multiple workout types supported (Running, Cycling, Swimming, Yoga, Weight Training, etc.)
- **All workout data persisted in localStorage**

### 🍎 Diet & Nutrition
- Log meals with detailed nutrition information
- Track macronutrients (Protein, Carbs, Fats)
- Monitor daily calorie intake vs. calories burned
- Visual macro distribution with pie charts
- 7-day calorie trends
- Daily nutrition goals with progress tracking
- Recipe database with meal planning
- Barcode scanning for food items (future integration)
- **Meal and nutrition data automatically saved**

### 🏥 Healthcare Dashboard
- Record health vitals (Heart Rate, Blood Pressure, Weight, Sleep Duration)
- Schedule and manage doctor appointments
- View vital trends over time with line charts
- Track multiple health metrics simultaneously
- Healthcare provider management
- Medication tracking with dosage and frequency
- **Health records stored securely in localStorage**

### 💊 Medication Management
- Track prescriptions with dosages and schedules
- Set medication reminders
- Monitor medication adherence
- Record side effects and notes
- Medication history and trends

### 📊 Advanced Analytics & Patient Analysis
- AI-powered health insights and recommendations
- Comprehensive dashboard with key metrics
- Trend analysis for all health data
- Predictive analytics for health goals
- Workout streaks and achievement tracking
- Personalized health score calculations

### 🩺 Telemedicine & Doctor Communication
- Secure messaging with healthcare providers
- Video call scheduling and management
- Appointment coordination
- Medical record sharing
- Real-time health monitoring alerts

### 👨‍🍳 Recipe Database & Meal Planning
- Extensive recipe collection with nutritional info
- Meal planning and grocery list generation
- Custom recipe creation
- Dietary restriction filtering
- Cooking instructions and ingredient lists

### �� Main Dashboard
- Unified overview of all health metrics
- Real-time synchronization across all sections
- Weekly activity summaries
- Nutrition breakdown
- Upcoming appointments
- Health vitals at a glance
- Medication reminders
- Doctor message notifications

### ⚙️ Settings & Data Management
- View storage statistics
- Export all data to JSON file (backup)
- Import data from JSON file (restore)
- Clear all data option
- Total records counter
- User profile management
- Notification preferences
- **Complete data portability**

## Full-Stack Architecture

### Frontend
- **React 18** with TypeScript for type-safe UI development
- **React Router 7** for client-side routing
- **Tailwind CSS v4** for responsive styling
- **Recharts** for data visualization

### Backend/Database
- **Browser localStorage** as the persistent database layer
- Automatic data synchronization on every change
- Error handling and data validation
- JSON serialization/deserialization
- Data export/import functionality

### State Management
- **React Context API** for global state
- Centralized `HealthContext` managing all health data
- Real-time updates across all components
- Optimistic UI updates

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm

To install pnpm globally:
```bash
npm install -g pnpm
```

## Installation

1. **Clone or download this repository**

2. **Navigate to the project directory**
   ```bash
   cd your-project-directory
   ```

3. **Install dependencies**
   
   Using pnpm (recommended):
   ```bash
   pnpm install
   ```
   
   Or using npm:
   ```bash
   npm install
   ```

   After installing root dependencies you'll also need to install the backend server packages:
   ```bash
   cd backend
   npm install         # or pnpm install
   cd ..
   ```

## Running the Application

### Development Mode

To start the development server:

Using pnpm:
```bash
pnpm dev
```

Or using npm:
```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another available port).

### Production Build

To build the application for production:

Using pnpm:
```bash
pnpm build
```

Or using npm:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   └── figma/           # Figma-specific components
│   │   ├── contexts/
│   │   │   ├── HealthContext.tsx # Full-stack state & localStorage management
│   │   │   └── AuthContext.tsx  # Authentication state management
│   │   ├── pages/
│   │   │   ├── Root.tsx         # Layout with navigation
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── Fitness.tsx      # Fitness tracker page
│   │   │   ├── Diet.tsx         # Diet & nutrition page
│   │   │   ├── Healthcare.tsx   # Healthcare dashboard
│   │   │   ├── Medications.tsx  # Medication tracking
│   │   │   ├── Messages.tsx     # Doctor communication
│   │   │   ├── Recipes.tsx      # Recipe database
│   │   │   ├── Analytics.tsx    # Advanced analytics
│   │   │   ├── Settings.tsx     # Data management & settings
│   │   │   ├── Login.tsx        # Authentication page
│   │   │   └── NotFound.tsx     # 404 page
│   │   ├── routes.ts            # React Router configuration
│   │   └── App.tsx              # Main app component
│   └── styles/
│       ├── index.css
│       ├── tailwind.css
│       ├── theme.css
│       └── fonts.css
├── backend/
│   ├── src/
│   │   ├── index.ts             # Express server
│   │   ├── db.ts               # Database configuration
│   │   ├── auth.ts             # Authentication middleware
│   │   └── routes/
│   │       ├── auth.ts         # Authentication endpoints
│   │       ├── users.ts        # User management
│   │       ├── health.ts       # Health data endpoints
│   │       ├── medications.ts  # Medication endpoints
│   │       ├── messages.ts     # Communication endpoints
│   │       └── recipes.ts      # Recipe endpoints
│   └── data/
│       └── db.json             # File-based database
├── package.json
└── vite.config.ts
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **React Router 7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Vite** - Fast build tool and dev server
- **Express.js** - Backend web framework
- **LowDB** - File-based JSON database
- **JWT** - JSON Web Tokens for authentication
- **LocalStorage API** - Browser-based persistent storage
- **Sonner** - Toast notifications

## Key Features

### Full-Stack Data Persistence
The application uses browser localStorage as a full-stack database solution:
- **Automatic Saving**: All changes are automatically saved to localStorage
- **Data Initialization**: First-time users get sample data to explore features
- **Error Handling**: Graceful error handling for storage operations
- **Data Validation**: Type-safe data structures with TypeScript
- **Export/Import**: Full backup and restore capabilities

### Data Synchronization
All dashboards share a centralized `HealthContext` that ensures real-time data synchronization across:
- Fitness activities
- Meal logs
- Health vitals
- Medical appointments
- Daily statistics

### Interactive Charts
- **Line Charts** - Activity trends, calorie tracking, vital signs
- **Bar Charts** - Workout comparisons, meal breakdowns
- **Pie Charts** - Nutrition distribution, macro tracking
- **Area Charts** - Step tracking, active minutes

### Responsive Design
The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## Usage Guide

### Adding a Workout
1. Navigate to the **Fitness** page
2. Click **"Log Workout"**
3. Select workout type, duration, and calories burned
4. Click **"Add Workout"** to save
5. **Data is automatically saved to localStorage**

### Logging a Meal
1. Navigate to the **Diet** page
2. Click **"Log Meal"**
3. Enter meal name and nutritional information
4. Click **"Add Meal"** to save
5. **Nutrition data persists automatically**

### Recording Health Vitals
1. Navigate to the **Healthcare** page
2. Click **"Add Vital"**
3. Select vital type and enter value
4. Click **"Record Vital"** to save
5. **Health metrics stored in localStorage**

### Scheduling an Appointment
1. Navigate to the **Healthcare** page
2. Click **"Book Appointment"**
3. Enter doctor information, specialty, date, and time
4. Click **"Schedule Appointment"** to save
5. **Appointment data persisted locally**

### Tracking Medications
1. Navigate to the **Medications** page
2. Click **"Add Medication"**
3. Enter medication details (name, dosage, frequency, dates)
4. Add notes if needed
5. Click **"Add Medication"** to save
6. **Medication data persisted locally**

### Communicating with Doctors
1. Navigate to the **Messages** page
2. Select a doctor from the dropdown
3. Choose message type (text or video call request)
4. Type your message
5. Click **"Send Message"** or **"Request Video Call"**
6. View message history in the chat interface

### Using Recipes
1. Navigate to the **Recipes** page
2. Browse available recipes or search by name/tag
3. Click **"Add Recipe"** to create custom recipes
4. Click **"Add to Today's Meals"** to log a recipe as a meal
5. **Recipe data synchronized with meal tracking**

### Viewing Advanced Analytics
1. Navigate to the **Analytics** page
2. Review key health insights and metrics
3. Analyze workout and nutrition trends
4. View AI-powered recommendations
5. Monitor health score and streaks

## Data Storage

### LocalStorage Structure
```javascript
{
  "healthtracker_workouts": [...],
  "healthtracker_meals": [...],
  "healthtracker_health_metrics": [...],
  "healthtracker_appointments": [...],
  "healthtracker_daily_stats": [...],
  "healthtracker_initialized": "true"
}
```

### Data Backup
Your data is stored locally in your browser's localStorage. To ensure you don't lose your data:
1. Regularly export your data from the Settings page
2. Store the JSON backup file in a safe location
3. Import the backup if you switch browsers or devices

### Important Notes
- Data persists across browser sessions
- Data is device-specific (not synced across devices)
- Clearing browser data/cache will delete all stored information
- Regular backups are recommended

## Mock Data

The application comes pre-loaded with mock data on first launch:
- Sample workouts from the past week
- Example meals with nutrition information
- Health vitals (heart rate, blood pressure, weight, sleep)
- Scheduled appointments
- 7 days of daily statistics

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

To modify or extend the application:

1. **Add new features** to the respective page components in `/src/app/pages/`
2. **Update shared state & localStorage** in `/src/app/contexts/HealthContext.tsx`
3. **Create new UI components** in `/src/app/components/`
4. **Modify routes** in `/src/app/routes.ts`

### LocalStorage Best Practices
- Always handle JSON parse errors
- Check storage availability before writing
- Keep data structures consistent
- Version your data format for future migrations

## Security & Privacy

- All data stays on your device
- No external servers or APIs
- No data collection or tracking
- Full data ownership and control
- Export your data anytime

## License

This project is provided as-is for demonstration and development purposes.

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.

## Backend Server

A simple Node/Express‑based backend lives in `backend/`. It uses file storage
(via [lowdb](https://github.com/typicode/lowdb)) so you don’t need a separate
database during development.

### Quick start

```bash
cd backend
npm install        # or pnpm/yarn
npm run dev        # starts on port 4000 (see .env)
```

Front‑end requests to `/api/*` are proxied to the server when running
`npm run dev` from the project root. Helper functions are provided in
`src/utils/api.ts` for convenience.

### API endpoints

- `POST /api/auth/register` – create a new account (name, email, password, optional role)
- `POST /api/auth/login` – authenticate and receive a JWT
- `GET /api/users/profile` – get current user's profile (requires token)
- `GET /api/users` – list all users (**admin only**)
- `POST /api/users` – admin creates a user (requires token)
- `GET /api/health?userId=<id>` – retrieve health entries (admin may specify any user)
- `POST /api/health` – add a health entry (user id taken from token unless admin overrides)
- `GET /api/medications` – get user's medications
- `POST /api/medications` – add medication
- `PUT /api/medications/:id` – update medication
- `DELETE /api/medications/:id` – delete medication
- `GET /api/messages` – get user's messages
- `POST /api/messages` – send message
- `GET /api/recipes` – get all recipes
- `POST /api/recipes` – add recipe (admin)
- `GET /api/recipes/search?q=<query>` – search recipes

A default administrator account is seeded on first run:

```
email: admin@example.com
password: admin
```

Use it to create more users or to inspect other profiles. Tokens are stored in browser localStorage (`auth_token`) and sent with each API request via the front-end helper functions.

You can run the front‑end and backend in separate terminals or with a tool
like `concurrently`.

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and LocalStorage**