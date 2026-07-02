-- =====================================================
-- Asset Monitoring System
-- Supabase Storage Buckets
-- =====================================================

---------------------------------------------------------
-- PROFILES
---------------------------------------------------------

INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES (
    'profiles',
    'profiles',
    FALSE,
    5242880,
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp'
    ]
)
ON CONFLICT (id) DO NOTHING;

---------------------------------------------------------
-- ASSETS
---------------------------------------------------------

INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES (
    'assets',
    'assets',
    FALSE,
    10485760,
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf'
    ]
)
ON CONFLICT (id) DO NOTHING;

---------------------------------------------------------
-- CATEGORIES
---------------------------------------------------------

INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES (
    'categories',
    'categories',
    FALSE,
    5242880,
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp'
    ]
)
ON CONFLICT (id) DO NOTHING;

---------------------------------------------------------
-- MANUFACTURERS
---------------------------------------------------------

INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES (
    'manufacturers',
    'manufacturers',
    FALSE,
    5242880,
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp'
    ]
)
ON CONFLICT (id) DO NOTHING;

---------------------------------------------------------
-- MAINTENANCE
---------------------------------------------------------

INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES (
    'maintenance',
    'maintenance',
    FALSE,
    10485760,
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf'
    ]
)
ON CONFLICT (id) DO NOTHING;