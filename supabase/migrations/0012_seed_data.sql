-- =====================================================
-- Asset Monitoring System
-- Seed Data (SAFE + IDEMPOTENT)
-- =====================================================

---------------------------------------------------------
-- 1. ACTIVITY TYPES (MUST BE FIRST)
---------------------------------------------------------
INSERT INTO activity_types (code, name, description, color_code)
VALUES
    ('INSERT', 'Insert', 'Record created', '#22c55e'),
    ('UPDATE', 'Update', 'Record updated', '#f59e0b'),
    ('DELETE', 'Delete', 'Record deleted', '#ef4444')
ON CONFLICT (code) DO NOTHING;

---------------------------------------------------------
-- 2. ROLES
---------------------------------------------------------
INSERT INTO roles (id, code, name, description)
VALUES
    (gen_random_uuid(), 'admin', 'admin', 'Full system access'),
    (gen_random_uuid(), 'encoder', 'encoder', 'Can encode and manage assets'),
    (gen_random_uuid(), 'viewer', 'viewer', 'Read-only access'),
    (gen_random_uuid(), 'maintenance', 'maintenance', 'Handles maintenance operations')
ON CONFLICT (code) DO NOTHING;

---------------------------------------------------------
-- 3. PERMISSIONS
---------------------------------------------------------
INSERT INTO permissions (code, name, module, description)
VALUES
('asset.view', 'View Assets', 'assets', 'Can view asset list'),
('asset.create', 'Create Asset', 'assets', 'Can add new assets'),
('asset.update', 'Update Asset', 'assets', 'Can edit assets'),
('asset.delete', 'Delete Asset', 'assets', 'Can delete assets'),

('maintenance.view', 'View Maintenance', 'maintenance', 'Can view maintenance records'),
('maintenance.create', 'Create Maintenance', 'maintenance', 'Can create maintenance records'),
('maintenance.update', 'Update Maintenance', 'maintenance', 'Can update maintenance records'),
('maintenance.delete', 'Delete Maintenance', 'maintenance', 'Can delete maintenance records'),

('category.manage', 'Manage Categories', 'categories', 'Full control of categories'),

('media.manage', 'Manage Media', 'media', 'Upload and manage media files'),

('user.view', 'View Users', 'users', 'Can view user list'),
('user.manage', 'Manage Users', 'users', 'Can create/update/delete users')
ON CONFLICT (code) DO NOTHING;

---------------------------------------------------------
-- 4. ROLE PERMISSIONS - ADMIN (FULL ACCESS)
---------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'admin'
ON CONFLICT DO NOTHING;

---------------------------------------------------------
-- 5. ROLE PERMISSIONS - ENCODER
---------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
    'asset.view',
    'asset.create',
    'asset.update',
    'maintenance.view',
    'maintenance.create',
    'maintenance.update',
    'category.manage',
    'media.manage'
)
WHERE r.code = 'encoder'
ON CONFLICT DO NOTHING;

---------------------------------------------------------
-- 6. ROLE PERMISSIONS - VIEWER
---------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
    'asset.view',
    'maintenance.view'
)
WHERE r.code = 'viewer'
ON CONFLICT DO NOTHING;

---------------------------------------------------------
-- 7. ROLE PERMISSIONS - MAINTENANCE
---------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
    'maintenance.view',
    'maintenance.create',
    'maintenance.update',
    'asset.view'
)
WHERE r.code = 'maintenance'
ON CONFLICT DO NOTHING;