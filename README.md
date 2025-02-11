# Todo Application

A full-stack Todo application built with Next.js, PostgreSQL, and NextAuth.

## Features

- User authentication (Google OAuth and credentials)
- Protected routes
- CRUD operations for todos
- Real-time updates
- Responsive design
- Unit testing

## Tech Stack

- Next.js 13 (App Router)
- PostgreSQL with Prisma ORM
- NextAuth.js for authentication
- TailwindCSS & ShadCN UI for styling
- Jest & React Testing Library for testing

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Run the test suite:
```bash
npm test
```

## Code Complexity Analysis

- Task Addition: O(1) - Direct database insertion
- Task Deletion: O(1) - Direct database deletion
- Task Update: O(1) - Direct database update
- Task Listing: O(n) - Where n is the number of todos for the user

## Assumptions

1. Users have stable internet connections
2. Google OAuth is the primary authentication method
3. Real-time updates are handled client-side
4. Users manage a reasonable number of todos

## Database Schema

The application uses the following main tables:
- User: Stores user information
- Todo: Stores todo items with user relationships
- Account: Manages OAuth accounts
- Session: Handles user sessions

## Security

- Protected API routes
- JWT-based authentication
- SQL injection prevention via Prisma
- XSS protection via Next.js
- CSRF protection
- Secure password hashing

## Deployment

The application can be deployed to Vercel with the following steps:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

## License

MIT