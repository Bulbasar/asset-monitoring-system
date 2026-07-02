-- =====================================================
-- Asset Monitoring System
-- File Management Tables
-- =====================================================

---------------------------------------------------------
-- Files
---------------------------------------------------------
CREATE TABLE media (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    bucket_name TEXT NOT NULL,

    file_name TEXT NOT NULL,

    original_file_name TEXT NOT NULL,

    file_extension TEXT NOT NULL,

    file_path TEXT NOT NULL UNIQUE,

    mime_type TEXT NOT NULL,

    file_size BIGINT NOT NULL
        CHECK (file_size >= 0),

    storage_provider TEXT DEFAULT 'supabase',

    uploaded_by UUID,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE,

    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_media_uploaded_by
        FOREIGN KEY (uploaded_by)
        REFERENCES auth.users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);