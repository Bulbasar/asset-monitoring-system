-- =====================================================
-- Asset Monitoring System
-- Permissions
-- =====================================================

---------------------------------------------------------
-- Permissions
---------------------------------------------------------
CREATE TABLE permissions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,

    name TEXT NOT NULL UNIQUE,

    module TEXT NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------------------------------------------------------
-- Role Permissions
---------------------------------------------------------
CREATE TABLE role_permissions (

    role_id UUID NOT NULL,

    permission_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (role_id, permission_id),

    CONSTRAINT fk_role_permission_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_role_permission_permission
        FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);