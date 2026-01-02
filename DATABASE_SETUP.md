# Database Setup Guide

## The Error

You're getting "Database error occurred" because your PostgreSQL database is not set up or connected.

## Step 1: Set up DATABASE_URL in .env.local

Add this to your `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### Option A: Use Local PostgreSQL

If you have PostgreSQL installed locally:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/product1_db"
```

### Option B: Use a Cloud Database (Recommended for Development)

You can use free PostgreSQL databases from:

- **Supabase** (https://supabase.com) - Free tier available
- **Neon** (https://neon.tech) - Free tier available
- **Railway** (https://railway.app) - Free tier available

After creating a database, copy the connection string and add it to `.env.local`.

## Step 2: Generate Prisma Client

**IMPORTANT:** Stop your dev server first (Ctrl+C), then run:

```bash
npx prisma generate
```

## Step 3: Create Database Tables

Run this to create all tables in your database:

```bash
npx prisma db push
```

Or if you want to use migrations:

```bash
npx prisma migrate dev --name init
```

## Step 4: Verify Database Connection

Check if Prisma can connect:

```bash
npx prisma db pull
```

## Step 5: Restart Dev Server

After setting up the database:

```bash
npm run dev
```

## Quick Setup with Supabase (Easiest)

1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Go to Project Settings → Database
5. Copy the "Connection string" (URI format)
6. Add it to `.env.local` as `DATABASE_URL`
7. Run `npx prisma generate`
8. Run `npx prisma db push`
9. Restart your dev server

## Troubleshooting

- **"Can't reach database server"**: Check if DATABASE_URL is correct
- **"Table does not exist"**: Run `npx prisma db push`
- **"PrismaClient is not defined"**: Run `npx prisma generate`
- **Permission errors**: Stop your dev server before running Prisma commands
