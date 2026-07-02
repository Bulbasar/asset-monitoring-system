-- =====================================================
-- Asset Monitoring System
-- Row Level Security (PERMISSION-BASED UPGRADE)
-- =====================================================

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
-- MEDIA
---------------------------------------------------------

CREATE POLICY media_select
ON media
FOR SELECT
TO authenticated
USING (has_permission('media.manage'));

CREATE POLICY media_insert
ON media
FOR INSERT
TO authenticated
WITH CHECK (has_permission('media.manage'));

CREATE POLICY media_update
ON media
FOR UPDATE
TO authenticated
USING (has_permission('media.manage'))
WITH CHECK (has_permission('media.manage'));

CREATE POLICY media_delete
ON media
FOR DELETE
TO authenticated
USING (has_permission('media.manage'));

---------------------------------------------------------
-- ASSETS
---------------------------------------------------------

CREATE POLICY assets_select
ON assets
FOR SELECT
TO authenticated
USING (has_permission('asset.view'));

CREATE POLICY assets_insert
ON assets
FOR INSERT
TO authenticated
WITH CHECK (has_permission('asset.create'));

CREATE POLICY assets_update
ON assets
FOR UPDATE
TO authenticated
USING (has_permission('asset.update'))
WITH CHECK (has_permission('asset.update'));

CREATE POLICY assets_delete
ON assets
FOR DELETE
TO authenticated
USING (has_permission('asset.delete'));

---------------------------------------------------------
-- MAINTENANCE
---------------------------------------------------------

CREATE POLICY maintenance_select
ON maintenance_logs
FOR SELECT
TO authenticated
USING (has_permission('maintenance.view'));

CREATE POLICY maintenance_insert
ON maintenance_logs
FOR INSERT
TO authenticated
WITH CHECK (has_permission('maintenance.create'));

CREATE POLICY maintenance_update
ON maintenance_logs
FOR UPDATE
TO authenticated
USING (has_permission('maintenance.update'))
WITH CHECK (has_permission('maintenance.update'));

CREATE POLICY maintenance_delete
ON maintenance_logs
FOR DELETE
TO authenticated
USING (has_permission('maintenance.delete'));

---------------------------------------------------------
-- ASSET TRANSACTIONS
---------------------------------------------------------

CREATE POLICY transactions_select
ON asset_transactions
FOR SELECT
TO authenticated
USING (has_permission('asset.view'));

CREATE POLICY transactions_insert
ON asset_transactions
FOR INSERT
TO authenticated
WITH CHECK (has_permission('asset.update'));

CREATE POLICY transactions_update
ON asset_transactions
FOR UPDATE
TO authenticated
USING (has_permission('asset.update'))
WITH CHECK (has_permission('asset.update'));

CREATE POLICY transactions_delete
ON asset_transactions
FOR DELETE
TO authenticated
USING (has_permission('asset.delete'));

---------------------------------------------------------
-- CATEGORIES
---------------------------------------------------------

CREATE POLICY categories_select
ON categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY categories_insert
ON categories
FOR INSERT
TO authenticated
WITH CHECK (has_permission('category.manage'));

CREATE POLICY categories_update
ON categories
FOR UPDATE
TO authenticated
USING (has_permission('category.manage'))
WITH CHECK (has_permission('category.manage'));

CREATE POLICY categories_delete
ON categories
FOR DELETE
TO authenticated
USING (has_permission('category.manage'));

---------------------------------------------------------
-- MASTER TABLES
---------------------------------------------------------

CREATE POLICY asset_statuses_select
ON asset_statuses
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY asset_conditions_select
ON asset_conditions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY maintenance_types_select
ON maintenance_types
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY asset_transaction_types_select
ON asset_transaction_types
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY manufacturers_select
ON manufacturers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY brands_select
ON brands
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY models_select
ON models
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY roles_select
ON roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY departments_select
ON departments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY locations_select
ON locations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY suppliers_select
ON suppliers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY activity_types_select
ON activity_types
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY system_settings_select
ON system_settings
FOR SELECT
TO authenticated
USING (true);

---------------------------------------------------------
-- PROFILES
---------------------------------------------------------

CREATE POLICY profiles_select
ON profiles
FOR SELECT
TO authenticated
USING (
    auth.uid() = id
    OR has_permission('user.view')
);

CREATE POLICY profiles_insert
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = id
    OR has_permission('user.manage')
);

CREATE POLICY profiles_update
ON profiles
FOR UPDATE
TO authenticated
USING (
    auth.uid() = id
    OR has_permission('user.manage')
)
WITH CHECK (
    auth.uid() = id
    OR has_permission('user.manage')
);

CREATE POLICY profiles_delete
ON profiles
FOR DELETE
TO authenticated
USING (
    has_permission('user.manage')
);

---------------------------------------------------------
-- ACTIVITY LOGS
---------------------------------------------------------

CREATE POLICY activity_logs_select
ON activity_logs
FOR SELECT
TO authenticated
USING (has_permission('user.view'));

CREATE POLICY activity_logs_insert
ON activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

---------------------------------------------------------
-- NO OTHER POLICIES
---------------------------------------------------------
-- PostgreSQL denies access by default.