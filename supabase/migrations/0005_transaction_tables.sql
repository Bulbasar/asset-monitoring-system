-- =====================================================
-- Asset Monitoring System
-- Transaction Tables
-- =====================================================

---------------------------------------------------------
-- Asset Transactions
---------------------------------------------------------
CREATE TABLE asset_transactions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    asset_id UUID NOT NULL,

    transaction_type_id UUID NOT NULL,

    from_location_id UUID,
    to_location_id UUID,

    from_profile_id UUID,
    to_profile_id UUID,

    attachment_file_id UUID,

    processed_by_profile_id UUID NOT NULL,

    transaction_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    reference_no TEXT UNIQUE,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_transaction_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_transaction_type
        FOREIGN KEY (transaction_type_id)
        REFERENCES asset_transaction_types(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_transaction_from_location
        FOREIGN KEY (from_location_id)
        REFERENCES locations(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_transaction_to_location
        FOREIGN KEY (to_location_id)
        REFERENCES locations(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_transaction_from_user
        FOREIGN KEY (from_profile_id)
        REFERENCES profiles(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_transaction_to_user
        FOREIGN KEY (to_profile_id)
        REFERENCES profiles(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_transaction_attachment
        FOREIGN KEY (attachment_file_id)
        REFERENCES media(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_transaction_processed_by
        FOREIGN KEY (processed_by_profile_id)
        REFERENCES profiles(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

---------------------------------------------------------
-- Maintenance Logs
---------------------------------------------------------
CREATE TABLE maintenance_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maintenance_no TEXT UNIQUE,

    asset_id UUID NOT NULL,

    maintenance_type_id UUID NOT NULL,

    performed_by_profile_id UUID,

    supplier_id UUID,

    attachment_file_id UUID,

    performed_at TIMESTAMPTZ NOT NULL,

    cost NUMERIC(12,2)
        CHECK (cost IS NULL OR cost >= 0),

    description TEXT,

    next_maintenance_date DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_maintenance_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_maintenance_type
        FOREIGN KEY (maintenance_type_id)
        REFERENCES maintenance_types(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_maintenance_user
        FOREIGN KEY (performed_by_profile_id)
        REFERENCES profiles(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_maintenance_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_maintenance_attachment
        FOREIGN KEY (attachment_file_id)
        REFERENCES media(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);