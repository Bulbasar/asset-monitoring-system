-- =====================================================
-- Asset Monitoring System
-- Seed Data (Roles + Permissions + Role Permissions)
-- =====================================================

---------------------------------------------------------
-- ROLES
---------------------------------------------------------
INSERT INTO roles (id, code, name, description)
VALUES
    (gen_random_uuid(), 'admin', 'admin', 'Full system access'),
    (gen_random_uuid(), 'encoder', 'encoder', 'Can encode and manage assets'),
    (gen_random_uuid(), 'viewer', 'viewer', 'Read-only access'),
    (gen_random_uuid(), 'maintenance', 'maintenance', 'Handles maintenance operations');
    
---------------------------------------------------------
-- PERMISSIONS
---------------------------------------------------------
INSERT INTO permissions (code, name, module, description)
VALUES

-- =========================
-- ASSETS MODULE
-- =========================
('asset.view', 'View Assets', 'assets', 'Can view asset list'),
('asset.create', 'Create Asset', 'assets', 'Can add new assets'),
('asset.update', 'Update Asset', 'assets', 'Can edit assets'),
('asset.delete', 'Delete Asset', 'assets', 'Can delete assets'),

-- =========================
-- MAINTENANCE MODULE
-- =========================
('maintenance.view', 'View Maintenance', 'maintenance', 'Can view maintenance records'),
('maintenance.create', 'Create Maintenance', 'maintenance', 'Can create maintenance records'),
('maintenance.update', 'Update Maintenance', 'maintenance', 'Can update maintenance records'),
('maintenance.delete', 'Delete Maintenance', 'maintenance', 'Can delete maintenance records'),

-- =========================
-- CATEGORIES MODULE
-- =========================
('category.manage', 'Manage Categories', 'categories', 'Full control of categories'),

-- =========================
-- MEDIA MODULE
-- =========================
('media.manage', 'Manage Media', 'media', 'Upload and manage media files'),

-- =========================
-- USERS MODULE (optional but useful)
-- =========================
('user.view', 'View Users', 'users', 'Can view user list'),
('user.manage', 'Manage Users', 'users', 'Can create/update/delete users');

---------------------------------------------------------
-- ROLE PERMISSIONS (ADMIN - FULL ACCESS)
---------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'admin';

---------------------------------------------------------
-- ROLE PERMISSIONS (ENCODER)
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
WHERE r.name = 'encoder';

---------------------------------------------------------
-- ROLE PERMISSIONS (VIEWER - READ ONLY)
---------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
    'asset.view',
    'maintenance.view'
)
WHERE r.name = 'viewer';

---------------------------------------------------------
-- ROLE PERMISSIONS (MAINTENANCE STAFF)
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
WHERE r.name = 'maintenance';