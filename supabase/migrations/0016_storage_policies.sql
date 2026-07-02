-- =====================================================
-- Asset Monitoring System
-- Supabase Storage Policies
-- =====================================================
-- Buckets are created in 0014_storage_buckets.sql:
-- profiles, assets, categories, manufacturers, maintenance
-- (all private)
-- =====================================================

---------------------------------------------------------
-- PROFILES BUCKET
---------------------------------------------------------

CREATE POLICY "Profile images are viewable by authenticated users"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'profiles'
);

CREATE POLICY "Users can upload profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'profiles'
    AND (
        auth.uid() = owner
        OR has_permission('user.manage')
    )
);

CREATE POLICY "Users can update profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'profiles'
    AND (
        auth.uid() = owner
        OR has_permission('user.manage')
    )
)
WITH CHECK (
    bucket_id = 'profiles'
    AND (
        auth.uid() = owner
        OR has_permission('user.manage')
    )
);

CREATE POLICY "Users can delete profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'profiles'
    AND (
        auth.uid() = owner
        OR has_permission('user.manage')
    )
);

---------------------------------------------------------
-- ASSETS BUCKET
---------------------------------------------------------

CREATE POLICY "Authenticated users can view asset files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'assets'
    AND has_permission('asset.view')
);

CREATE POLICY "Users can upload asset files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'assets'
    AND has_permission('asset.create')
);

CREATE POLICY "Users can update asset files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'assets'
    AND has_permission('asset.update')
)
WITH CHECK (
    bucket_id = 'assets'
    AND has_permission('asset.update')
);

CREATE POLICY "Users can delete asset files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'assets'
    AND has_permission('asset.delete')
);

---------------------------------------------------------
-- CATEGORIES BUCKET
---------------------------------------------------------

CREATE POLICY "Authenticated users can view category images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'categories'
);

CREATE POLICY "Manage category images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'categories'
    AND has_permission('category.manage')
);

CREATE POLICY "Update category images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'categories'
    AND has_permission('category.manage')
)
WITH CHECK (
    bucket_id = 'categories'
    AND has_permission('category.manage')
);

CREATE POLICY "Delete category images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'categories'
    AND has_permission('category.manage')
);

---------------------------------------------------------
-- MANUFACTURERS BUCKET
---------------------------------------------------------

CREATE POLICY "Authenticated users can view manufacturer images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'manufacturers'
);

CREATE POLICY "Manage manufacturer images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'manufacturers'
    AND has_permission('category.manage')
);

CREATE POLICY "Update manufacturer images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'manufacturers'
    AND has_permission('category.manage')
)
WITH CHECK (
    bucket_id = 'manufacturers'
    AND has_permission('category.manage')
);

CREATE POLICY "Delete manufacturer images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'manufacturers'
    AND has_permission('category.manage')
);

---------------------------------------------------------
-- MAINTENANCE BUCKET
---------------------------------------------------------

CREATE POLICY "Authenticated users can view maintenance files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'maintenance'
    AND has_permission('maintenance.view')
);

CREATE POLICY "Upload maintenance files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'maintenance'
    AND has_permission('maintenance.create')
);

CREATE POLICY "Update maintenance files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'maintenance'
    AND has_permission('maintenance.update')
)
WITH CHECK (
    bucket_id = 'maintenance'
    AND has_permission('maintenance.update')
);

CREATE POLICY "Delete maintenance files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'maintenance'
    AND has_permission('maintenance.delete')
);