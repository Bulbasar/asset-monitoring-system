-- =====================================================
-- Asset Monitoring System
-- User Role Utilities
-- =====================================================

---------------------------------------------------------
-- VIEW: Current User Profile with Role
---------------------------------------------------------
CREATE OR REPLACE VIEW user_profiles AS
SELECT
    p.id,
    p.employee_code,
    p.display_name,
    p.email,
    p.role_id,
    r.name AS role_name,
    r.code AS role_code,
    p.department_id,
    p.location_id,
    p.is_active,
    p.created_at
FROM profiles p
LEFT JOIN roles r ON r.id = p.role_id;

---------------------------------------------------------
-- FUNCTION: Get current user's role
---------------------------------------------------------
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT r.name
    FROM profiles p
    JOIN roles r
        ON r.id = p.role_id
    WHERE
        p.id = auth.uid()
        AND p.is_active = TRUE;
$$;

---------------------------------------------------------
-- FUNCTION: Check if user has permission
---------------------------------------------------------
CREATE OR REPLACE FUNCTION has_permission(p_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM profiles p
        JOIN role_permissions rp ON rp.role_id = p.role_id
        JOIN permissions perm ON perm.id = rp.permission_id
        WHERE auth.uid() IS NOT NULL
          AND p.id = auth.uid()
          AND perm.code = p_code
    );
$$;

---------------------------------------------------------
-- INDEXES (SAFETY / PERFORMANCE)
---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id
ON role_permissions(role_id);

CREATE INDEX IF NOT EXISTS idx_permissions_code
ON permissions(code);