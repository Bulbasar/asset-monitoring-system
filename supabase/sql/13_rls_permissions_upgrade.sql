-- =====================================================
-- Asset Monitoring System
-- Row Level Security (PERMISSION-BASED UPGRADE)
-- =====================================================

---------------------------------------------------------
-- MEDIA
---------------------------------------------------------
DROP POLICY IF EXISTS authenticated_read_media ON media;

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
DROP POLICY IF EXISTS authenticated_read_assets ON assets;

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
TO authenticated
FOR DELETE
USING (has_permission('asset.delete'));

---------------------------------------------------------
-- MAINTENANCE LOGS
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
-- CATEGORIES
---------------------------------------------------------
CREATE POLICY categories_select
ON categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY categories_manage
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
TO authenticated
FOR DELETE
USING (has_permission('category.manage'));

---------------------------------------------------------
-- LOOKUP TABLES (READ-ONLY SAFE)
---------------------------------------------------------
CREATE POLICY read_master_tables
ON asset_statuses
FOR SELECT TO authenticated
USING (true);

CREATE POLICY read_conditions
ON asset_conditions
FOR SELECT TO authenticated
USING (true);

CREATE POLICY read_transaction_types
ON asset_transaction_types
FOR SELECT TO authenticated
USING (true);

CREATE POLICY read_roles
ON roles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY read_departments
ON departments
FOR SELECT TO authenticated
USING (true);

CREATE POLICY read_locations
ON locations
FOR SELECT TO authenticated
USING (true);

CREATE POLICY read_suppliers
ON suppliers
FOR SELECT TO authenticated
USING (true);

CREATE POLICY read_models
ON models
FOR SELECT TO authenticated
USING (true);

CREATE POLICY read_brands
ON brands
FOR SELECT TO authenticated
USING (true);

CREATE POLICY read_manufacturers
ON manufacturers
FOR SELECT TO authenticated
USING (true);

---------------------------------------------------------
-- PROFILES (SELF + ADMIN CONTROL)
---------------------------------------------------------
CREATE POLICY profiles_select
ON profiles
FOR SELECT
TO authenticated
USING (
    auth.uid() = id
    OR has_permission('user.view')
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

---------------------------------------------------------
-- ACTIVITY LOGS (READ ONLY FOR ADMINS)
---------------------------------------------------------
CREATE POLICY activity_logs_select
ON activity_logs
FOR SELECT
TO authenticated
USING (has_permission('user.view'));

---------------------------------------------------------
-- SAFETY: DENY EVERYTHING ELSE BY DEFAULT
---------------------------------------------------------
-- (Supabase default is deny, so no need to explicitly set)