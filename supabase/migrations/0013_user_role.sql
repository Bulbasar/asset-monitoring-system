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
-- FUNCTION: Check if user has permission (FIXED)
---------------------------------------------------------
CREATE OR REPLACE FUNCTION has_permission(p_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_role_code TEXT;
    v_has_perm BOOLEAN;
BEGIN
    -- Get the current user ID
    v_user_id := auth.uid();
    
    -- If no user is logged in, return false
    IF v_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Get the user's role
    SELECT r.code INTO v_role_code
    FROM profiles p
    INNER JOIN roles r ON r.id = p.role_id
    WHERE p.id = v_user_id
      AND p.is_active = TRUE;
    
    -- If user has admin role, return true for any permission
    IF v_role_code = 'admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Check if the user has the specific permission
    SELECT EXISTS (
        SELECT 1
        FROM profiles p
        INNER JOIN role_permissions rp ON rp.role_id = p.role_id
        INNER JOIN permissions perm ON perm.id = rp.permission_id
        WHERE p.id = v_user_id
          AND p.is_active = TRUE
          AND perm.code = p_code
    ) INTO v_has_perm;
    
    -- Return false if null, otherwise return the result
    RETURN COALESCE(v_has_perm, FALSE);
END;
$$;

-- Grant execute permission to all roles
GRANT EXECUTE ON FUNCTION has_permission(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION has_permission(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION has_permission(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION has_permission(TEXT) TO postgres;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO service_role;

-- Make sure the function is accessible to the API
ALTER FUNCTION has_permission(TEXT) OWNER TO postgres;

---------------------------------------------------------
-- INDEXES (SAFETY / PERFORMANCE)
---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id
ON role_permissions(role_id);

CREATE INDEX IF NOT EXISTS idx_permissions_code
ON permissions(code);