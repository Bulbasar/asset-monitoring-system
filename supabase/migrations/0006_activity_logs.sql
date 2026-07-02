-- =====================================================
-- Asset Monitoring System
-- Activity Logs
-- =====================================================

---------------------------------------------------------
-- Activity Logs
---------------------------------------------------------
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id UUID,

    module TEXT NOT NULL DEFAULT 'system',

    activity_type_id UUID,

    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,

    description TEXT NOT NULL,

    reference_no TEXT,

    old_data JSONB,
    new_data JSONB,

    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_activity_profile
        FOREIGN KEY (profile_id)
        REFERENCES profiles(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_activity_type
        FOREIGN KEY (activity_type_id)
        REFERENCES activity_types(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

---------------------------------------------------------
-- Useful Indexes
---------------------------------------------------------

CREATE INDEX idx_activity_logs_profile
ON activity_logs(profile_id);

CREATE INDEX idx_activity_logs_table
ON activity_logs(table_name);

CREATE INDEX idx_activity_logs_record
ON activity_logs(record_id);

CREATE INDEX idx_activity_logs_created_at
ON activity_logs(created_at DESC);

CREATE INDEX idx_activity_logs_activity_type
ON activity_logs(activity_type_id);