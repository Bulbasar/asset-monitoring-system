-- =====================================================
-- Asset Monitoring System
-- Triggers
-- =====================================================

---------------------------------------------------------
-- Enable extension
---------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS moddatetime;

---------------------------------------------------------
-- Update updated_at Trigger Function
---------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

---------------------------------------------------------
-- Profiles Display Name Trigger
---------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_generate_display_name()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    NEW.display_name :=
        concat_ws(
            ' ',
            NEW.first_name,
            NEW.middle_name,
            NEW.last_name,
            NEW.suffix
        );

    RETURN NEW;

END;
$$;

---------------------------------------------------------
-- Asset Current Value Trigger
---------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_initialize_asset_value()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.current_value IS NULL THEN
        NEW.current_value := NEW.purchase_cost;
    END IF;

    RETURN NEW;

END;
$$;

---------------------------------------------------------
-- Asset QR Code Trigger
---------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_generate_qrcode()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.qr_code IS NULL THEN
        NEW.qr_code := NEW.asset_code;
    END IF;

    RETURN NEW;

END;
$$;

---------------------------------------------------------
-- Asset Barcode Trigger
---------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_generate_barcode()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.barcode IS NULL THEN
        NEW.barcode := NEW.asset_code;
    END IF;

    RETURN NEW;

END;
$$;

---------------------------------------------------------
-- Maintenance Number Trigger
---------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_generate_maintenance_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.maintenance_no IS NULL THEN

        NEW.maintenance_no :=
            generate_maintenance_number();

    END IF;

    RETURN NEW;

END;
$$;

---------------------------------------------------------
-- Activity Log Trigger Function
---------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_activity_log()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_activity_type UUID;
BEGIN

    SELECT id
    INTO v_activity_type
    FROM activity_types
    WHERE lower(code) = lower(TG_OP)
    LIMIT 1;

    INSERT INTO activity_logs (
        profile_id,
        module,
        activity_type_id,
        table_name,
        record_id,
        description,
        created_at
    )
    VALUES (
        NULL,
        COALESCE(TG_TABLE_NAME, 'system'),
        v_activity_type,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP || ' on ' || TG_TABLE_NAME,
        now()
    );

    RETURN COALESCE(NEW, OLD);

EXCEPTION
    WHEN others THEN
        -- NEVER block main transaction because of logging
        RETURN COALESCE(NEW, OLD);
END;
$$;

---------------------------------------------------------
-- updated_at Triggers
---------------------------------------------------------

CREATE TRIGGER trg_asset_statuses_updated_at
BEFORE UPDATE ON asset_statuses
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_asset_conditions_updated_at
BEFORE UPDATE ON asset_conditions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_maintenance_types_updated_at
BEFORE UPDATE ON maintenance_types
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_asset_transaction_types_updated_at
BEFORE UPDATE ON asset_transaction_types
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_manufacturers_updated_at
BEFORE UPDATE ON manufacturers
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_brands_updated_at
BEFORE UPDATE ON brands
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_models_updated_at
BEFORE UPDATE ON models
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_departments_updated_at
BEFORE UPDATE ON departments
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_locations_updated_at
BEFORE UPDATE ON locations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_activity_types_updated_at
BEFORE UPDATE ON activity_types
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER trg_assets_updated_at
BEFORE UPDATE ON assets
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

---------------------------------------------------------
-- Display Name Trigger
---------------------------------------------------------

CREATE TRIGGER trg_profiles_display_name
BEFORE INSERT OR UPDATE
ON profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_generate_display_name();

---------------------------------------------------------
-- Asset Value Trigger
---------------------------------------------------------

CREATE TRIGGER trg_assets_current_value
BEFORE INSERT
ON assets
FOR EACH ROW
EXECUTE FUNCTION trigger_initialize_asset_value();

---------------------------------------------------------
-- QR Code Trigger
---------------------------------------------------------

CREATE TRIGGER trg_assets_qrcode
BEFORE INSERT
ON assets
FOR EACH ROW
EXECUTE FUNCTION trigger_generate_qrcode();

---------------------------------------------------------
-- Barcode Trigger
---------------------------------------------------------

CREATE TRIGGER trg_assets_barcode
BEFORE INSERT
ON assets
FOR EACH ROW
EXECUTE FUNCTION trigger_generate_barcode();

---------------------------------------------------------
-- Maintenance Number Trigger
---------------------------------------------------------

CREATE TRIGGER trg_maintenance_number
BEFORE INSERT
ON maintenance_logs
FOR EACH ROW
EXECUTE FUNCTION trigger_generate_maintenance_number();

---------------------------------------------------------
-- Activity Log Triggers
---------------------------------------------------------

CREATE TRIGGER trg_activity_assets
AFTER INSERT OR UPDATE OR DELETE
ON assets
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_profiles
AFTER INSERT OR UPDATE OR DELETE
ON profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_transactions
AFTER INSERT OR UPDATE OR DELETE
ON asset_transactions
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_maintenance
AFTER INSERT OR UPDATE OR DELETE
ON maintenance_logs
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_categories
AFTER INSERT OR UPDATE OR DELETE
ON categories
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_suppliers
AFTER INSERT OR UPDATE OR DELETE
ON suppliers
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_locations
AFTER INSERT OR UPDATE OR DELETE
ON locations
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_departments
AFTER INSERT OR UPDATE OR DELETE
ON departments
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_roles
AFTER INSERT OR UPDATE OR DELETE
ON roles
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_brands
AFTER INSERT OR UPDATE OR DELETE
ON brands
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_models
AFTER INSERT OR UPDATE OR DELETE
ON models
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();

CREATE TRIGGER trg_activity_manufacturers
AFTER INSERT OR UPDATE OR DELETE
ON manufacturers
FOR EACH ROW
EXECUTE FUNCTION trigger_activity_log();