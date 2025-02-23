-- Insert initial roles
INSERT INTO roles (name) VALUES 
  ('admin'),
  ('employee')
ON CONFLICT (name) DO NOTHING;

-- Insert admin user (password: admin123)
INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  role_id,
  profile_confirmed,
  profile_confirmed_at
) 
SELECT 
  'admin@cleanteam.com',
  -- This is a bcrypt hash for 'admin123'
  '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa',
  'System',
  'Admin',
  r.id,
  true,
  CURRENT_TIMESTAMP
FROM roles r
WHERE r.name = 'admin'
ON CONFLICT (email) DO NOTHING; 