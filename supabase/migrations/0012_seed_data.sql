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
-- Asset permissions
('asset.view', 'View Assets', 'assets', 'Can view asset list'),
('asset.create', 'Create Asset', 'assets', 'Can add new assets'),
('asset.update', 'Update Asset', 'assets', 'Can edit assets'),
('asset.delete', 'Delete Asset', 'assets', 'Can delete assets'),

-- Maintenance permissions
('maintenance.view', 'View Maintenance', 'maintenance', 'Can view maintenance records'),
('maintenance.create', 'Create Maintenance', 'maintenance', 'Can create maintenance records'),
('maintenance.update', 'Update Maintenance', 'maintenance', 'Can update maintenance records'),
('maintenance.delete', 'Delete Maintenance', 'maintenance', 'Can delete maintenance records'),

-- Category permissions
('category.view', 'View Categories', 'categories', 'Can view categories'),
('category.manage', 'Manage Categories', 'categories', 'Full control of categories'),

-- Brand permissions
('brand.view', 'View Brands', 'brands', 'Can view brands'),
('brand.manage', 'Manage Brands', 'brands', 'Full control of brands'),

-- Manufacturer permissions
('manufacturer.view', 'View Manufacturers', 'manufacturers', 'Can view manufacturers'),
('manufacturer.manage', 'Manage Manufacturers', 'manufacturers', 'Full control of manufacturers'),

-- Model permissions
('model.view', 'View Models', 'models', 'Can view models'),
('model.manage', 'Manage Models', 'models', 'Full control of models'),

-- Supplier permissions
('supplier.view', 'View Suppliers', 'suppliers', 'Can view suppliers'),
('supplier.manage', 'Manage Suppliers', 'suppliers', 'Full control of suppliers'),

-- Role permissions
('role.view', 'View Roles', 'roles', 'Can view roles'),
('role.manage', 'Manage Roles', 'roles', 'Full control of roles'),

-- Department permissions
('department.view', 'View Departments', 'departments', 'Can view departments'),
('department.manage', 'Manage Departments', 'departments', 'Full control of departments'),

-- Location permissions
('location.view', 'View Locations', 'locations', 'Can view locations'),
('location.manage', 'Manage Locations', 'locations', 'Full control of locations'),

-- Media permissions
('media.view', 'View Media', 'media', 'Can view media files'),
('media.manage', 'Manage Media', 'media', 'Upload and manage media files'),

-- User permissions
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
    -- Assets
    'asset.view',
    'asset.create',
    'asset.update',
    
    -- Maintenance
    'maintenance.view',
    'maintenance.create',
    'maintenance.update',
    
    -- Categories
    'category.view',
    'category.manage',
    
    -- Brands
    'brand.view',
    'brand.manage',
    
    -- Manufacturers
    'manufacturer.view',
    'manufacturer.manage',
    
    -- Models
    'model.view',
    'model.manage',
    
    -- Suppliers
    'supplier.view',
    'supplier.manage',
    
    -- Media
    'media.view',
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
    'maintenance.view',
    'category.view',
    'brand.view',
    'manufacturer.view',
    'model.view',
    'supplier.view',
    'role.view',
    'department.view',
    'location.view',
    'user.view'
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
    -- Maintenance
    'maintenance.view',
    'maintenance.create',
    'maintenance.update',
    
    -- Asset
    'asset.view',
    
    -- View only for CMS
    'category.view',
    'brand.view',
    'manufacturer.view',
    'model.view',
    'supplier.view'
)
WHERE r.code = 'maintenance'
ON CONFLICT DO NOTHING;