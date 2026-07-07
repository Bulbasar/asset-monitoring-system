-- =====================================================
-- Asset Monitoring System
-- Row Level Security (PERMISSION-BASED UPGRADE)
-- =====================================================

---------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
---------------------------------------------------------

ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_transaction_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

---------------------------------------------------------
-- REMOVE OLD POLICIES
---------------------------------------------------------

DROP POLICY IF EXISTS authenticated_read_media ON media;
DROP POLICY IF EXISTS authenticated_read_asset_statuses ON asset_statuses;
DROP POLICY IF EXISTS authenticated_read_asset_conditions ON asset_conditions;
DROP POLICY IF EXISTS authenticated_read_maintenance_types ON maintenance_types;
DROP POLICY IF EXISTS authenticated_read_asset_transaction_types ON asset_transaction_types;
DROP POLICY IF EXISTS authenticated_read_categories ON categories;
DROP POLICY IF EXISTS authenticated_read_manufacturers ON manufacturers;
DROP POLICY IF EXISTS authenticated_read_brands ON brands;
DROP POLICY IF EXISTS authenticated_read_models ON models;
DROP POLICY IF EXISTS authenticated_read_roles ON roles;
DROP POLICY IF EXISTS authenticated_read_departments ON departments;
DROP POLICY IF EXISTS authenticated_read_locations ON locations;
DROP POLICY IF EXISTS authenticated_read_suppliers ON suppliers;
DROP POLICY IF EXISTS authenticated_read_activity_types ON activity_types;
DROP POLICY IF EXISTS authenticated_read_system_settings ON system_settings;
DROP POLICY IF EXISTS authenticated_read_profiles ON profiles;
DROP POLICY IF EXISTS authenticated_read_assets ON assets;
DROP POLICY IF EXISTS authenticated_read_asset_transactions ON asset_transactions;
DROP POLICY IF EXISTS authenticated_read_maintenance_logs ON maintenance_logs;
DROP POLICY IF EXISTS authenticated_read_activity_logs ON activity_logs;

DROP POLICY IF EXISTS authenticated_insert_all ON profiles;
DROP POLICY IF EXISTS authenticated_insert_assets ON assets;
DROP POLICY IF EXISTS authenticated_insert_transactions ON asset_transactions;
DROP POLICY IF EXISTS authenticated_insert_maintenance ON maintenance_logs;
DROP POLICY IF EXISTS authenticated_insert_activity_logs ON activity_logs;

DROP POLICY IF EXISTS authenticated_update_profiles ON profiles;
DROP POLICY IF EXISTS authenticated_update_assets ON assets;
DROP POLICY IF EXISTS authenticated_update_asset_transactions ON asset_transactions;
DROP POLICY IF EXISTS authenticated_update_maintenance_logs ON maintenance_logs;
DROP POLICY IF EXISTS authenticated_update_activity_logs ON activity_logs;

DROP POLICY IF EXISTS authenticated_delete_profiles ON profiles;
DROP POLICY IF EXISTS authenticated_delete_assets ON assets;
DROP POLICY IF EXISTS authenticated_delete_asset_transactions ON asset_transactions;
DROP POLICY IF EXISTS authenticated_delete_maintenance_logs ON maintenance_logs;
DROP POLICY IF EXISTS authenticated_delete_activity_logs ON activity_logs;

---------------------------------------------------------
-- DROP ALL EXISTING CMS POLICIES
---------------------------------------------------------

DO $$
DECLARE
    tables text[] := ARRAY[
        'categories', 'brands', 'manufacturers', 'models', 
        'suppliers', 'roles', 'departments', 'locations'
    ];
    t text;
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I_select ON %I;', t, t);
        EXECUTE format('DROP POLICY IF EXISTS %I_insert ON %I;', t, t);
        EXECUTE format('DROP POLICY IF EXISTS %I_update ON %I;', t, t);
        EXECUTE format('DROP POLICY IF EXISTS %I_delete ON %I;', t, t);
    END LOOP;
END $$;

---------------------------------------------------------
-- MEDIA POLICIES
---------------------------------------------------------
CREATE POLICY media_select ON media
    FOR SELECT TO authenticated
    USING (has_permission('media.manage'));

CREATE POLICY media_insert ON media
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('media.manage'));

CREATE POLICY media_update ON media
    FOR UPDATE TO authenticated
    USING (has_permission('media.manage'))
    WITH CHECK (has_permission('media.manage'));

