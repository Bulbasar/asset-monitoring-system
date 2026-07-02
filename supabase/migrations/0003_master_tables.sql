-- =====================================================
-- Asset Monitoring System
-- Master Tables
-- =====================================================

---------------------------------------------------------
-- Asset Statuses
---------------------------------------------------------
CREATE TABLE asset_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    color_code TEXT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------------------------------------------------------
-- Asset Conditions
---------------------------------------------------------
CREATE TABLE asset_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    color_code TEXT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------------------------------------------------------
-- Maintenance Types
---------------------------------------------------------
CREATE TABLE maintenance_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    color_code TEXT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------------------------------------------------------
-- Asset Transaction Types
---------------------------------------------------------
CREATE TABLE asset_transaction_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    color_code TEXT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------------------------------------------------------
-- Categories
---------------------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    image_file_id UUID,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_category_image
        FOREIGN KEY (image_file_id)
        REFERENCES media(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

---------------------------------------------------------
-- Manufacturers
---------------------------------------------------------
CREATE TABLE manufacturers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    website_url TEXT,
    country_of_origin TEXT,

    image_file_id UUID,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_manufacturer_image
        FOREIGN KEY (image_file_id)
        REFERENCES media(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

---------------------------------------------------------
-- Brands
---------------------------------------------------------
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    manufacturer_id UUID NOT NULL,

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,

    image_file_id UUID,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_brands_manufacturer
        FOREIGN KEY (manufacturer_id)
        REFERENCES manufacturers(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_brand_image
        FOREIGN KEY (image_file_id)
        REFERENCES media(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT uq_brands_manufacturer_name
        UNIQUE (manufacturer_id, name)
);

---------------------------------------------------------
-- Models
---------------------------------------------------------
CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    brand_id UUID NOT NULL,

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    model_number TEXT,
    description TEXT,

    image_file_id UUID,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_models_brand
        FOREIGN KEY (brand_id)
        REFERENCES brands(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_model_image
        FOREIGN KEY (image_file_id)
        REFERENCES media(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT uq_models_brand_name
        UNIQUE (brand_id, name)
);

---------------------------------------------------------
-- Roles
---------------------------------------------------------
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------------------------------------------------------
-- Departments
---------------------------------------------------------
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------------------------------------------------------
-- Locations
---------------------------------------------------------
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    building TEXT,
    floor TEXT,
    room TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------------------------------------------------------
-- Suppliers
---------------------------------------------------------
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    supplier_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    contact_person TEXT,

    email TEXT,
    phone TEXT,
    website_url TEXT,
    address TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------------------------------------------------------
-- Activity Types
---------------------------------------------------------
CREATE TABLE activity_types (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,

    color_code TEXT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

---------------------------------------------------------
-- System Settings
---------------------------------------------------------
CREATE TABLE system_settings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,

    media_id UUID,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_system_settings_media
        FOREIGN KEY (media_id)
        REFERENCES media(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);