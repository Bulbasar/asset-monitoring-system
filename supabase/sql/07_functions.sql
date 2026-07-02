-- =====================================================
-- Asset Monitoring System
-- Database Functions
-- =====================================================

---------------------------------------------------------
-- Update updated_at Timestamp
---------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


---------------------------------------------------------
-- Generate Display Name
---------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_display_name()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    NEW.display_name :=
        CONCAT_WS(
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
-- Generate Employee Code
---------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS employee_code_seq
START 1;

CREATE OR REPLACE FUNCTION generate_employee_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.employee_code IS NULL
        OR NEW.employee_code = '' THEN

        NEW.employee_code :=
            'EMP-' ||
            LPAD(
                nextval('employee_code_seq')::TEXT,
                6,
                '0'
            );

    END IF;

    RETURN NEW;

END;
$$;


---------------------------------------------------------
-- Generate Asset Code
---------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS asset_code_seq
START 1;

CREATE OR REPLACE FUNCTION generate_asset_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.asset_code IS NULL
        OR NEW.asset_code = '' THEN

        NEW.asset_code :=
            'AST-' ||
            LPAD(
                nextval('asset_code_seq')::TEXT,
                6,
                '0'
            );

    END IF;

    RETURN NEW;

END;
$$;


---------------------------------------------------------
-- Generate Supplier Code
---------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS supplier_code_seq
START 1;

CREATE OR REPLACE FUNCTION generate_supplier_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.supplier_code IS NULL
        OR NEW.supplier_code = '' THEN

        NEW.supplier_code :=
            'SUP-' ||
            LPAD(
                nextval('supplier_code_seq')::TEXT,
                6,
                '0'
            );

    END IF;

    RETURN NEW;

END;
$$;


---------------------------------------------------------
-- Generate Maintenance Number
---------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS maintenance_no_seq
START 1;

CREATE OR REPLACE FUNCTION generate_maintenance_no()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.maintenance_no IS NULL
        OR NEW.maintenance_no = '' THEN

        NEW.maintenance_no :=
            'MNT-' ||
            LPAD(
                nextval('maintenance_no_seq')::TEXT,
                6,
                '0'
            );

    END IF;

    RETURN NEW;

END;
$$;


---------------------------------------------------------
-- Log Activity
---------------------------------------------------------
CREATE OR REPLACE FUNCTION log_activity(

    p_profile_id UUID,
    p_activity_type_id UUID,

    p_table_name TEXT,
    p_record_id UUID,

    p_description TEXT,

    p_old_data JSONB DEFAULT NULL,
    p_new_data JSONB DEFAULT NULL

)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO activity_logs (

        profile_id,
        activity_type_id,

        table_name,
        record_id,

        description,

        old_data,
        new_data,

        created_at

    )

    VALUES (

        p_profile_id,
        p_activity_type_id,

        p_table_name,
        p_record_id,

        p_description,

        p_old_data,
        p_new_data,

        NOW()

    );

END;
$$;