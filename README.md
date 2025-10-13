# Torba Text Storage App

A Next.js application that allows users to save and retrieve text entries using PostgreSQL database.

## Features

- Input field for entering text
- Save button to store text in the database
- Display of previously entered text entries
- Timestamps for each entry

## Tech Stack

- Next.js 14 (with App Router)
- PostgreSQL (via Railway)
- Node.js

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string for Railway database

## Deployment to Railway

This app is designed for deployment on Railway. To deploy:

1. Connect your GitHub repository to Railway
2. Add your PostgreSQL database as a service on Railway
3. Set the `DATABASE_URL` environment variable to your Railway database connection string
4. Deploy the application

The application will automatically create the required database table on first run.

## Local Development

1. Install dependencies: `npm install`
2. Set up your PostgreSQL database and set the `DATABASE_URL` environment variable
3. Run the development server: `npm run dev`
