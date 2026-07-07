DO $$
DECLARE
    v_admin_auth_id UUID := 'bbf4163c-eb43-40b5-8bd1-2c7fb39e1197'; -- Replace with your actual UUID
    v_admin_role_id UUID;
    v_dept_id UUID;
    v_loc_id UUID;
BEGIN
    -- Get admin role
    SELECT id INTO v_admin_role_id FROM roles WHERE code = 'admin';
    
    -- Get admin department
    SELECT id INTO v_dept_id FROM departments WHERE code = 'admin';
    
    -- Get admin location
    SELECT id INTO v_loc_id FROM locations WHERE code = 'admin';
    
    -- Create admin profile
    INSERT INTO profiles (
        id,
        role_id,
        department_id,
        location_id,
        first_name,
        last_name,
        email,
        is_active
    )
    VALUES (
        v_admin_auth_id,
        v_admin_role_id,
        v_dept_id,
        v_loc_id,
        'System',
        'Administrator',
        'admin@example.com',
        TRUE
    )
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE '✅ Admin profile created successfully!';
END $$;

-- Verify
SELECT p.*, r.name as role_name 
FROM profiles p
JOIN roles r ON r.id = p.role_id
WHERE p.email = 'admin@example.com';