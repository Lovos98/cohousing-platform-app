# CoHousing Platform - Quick Start Guide

## Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test the Full User Flow

### Scenario 1: Seeker Finding a Home

1. **Login as Sarah (Seeker)**
   - Email: `sarah@example.com`
   - Password: `password123`

2. **Browse Properties**
   - Click "Browse" in the navigation
   - Notice compatibility scores on each property
   - Properties are pre-sorted by best match

3. **View Property Details**
   - Click on "Modern Downtown Apartment" (by Mike Chen)
   - See detailed compatibility breakdown
   - Notice the 85% match score

4. **Send Match Request**
   - Click "Send Match Request"
   - Write a message: "Hi! I love your apartment. I'm a quiet professional and would take great care of the place."
   - Send the request

5. **Check Matches**
   - Go to "Matches" in navigation
   - See your pending request

### Scenario 2: Landlord Reviewing Requests

1. **Login as Mike (Landlord)**
   - Email: `mike@example.com`
   - Password: `password123`

2. **View Match Requests**
   - Go to "Matches"
   - See Sarah's request with 85% compatibility
   - Review her profile and message

3. **Accept the Match**
   - Click "Accept" on Sarah's request
   - Go to "Accepted" tab to see the match

4. **Start Chatting**
   - Click "Send Message" button
   - This opens the messages page

5. **Send a Message**
   - Type: "Thanks for your interest! When would you like to schedule a viewing?"
   - Click send

### Scenario 3: Landlord Creating Property

1. **Login as Lisa (Landlord)**
   - Email: `lisa@example.com`
   - Password: `password123`

2. **Add New Property**
   - Go to "My Properties"
   - Click "Add Property"

3. **Fill Out Property Form**
   - Title: "Cozy Garden Apartment"
   - Description: "Beautiful apartment with private garden access"
   - Price: 1600
   - City: "Seattle"
   - Address: "456 Garden Way, Seattle, WA"
   - Bedrooms: 1
   - Bathrooms: 1
   - Available From: Choose a future date
   - Images: (Optional - add Unsplash URLs)
   - Amenities: WiFi, Garden, Parking

4. **Set Preferences**
   - Adjust sliders for ideal tenant preferences
   - Select pet and smoking preferences

5. **Submit**
   - Click "Create Property Listing"
   - View your new property in "My Properties"

### Scenario 4: Testing Compatibility

1. **Login as Emma (Seeker)**
   - Email: `emma@example.com`
   - Password: `password123`

2. **Update Profile**
   - Go to "Profile"
   - Adjust your lifestyle preferences:
     - Cleanliness: 4/5
     - Noise Tolerance: 2/5
     - Social Level: 4/5
     - Pets: Love
     - Smoking: No
   - Save profile

3. **Browse Properties**
   - Go to "Browse"
   - Notice how compatibility scores change based on your preferences
   - "Artist Loft in Creative District" should show high compatibility (92%)

4. **Compare Properties**
   - Click on different properties
   - Review the compatibility breakdowns
   - See which lifestyle factors match or don't match

### Scenario 5: Messaging Flow

1. **Login as Emma**
   - Email: `emma@example.com`
   - Password: `password123`

2. **View Messages**
   - Go to "Messages"
   - Click on conversation with Lisa Anderson
   - See existing chat history

3. **Send a Message**
   - Type: "That sounds perfect! I'm free this weekend if that works for you?"
   - Click send
   - Message appears immediately in the chat

4. **Switch to Landlord View**
   - Logout
   - Login as Lisa (`lisa@example.com` / `password123`)
   - Go to "Messages"
   - Notice unread badge
   - Click on Emma's conversation
   - See the new message
   - Reply to continue the conversation

## Features to Explore

### Compatibility Algorithm
- **Green (80-100%)**: Excellent match - very similar preferences
- **Blue (60-79%)**: Good match - mostly compatible
- **Yellow (40-59%)**: Moderate match - some differences
- **Red (0-39%)**: Poor match - significant differences

### Preference Categories (with weights)
1. **Cleanliness** (20%) - Most important
2. **Pets** (20%) - Most important
3. **Noise Tolerance** (15%)
4. **Social Level** (15%)
5. **Smoking** (15%)
6. **Overnight Guests** (7.5%)
7. **Shared Expenses** (7.5%)

### Testing Edge Cases

**Perfect Match**
- Create a new seeker account
- Set preferences to exactly match a property
- Should see 100% compatibility

**Poor Match**
- Set conflicting preferences:
  - You: Love pets, No smoking, Very clean
  - Property: Allergic to pets, Smoking OK, Relaxed cleanliness
- Should see low compatibility score

**Match Request States**
- Pending: Waiting for landlord response
- Accepted: Can message each other
- Rejected: No further action

## Tips for Testing

1. **Multiple Browser Windows**: Open two browser windows to test both seeker and landlord views simultaneously

2. **Data Persistence**: Data resets on page refresh (except current user). Use localStorage for persistence if needed.

3. **Create New Users**: Click "Sign Up" to create additional test accounts with different roles and preferences

4. **Experiment with Preferences**: Change sliders to see real-time impact on compatibility scores

5. **Mobile Testing**: Resize browser window to test responsive design

## Common Workflows

### As a Seeker:
Login → Update Profile → Browse → View Details → Send Request → Wait for Acceptance → Message

### As a Landlord:
Login → Create Property → Review Requests → Accept/Reject → Message Tenant

## Pre-populated Demo Data

- **5 Users**: 2 seekers, 3 landlords
- **6 Properties**: Various locations and styles
- **2 Match Requests**: 1 pending, 1 accepted
- **3 Messages**: Sample conversation

All demo accounts use password: `password123`
