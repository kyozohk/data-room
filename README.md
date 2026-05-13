

now i get ofllowing error, this is a community managment sass in which admin would add one or more communities, invite team members to collobrate on different communities so that these team members can message the community memebers, community leader or team members can then import community memebers from csv or eventbrite or add one by one later in the dashbaord

when a user signup as community leader, we will create the user in users document, inside this collection we will have communities collection, in each community collection we will have a documents for teams and members where we will save team members details (name, email, photo, invite link etc) and same for the communitymember

during onboarding, we will keep track of which step of onboarding user has completed in the users document so that if user exits in the middle, we can resume from where they left off - if all steps completed, then when users signgup or signsin, we will redirect them to landing page





# Kyozo Pro Flow - Multi-tenant SaaS Community Management Platform

A Next.js application for managing multi-tenant communities with Firebase authentication and Firestore database.

## Features

- Multi-tenant architecture with tenant-based data isolation
- Firebase authentication with email verification and Google sign-in
- Multi-step onboarding process with progress saving
- User profile management with avatar upload
- Community creation and management
- Member management with CSV import and Eventbrite integration
- Role-based permissions (owner, admin, member, viewer)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Firebase project with Authentication and Firestore enabled

### Environment Setup

Copy the `.env.example` file to `.env.local` and fill in your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Onboarding Flow

The multi-step onboarding process consists of the following steps:

1. **Authentication** - Sign up with email verification or Google sign-in
2. **User Profile** - Set display name, bio, and other profile details
3. **Community Details** - Create and configure the community
4. **Add Members** - Import members via CSV or Eventbrite integration
5. **Complete** - Redirect to dashboard

Each step saves progress to Firestore, allowing users to resume the onboarding process if they exit before completion.

### TenantId Management

The system uses a multi-tenant architecture with tenant-based data isolation:

- Each user is assigned a unique `tenantId` during profile creation
- The `tenantId` is used to isolate data across all collections
- Onboarding progress is saved per `tenantId` and `userId`
- Google sign-in preserves existing `tenantId` for returning users

### Components Structure

- **Dialog.tsx** - Main container for the onboarding steps
- **AuthForm.tsx** - Handles authentication with email verification and Google sign-in
- **UserProfileForm.tsx** - Collects and saves user profile information
- **CommunityDetailsForm.tsx** - Captures community configuration
- **CSVImportForm.tsx** - Handles CSV upload and parsing for member import
- **AddMembersForm.tsx** - Manages member invitation via various methods

## Firebase Integration

### Authentication

- Email verification with 6-digit code
- Google OAuth sign-in with popup
- User profiles stored in Firestore

### Data Structure

```
/users/{userId}
  - profile information
  - tenantId
  - role
  - communities: []

/communities/{communityId}
  - community details
  - ownerId
  - tenantId
  - members: []
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting

### Common Issues

#### Firebase Authentication Domain Issues

If you encounter an "unauthorized domain" error during Google sign-in:

1. Add your domain to the authorized domains list in Firebase Console under Authentication > Settings
2. For local development, enable Firebase emulators by setting `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` in your `.env.local` file

#### TenantId Issues

If users are experiencing problems with tenantId during onboarding:

1. Check that `createUserProfile` is being called with the proper parameters
2. Verify that Google sign-in is preserving existing tenantIds for returning users
3. Ensure all onboarding forms are correctly passing and saving the tenantId

#### Missing Components

If you encounter errors about missing components:

1. Make sure all required components are imported in Dialog.tsx
2. Verify that UserProfileForm.tsx and CSVImportForm.tsx exist and are properly exported

## Recent Fixes

- Fixed missing UserProfileForm and CSVImportForm components
- Resolved tenantId generation and persistence issues across the onboarding flow
- Improved Google sign-in to preserve existing tenantIds for returning users
- Enhanced error handling and logging for authentication and onboarding steps
- Set the DNS for spheres.tech


updaed the lockfile