CREATE POLICY media_delete ON media
    FOR DELETE TO authenticated
    USING (has_permission('media.manage'));

---------------------------------------------------------
-- ASSETS POLICIES
---------------------------------------------------------
CREATE POLICY assets_select ON assets
    FOR SELECT TO authenticated
    USING (has_permission('asset.view'));

CREATE POLICY assets_insert ON assets
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('asset.create'));

CREATE POLICY assets_update ON assets
    FOR UPDATE TO authenticated
    USING (has_permission('asset.update'))
    WITH CHECK (has_permission('asset.update'));

CREATE POLICY assets_delete ON assets
    FOR DELETE TO authenticated
    USING (has_permission('asset.delete'));

---------------------------------------------------------
-- MAINTENANCE POLICIES
---------------------------------------------------------
CREATE POLICY maintenance_select ON maintenance_logs
    FOR SELECT TO authenticated
    USING (has_permission('maintenance.view'));

CREATE POLICY maintenance_insert ON maintenance_logs
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('maintenance.create'));

CREATE POLICY maintenance_update ON maintenance_logs
    FOR UPDATE TO authenticated
    USING (has_permission('maintenance.update'))
    WITH CHECK (has_permission('maintenance.update'));

CREATE POLICY maintenance_delete ON maintenance_logs
    FOR DELETE TO authenticated
    USING (has_permission('maintenance.delete'));

---------------------------------------------------------
-- TRANSACTIONS POLICIES
---------------------------------------------------------
CREATE POLICY transactions_select ON asset_transactions
    FOR SELECT TO authenticated
    USING (has_permission('asset.view'));

CREATE POLICY transactions_insert ON asset_transactions
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('asset.update'));

CREATE POLICY transactions_update ON asset_transactions
    FOR UPDATE TO authenticated
    USING (has_permission('asset.update'))
    WITH CHECK (has_permission('asset.update'));

CREATE POLICY transactions_delete ON asset_transactions
    FOR DELETE TO authenticated
    USING (has_permission('asset.delete'));

---------------------------------------------------------
-- CATEGORIES POLICIES (Full CRUD with manage permission)
---------------------------------------------------------
CREATE POLICY categories_select ON categories
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY categories_insert ON categories
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('category.manage'));

CREATE POLICY categories_update ON categories
    FOR UPDATE TO authenticated
    USING (has_permission('category.manage'))
    WITH CHECK (has_permission('category.manage'));

CREATE POLICY categories_delete ON categories
    FOR DELETE TO authenticated
    USING (has_permission('category.manage'));

---------------------------------------------------------
-- BRANDS POLICIES
---------------------------------------------------------
CREATE POLICY brands_select ON brands
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY brands_insert ON brands
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('brand.manage'));

CREATE POLICY brands_update ON brands
    FOR UPDATE TO authenticated
    USING (has_permission('brand.manage'))
    WITH CHECK (has_permission('brand.manage'));

CREATE POLICY brands_delete ON brands
    FOR DELETE TO authenticated
    USING (has_permission('brand.manage'));

---------------------------------------------------------
-- MANUFACTURERS POLICIES
---------------------------------------------------------
CREATE POLICY manufacturers_select ON manufacturers
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY manufacturers_insert ON manufacturers
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('manufacturer.manage'));

CREATE POLICY manufacturers_update ON manufacturers
    FOR UPDATE TO authenticated
    USING (has_permission('manufacturer.manage'))
    WITH CHECK (has_permission('manufacturer.manage'));

CREATE POLICY manufacturers_delete ON manufacturers
    FOR DELETE TO authenticated
    USING (has_permission('manufacturer.manage'));

---------------------------------------------------------
-- MODELS POLICIES
---------------------------------------------------------
CREATE POLICY models_select ON models
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY models_insert ON models
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('model.manage'));

CREATE POLICY models_update ON models
    FOR UPDATE TO authenticated
    USING (has_permission('model.manage'))
    WITH CHECK (has_permission('model.manage'));

CREATE POLICY models_delete ON models
    FOR DELETE TO authenticated
    USING (has_permission('model.manage'));

---------------------------------------------------------
-- SUPPLIERS POLICIES
---------------------------------------------------------
CREATE POLICY suppliers_select ON suppliers
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY suppliers_insert ON suppliers
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('supplier.manage'));

