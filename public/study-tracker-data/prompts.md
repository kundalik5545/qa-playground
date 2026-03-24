Act as a Senior Fullstack Engineer. I am building a dual-role (User and Admin) authentication system for my "QA PlayGround" project.

I have the credentials for Supabase, but I have NOT yet installed or configured Prisma, Better-Auth, or the Supabase client.

Please perform the following initialization and implementation:

1. **Dependency Installation**: Install the necessary packages:
   - `prisma`, `@prisma/client`
   - `better-auth`
   - `@supabase/supabase-js` (if needed for direct client access)

2. **Prisma Initialization**:
   - Initialize Prisma and create a `schema.prisma` file configured for PostgreSQL (Supabase).
   - Define a `Role` enum (`USER`, `ADMIN`).
   - Create a `User` model that includes the standard Better-Auth fields PLUS a `role` field (type `Role`, default `USER`).

3. **Environment Setup**:
   - Check my `.env` file. If missing, prompt me or create placeholders for `DATABASE_URL`, `DIRECT_URL` (from Supabase), and `BETTER_AUTH_SECRET`.

4. **Better-Auth Core Setup**:
   - Create the auth configuration (e.g., `lib/auth.ts`).
   - Use the Prisma adapter.
   - Map the `role` database field to the session object using `additionalFields` so it is accessible in the frontend.

5. **Route Protection & Redirection**:
   - Create a Next.js `middleware.ts` to protect `/admin` routes. If a user isn't an `ADMIN`, redirect them to the home page or `/dashboard`.
   - Implement/update a Login component. After successful login, redirect users based on their role:
     - `ADMIN` -> `/admin/dashboard`
     - `USER` -> `/study-tracker`

Please search the codebase first to ensure you follow the existing project structure and naming conventions. Use claude.md file for information
