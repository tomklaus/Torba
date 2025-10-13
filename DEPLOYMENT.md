# Deployment Instructions

To deploy this application to a platform like Railway, Heroku, or similar, follow these steps:

## Railway Deployment

1. Create a new project on Railway
2. Connect your GitHub repository or push your code directly
3. Add the environment variable in the Railway dashboard:
   - Go to your project settings
   - Under "Variables", add a new variable:
     - Key: `DATABASE_URL`
     - Value: `postgresql://postgres:UnbxoeJlIoaxpwAGYTcvVBfrQEROzOQN@centerbeam.proxy.rlwy.net:32328/railway`
4. Deploy the application

## Environment Variables

Make sure to set the following environment variable in your deployment platform:

- `DATABASE_URL`: Your PostgreSQL connection string (e.g., the Railway database URL)

## Important Notes

- The application uses PostgreSQL for data storage
- Make sure the database connection string is properly configured in the deployment environment
- The application will fail to start if the `DATABASE_URL` environment variable is not set
- SSL is automatically configured based on the `NODE_ENV` environment variable (enabled in production)

## Troubleshooting

If you encounter connection errors:
1. Verify that the `DATABASE_URL` environment variable is set correctly
2. Check that the PostgreSQL database is accessible from the deployment environment
3. Ensure that the database credentials are correct
