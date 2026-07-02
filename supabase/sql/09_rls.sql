-- =====================================================
-- Asset Monitoring System
-- Row Level Security (RLS)
-- =====================================================

---------------------------------------------------------
-- Enable RLS
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


---------------------------------------------------------
-- Authenticated Users Can Read
---------------------------------------------------------

CREATE POLICY authenticated_read_media
ON media
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_asset_statuses
ON asset_statuses
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_asset_conditions
ON asset_conditions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_maintenance_types
ON maintenance_types
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_asset_transaction_types
ON asset_transaction_types
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_categories
ON categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_manufacturers
ON manufacturers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_brands
ON brands
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_models
ON models
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_roles
ON roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_departments
ON departments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_locations
ON locations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_suppliers
ON suppliers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_activity_types
ON activity_types
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_system_settings
ON system_settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_profiles
ON profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_assets
ON assets
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_asset_transactions
ON asset_transactions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_maintenance_logs
ON maintenance_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY authenticated_read_activity_logs
ON activity_logs
FOR SELECT
TO authenticated
USING (true);


---------------------------------------------------------
-- Authenticated Users Can Insert
---------------------------------------------------------

CREATE POLICY authenticated_insert_all
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY authenticated_insert_assets
ON assets
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY authenticated_insert_transactions
ON asset_transactions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY authenticated_insert_maintenance
ON maintenance_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY authenticated_insert_activity_logs
ON activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

---------------------------------------------------------
-- Authenticated Users Can Update
---------------------------------------------------------

CREATE POLICY authenticated_update_profiles
ON profiles
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY authenticated_update_assets
ON assets
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY authenticated_update_asset_transactions
ON asset_transactions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY authenticated_update_maintenance_logs
ON maintenance_logs
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY authenticated_update_activity_logs
ON activity_logs
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

---------------------------------------------------------
-- Authenticated Users Can Delete
---------------------------------------------------------

CREATE POLICY authenticated_delete_profiles
ON profiles
FOR DELETE
TO authenticated
USING (true);

CREATE POLICY authenticated_delete_assets
ON assets
FOR DELETE
TO authenticated
USING (true);

CREATE POLICY authenticated_delete_asset_transactions
ON asset_transactions
FOR DELETE
TO authenticated
USING (true);

CREATE POLICY authenticated_delete_maintenance_logs
ON maintenance_logs
FOR DELETE
TO authenticated
USING (true);

CREATE POLICY authenticated_delete_activity_logs
ON activity_logs
FOR DELETE
TO authenticated
USING (true);