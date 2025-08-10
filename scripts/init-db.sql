-- Initial database setup for AquaFlow
-- This script runs automatically when using Docker Compose

-- Ensure the database and user exist
-- (These are created by environment variables, but we can add additional setup here)

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE aquaflow_dev TO aquaflow_user;
GRANT ALL ON SCHEMA public TO aquaflow_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO aquaflow_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO aquaflow_user;

-- Enable UUID extension (useful for generating UUIDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a simple health check function
CREATE OR REPLACE FUNCTION health_check()
RETURNS TEXT AS $$
BEGIN
    RETURN 'AquaFlow Database - Ready for connections';
END;
$$ LANGUAGE plpgsql;

-- Log successful initialization
DO $$ 
BEGIN 
    RAISE NOTICE 'AquaFlow database initialized successfully';
END $$;