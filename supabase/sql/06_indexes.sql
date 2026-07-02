-- =====================================================
-- Asset Monitoring System
-- Database Indexes
-- =====================================================

---------------------------------------------------------
-- Brands
---------------------------------------------------------
CREATE INDEX idx_brands_manufacturer
ON brands(manufacturer_id);

---------------------------------------------------------
-- Models
---------------------------------------------------------
CREATE INDEX idx_models_brand
ON models(brand_id);

---------------------------------------------------------
-- Profiles
---------------------------------------------------------
CREATE INDEX idx_profiles_role
ON profiles(role_id);

CREATE INDEX idx_profiles_department
ON profiles(department_id);

CREATE INDEX idx_profiles_location
ON profiles(location_id);

---------------------------------------------------------
-- Assets
---------------------------------------------------------
CREATE INDEX idx_assets_category
ON assets(category_id);

CREATE INDEX idx_assets_model
ON assets(model_id);

CREATE INDEX idx_assets_supplier
ON assets(supplier_id);

CREATE INDEX idx_assets_location
ON assets(location_id);

CREATE INDEX idx_assets_status
ON assets(status_id);

CREATE INDEX idx_assets_condition
ON assets(condition_id);

CREATE INDEX idx_assets_asset_code
ON assets(asset_code);

CREATE INDEX idx_assets_asset_tag
ON assets(asset_tag);

CREATE INDEX idx_assets_serial_number
ON assets(serial_number);