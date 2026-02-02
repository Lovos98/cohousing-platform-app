# CoHousing Platform MVP

A local-first prototype of an AI-powered cohousing platform that matches landlords and tenants based on lifestyle compatibility.

## Features

- **Smart Matching Algorithm**: Calculates compatibility scores based on lifestyle preferences
- **User Profiles**: Detailed profiles with customizable lifestyle preferences
- **Property Listings**: Create and browse property listings with images and amenities
- **Match Requests**: Send and receive match requests with compatibility breakdowns
- **Real-time Messaging**: Chat with accepted matches (simulated local state)
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Data Storage**: In-memory mock data (localStorage for auth)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Accounts

The platform comes with pre-populated demo data:

### Seekers (Looking for housing):
- **Email**: sarah@example.com | **Password**: password123
- **Email**: emma@example.com | **Password**: password123

### Landlords (Property owners):
- **Email**: mike@example.com | **Password**: password123
- **Email**: david@example.com | **Password**: password123
- **Email**: lisa@example.com | **Password**: password123

## User Flow

### For Seekers:
1. **Sign up** or login with a seeker account
2. **Complete your profile** with lifestyle preferences (cleanliness, noise tolerance, social level, pets, smoking, etc.)
3. **Browse properties** - see compatibility scores on each listing
4. **View property details** - see detailed compatibility breakdown
5. **Send match request** - introduce yourself to the landlord
6. **Wait for acceptance** - landlord reviews your request
7. **Chat with landlord** - discuss details after acceptance

### For Landlords:
1. **Sign up** or login with a landlord account
2. **Complete your profile** with ideal tenant preferences
3. **Create property listings** - add photos, amenities, and preferences
4. **Review match requests** - see seeker profiles and compatibility scores
5. **Accept/reject requests** - choose your ideal tenant
6. **Chat with tenant** - finalize arrangements

## Compatibility Algorithm

The matching algorithm analyzes 7 key lifestyle factors:

1. **Cleanliness** (20% weight) - How tidy vs. relaxed
2. **Noise Tolerance** (15% weight) - Quiet vs. high tolerance
3. **Social Level** (15% weight) - Private vs. very social
4. **Pets** (20% weight) - Love, OK, No, or Allergic
5. **Smoking** (15% weight) - Yes, No, or Occasional
6. **Overnight Guests** (7.5% weight) - Frequency preference
7. **Shared Expenses** (7.5% weight) - Separate vs. shared

Scores are calculated on a 0-100 scale:
- **80-100%**: Excellent Match (Green)
- **60-79%**: Good Match (Blue)
- **40-59%**: Moderate Match (Yellow)
- **0-39%**: Poor Match (Red)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── profile/           # User profile
│   ├── browse/            # Browse properties
│   ├── properties/        # Property listings & details
│   ├── matches/           # Match requests
│   └── messages/          # Messaging
├── components/
│   ├── auth/              # Authentication forms
│   ├── layout/            # Header, navigation
│   ├── matching/          # Compatibility score, match cards
│   ├── messages/          # Chat interface
│   ├── profile/           # Profile form
│   ├── properties/        # Property cards, forms
│   └── ui/                # shadcn/ui components
├── contexts/
│   └── AppContext.tsx     # Global state management
└── lib/
    ├── compatibility.ts   # Matching algorithm
    ├── mockData.ts        # Sample data
    └── types.ts           # TypeScript interfaces
```

## Key Components

### AppContext
Manages all application state including:
- User authentication (localStorage-based)
- Users, properties, match requests, messages
- CRUD operations for all entities

### Compatibility Algorithm
Calculates compatibility scores between user preferences using weighted scoring system. Handles both scalar values (1-5 scales) and categorical values (pets, smoking).

### Mock Data
Includes 5 users and 6 properties with realistic data to demonstrate the platform functionality.

## Local Data Persistence

- **Authentication**: User ID stored in localStorage
- **All other data**: In-memory state (resets on page refresh)
- **To persist data**: Wrap context with localStorage or implement IndexedDB

## Limitations (MVP Scope)

This is a local-first prototype. The following are NOT implemented:

- Real backend/database (Supabase integration ready but not connected)
- Image uploads (uses placeholder URLs)
- Email notifications
- Payment processing
- Real-time websocket updates
- User verification
- Advanced search/filtering
- Mobile app
- Production deployment setup

## Future Enhancements

1. **Supabase Integration**: Replace mock data with real database
2. **Image Uploads**: Use Supabase Storage for property images
3. **Real-time Chat**: Implement with Supabase Realtime
4. **Advanced Matching**: ML-based recommendations
5. **Reviews & Ratings**: User feedback system
6. **Calendar Integration**: Schedule viewings
7. **Document Management**: Lease agreements, background checks
8. **Payment Integration**: Rent payments, deposits

## Development

### Adding New Components
```bash
npx shadcn@latest add [component-name]
```

### Code Style
- Use TypeScript strict mode
- Follow React hooks best practices
- Keep components small and focused
- Use Tailwind utility classes

## License

MIT License - Feel free to use this as a starting point for your own projects!

## Credits

Built with Next.js, shadcn/ui, and Tailwind CSS.
Images from Unsplash.
