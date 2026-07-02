-- =====================================================
-- Asset Monitoring System
-- Seed Departments and Locations
-- =====================================================

-- Create default department
INSERT INTO departments (
    id,
    code,
    name,
    description
)
VALUES (
    gen_random_uuid(),
    'admin',
    'Administration',
    'System Administration Department'
)
ON CONFLICT (code) DO NOTHING;

-- Create default location
INSERT INTO locations (
    id,
    code,
    name,
    description,
    building,
    floor,
    room
)
VALUES (
    gen_random_uuid(),
    'admin',
    'Administration Office',
    'Main Administration Office',
    'Main Building',
    '1st Floor',
    '101'
)
ON CONFLICT (code) DO NOTHING;

-- Seed more departments (optional)
INSERT INTO departments (id, code, name, description)
VALUES 
    (gen_random_uuid(), 'it', 'Information Technology', 'IT Department'),
    (gen_random_uuid(), 'hr', 'Human Resources', 'HR Department'),
    (gen_random_uuid(), 'finance', 'Finance', 'Finance Department')
ON CONFLICT (code) DO NOTHING;

-- Seed more locations (optional)
INSERT INTO locations (id, code, name, description, building, floor, room)
VALUES 
    (gen_random_uuid(), 'it-office', 'IT Office', 'IT Department Office', 'Main Building', '2nd Floor', '201'),
    (gen_random_uuid(), 'hr-office', 'HR Office', 'HR Department Office', 'Main Building', '2nd Floor', '202'),
    (gen_random_uuid(), 'finance-office', 'Finance Office', 'Finance Department Office', 'Main Building', '3rd Floor', '301')
ON CONFLICT (code) DO NOTHING;