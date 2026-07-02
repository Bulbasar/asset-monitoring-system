-- =====================================================
-- Asset Monitoring System
-- Database Functions
-- =====================================================
-- NOTE: The old generic update_updated_at() and
-- generate_display_name() functions were removed here.
-- Nothing called them — the actual triggers use
-- trigger_set_timestamp() and trigger_generate_display_name()
-- from 0009_triggers.sql. Keeping both was dead code.
-- =====================================================

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
-- Asset Code Sequence
-- (consumed directly inside trigger_assets_before_insert()
--  in 0009_triggers.sql — no standalone function needed)
---------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS asset_code_seq
START 1;

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