CREATE POLICY suppliers_update ON suppliers
    FOR UPDATE TO authenticated
    USING (has_permission('supplier.manage'))
    WITH CHECK (has_permission('supplier.manage'));

CREATE POLICY suppliers_delete ON suppliers
    FOR DELETE TO authenticated
    USING (has_permission('supplier.manage'));

---------------------------------------------------------
-- ROLES POLICIES
---------------------------------------------------------
CREATE POLICY roles_select ON roles
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY roles_insert ON roles
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('role.manage'));

CREATE POLICY roles_update ON roles
    FOR UPDATE TO authenticated
    USING (has_permission('role.manage'))
    WITH CHECK (has_permission('role.manage'));

CREATE POLICY roles_delete ON roles
    FOR DELETE TO authenticated
    USING (has_permission('role.manage'));

---------------------------------------------------------
-- DEPARTMENTS POLICIES
---------------------------------------------------------
CREATE POLICY departments_select ON departments
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY departments_insert ON departments
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('department.manage'));

CREATE POLICY departments_update ON departments
    FOR UPDATE TO authenticated
    USING (has_permission('department.manage'))
    WITH CHECK (has_permission('department.manage'));

CREATE POLICY departments_delete ON departments
    FOR DELETE TO authenticated
    USING (has_permission('department.manage'));

---------------------------------------------------------
-- LOCATIONS POLICIES
---------------------------------------------------------
CREATE POLICY locations_select ON locations
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY locations_insert ON locations
    FOR INSERT TO authenticated
    WITH CHECK (has_permission('location.manage'));

CREATE POLICY locations_update ON locations
    FOR UPDATE TO authenticated
    USING (has_permission('location.manage'))
    WITH CHECK (has_permission('location.manage'));

CREATE POLICY locations_delete ON locations
    FOR DELETE TO authenticated
    USING (has_permission('location.manage'));

---------------------------------------------------------
-- PROFILES POLICIES (Simple - no recursion)
---------------------------------------------------------
CREATE POLICY profiles_select ON profiles
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY profiles_insert ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_update ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_delete ON profiles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = id);

---------------------------------------------------------
-- ACTIVITY LOGS POLICIES
---------------------------------------------------------
CREATE POLICY activity_logs_select ON activity_logs
    FOR SELECT TO authenticated
    USING (has_permission('user.view'));

CREATE POLICY activity_logs_insert ON activity_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

---------------------------------------------------------
-- PERMISSIONS / ROLE_PERMISSIONS (read-only reference)
---------------------------------------------------------
CREATE POLICY permissions_select ON permissions
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY role_permissions_select ON role_permissions
    FOR SELECT TO authenticated
    USING (true);

---------------------------------------------------------
-- STORAGE POLICIES
---------------------------------------------------------
-- Profiles bucket
CREATE POLICY "Profile images are viewable by authenticated users"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload profile images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'profiles'
        AND (auth.uid() = owner OR has_permission('user.manage'))
    );

CREATE POLICY "Users can update profile images"
    ON storage.objects FOR UPDATE TO authenticated
    USING (
        bucket_id = 'profiles'
        AND (auth.uid() = owner OR has_permission('user.manage'))
    )
    WITH CHECK (
        bucket_id = 'profiles'
        AND (auth.uid() = owner OR has_permission('user.manage'))
    );

CREATE POLICY "Users can delete profile images"
    ON storage.objects FOR DELETE TO authenticated
    USING (
        bucket_id = 'profiles'
        AND (auth.uid() = owner OR has_permission('user.manage'))
    );

-- Assets bucket
CREATE POLICY "Authenticated users can view asset files"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'assets' AND has_permission('asset.view'));

CREATE POLICY "Users can upload asset files"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'assets' AND has_permission('asset.create'));

CREATE POLICY "Users can update asset files"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'assets' AND has_permission('asset.update'))
    WITH CHECK (bucket_id = 'assets' AND has_permission('asset.update'));

CREATE POLICY "Users can delete asset files"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'assets' AND has_permission('asset.delete'));

-- Categories bucket
CREATE POLICY "Authenticated users can view category images"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'categories');

CREATE POLICY "Manage category images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'categories' AND has_permission('category.manage'));

CREATE POLICY "Update category images"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'categories' AND has_permission('category.manage'))
    WITH CHECK (bucket_id = 'categories' AND has_permission('category.manage'));

CREATE POLICY "Delete category images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'categories' AND has_permission('category.manage'));

