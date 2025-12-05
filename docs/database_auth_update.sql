-- Database Schema Updates for Authentication System
-- Run this script to add authentication-related columns to existing tables

-- Add authentication columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS refresh_token TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP;

-- Add unique constraint on email for authentication
ALTER TABLE users 
ADD CONSTRAINT IF NOT EXISTS unique_user_email UNIQUE (email);

-- Add index on email for faster login queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Add index on refresh_token for token validation
CREATE INDEX IF NOT EXISTS idx_users_refresh_token ON users(refresh_token);

-- Add index on is_active for filtering active users
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Create sessions table for session management (optional)
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Add indexes for sessions table
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Create audit log table for security tracking
CREATE TABLE IF NOT EXISTS auth_audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- login, logout, password_change, etc.
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for audit log
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_user_id ON auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_action ON auth_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_created_at ON auth_audit_log(created_at);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for password reset tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Insert default admin user (password: admin123)
-- WARNING: Change this password in production!
INSERT INTO users (full_name, email, password_hash, role, is_active, created_at)
VALUES (
    'System Administrator',
    'admin@patientmanagement.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', -- bcrypt hash of 'admin123'
    'admin',
    true,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create admin user record
INSERT INTO doctors (user_id, specialization, license_number, experience_years)
SELECT id, 'System Administration', 'ADMIN001', 0
FROM users 
WHERE email = 'admin@patientmanagement.com' 
AND role = 'admin'
ON CONFLICT DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts with authentication information';
COMMENT ON COLUMN users.password_hash IS 'BCrypt hashed password';
COMMENT ON COLUMN users.refresh_token IS 'JWT refresh token for session management';
COMMENT ON COLUMN users.is_active IS 'Whether the user account is active';
COMMENT ON COLUMN users.last_login IS 'Timestamp of last successful login';
COMMENT ON COLUMN users.failed_login_attempts IS 'Number of consecutive failed login attempts';
COMMENT ON COLUMN users.account_locked_until IS 'Timestamp until which account is locked due to failed attempts';

COMMENT ON TABLE user_sessions IS 'Active user sessions for session management';
COMMENT ON TABLE auth_audit_log IS 'Audit log for authentication and security events';
COMMENT ON TABLE password_reset_tokens IS 'Temporary tokens for password reset functionality';

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    DELETE FROM password_reset_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to log authentication events
CREATE OR REPLACE FUNCTION log_auth_event(
    p_user_id INTEGER,
    p_action VARCHAR(50),
    p_ip_address INET,
    p_user_agent TEXT,
    p_success BOOLEAN,
    p_details JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO auth_audit_log (user_id, action, ip_address, user_agent, success, details)
    VALUES (p_user_id, p_action, p_ip_address, p_user_agent, p_success, p_details);
END;
$$ LANGUAGE plpgsql; 