-- Manufacturers bucket
CREATE POLICY "Authenticated users can view manufacturer images"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'manufacturers');

CREATE POLICY "Manage manufacturer images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'manufacturers' AND has_permission('category.manage'));

CREATE POLICY "Update manufacturer images"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'manufacturers' AND has_permission('category.manage'))
    WITH CHECK (bucket_id = 'manufacturers' AND has_permission('category.manage'));

CREATE POLICY "Delete manufacturer images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'manufacturers' AND has_permission('category.manage'));

-- Maintenance bucket
CREATE POLICY "Authenticated users can view maintenance files"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'maintenance' AND has_permission('maintenance.view'));

CREATE POLICY "Upload maintenance files"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'maintenance' AND has_permission('maintenance.create'));

CREATE POLICY "Update maintenance files"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'maintenance' AND has_permission('maintenance.update'))
    WITH CHECK (bucket_id = 'maintenance' AND has_permission('maintenance.update'));

CREATE POLICY "Delete maintenance files"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'maintenance' AND has_permission('maintenance.delete'));

---------------------------------------------------------
-- GRANT PERMISSIONS
---------------------------------------------------------
-- Profiles
GRANT SELECT ON profiles TO anon;
GRANT SELECT ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;

-- Roles
GRANT SELECT ON roles TO anon;
GRANT SELECT ON roles TO authenticated;

-- Permissions
GRANT SELECT ON permissions TO anon;
GRANT SELECT ON permissions TO authenticated;

-- Role Permissions
GRANT SELECT ON role_permissions TO anon;
GRANT SELECT ON role_permissions TO authenticated;

-- Master Tables
GRANT SELECT ON asset_statuses TO anon;
GRANT SELECT ON asset_statuses TO authenticated;
GRANT SELECT ON asset_conditions TO anon;
GRANT SELECT ON asset_conditions TO authenticated;
GRANT SELECT ON maintenance_types TO anon;
GRANT SELECT ON maintenance_types TO authenticated;
GRANT SELECT ON asset_transaction_types TO anon;
GRANT SELECT ON asset_transaction_types TO authenticated;
GRANT SELECT ON categories TO anon;
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON manufacturers TO anon;
GRANT SELECT ON manufacturers TO authenticated;
GRANT SELECT ON brands TO anon;
GRANT SELECT ON brands TO authenticated;
GRANT SELECT ON models TO anon;
GRANT SELECT ON models TO authenticated;
GRANT SELECT ON departments TO anon;
GRANT SELECT ON departments TO authenticated;
GRANT SELECT ON locations TO anon;
GRANT SELECT ON locations TO authenticated;
GRANT SELECT ON suppliers TO anon;
GRANT SELECT ON suppliers TO authenticated;
GRANT SELECT ON activity_types TO anon;
GRANT SELECT ON activity_types TO authenticated;
GRANT SELECT ON system_settings TO anon;
GRANT SELECT ON system_settings TO authenticated;

-- CRUD permissions for authenticated users on CMS tables
GRANT INSERT, UPDATE, DELETE ON categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON brands TO authenticated;
GRANT INSERT, UPDATE, DELETE ON manufacturers TO authenticated;
GRANT INSERT, UPDATE, DELETE ON models TO authenticated;
GRANT INSERT, UPDATE, DELETE ON suppliers TO authenticated;
GRANT INSERT, UPDATE, DELETE ON roles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON departments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON locations TO authenticated;
GRANT INSERT, UPDATE, DELETE ON assets TO authenticated;
GRANT INSERT, UPDATE, DELETE ON maintenance_logs TO authenticated;
GRANT INSERT, UPDATE, DELETE ON asset_transactions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON media TO authenticated;
GRANT INSERT, UPDATE, DELETE ON permissions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON role_permissions TO authenticated;

-- Activity logs (insert only)
GRANT INSERT ON activity_logs TO authenticated;

-- Sequences
GRANT USAGE ON SEQUENCE employee_code_seq TO authenticated;
GRANT USAGE ON SEQUENCE asset_code_seq TO authenticated;
GRANT USAGE ON SEQUENCE supplier_code_seq TO authenticated;
GRANT USAGE ON SEQUENCE maintenance_no_seq TO authenticated;

---------------------------------------------------------
-- NO OTHER POLICIES
---------------------------------------------------------
-- PostgreSQL denies access by default for any operation
-- without a matching policy.