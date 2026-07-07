export interface Profile {
  id: string;
  employee_no: number;
  employee_code: string;
  role_id: string;
  department_id: string;
  location_id: string;
  display_name: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  email: string;
  contact_number?: string;
  position?: string;
  profile_image_file_id?: string;
  last_login_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles?: {
    id: string;
    name: string;
    code: string;
  };
  departments?: {
    id: string;
    name: string;
    code: string;
  };
  locations?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  module: string;
  description?: string;
  created_at: string;
}

export interface RoleWithPermissions extends Role {
  permissions?: Permission[];
}

export interface Asset {
  id: string;
  asset_no: number;
  asset_code: string;
  asset_tag?: string;
  asset_name: string;
  description?: string;
  category_id: string;
  model_id: string;
  supplier_id?: string;
  location_id: string;
  status_id: string;
  condition_id: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_cost?: number;
  current_value?: number;
  warranty_end_date?: string;
  asset_image_file_id?: string;
  notes?: string;
  qr_code?: string;
  barcode?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: { name: string };
  locations?: { name: string };
  asset_statuses?: { name: string };
  asset_conditions?: { name: string };
}

export interface Category {
  id: string;
  code: string;
  name: string;
  description?: string;
  image_file_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  manufacturer_id: string;
  code: string;
  name: string;
  description?: string;
  image_file_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  manufacturers?: { name: string };
}

export interface Model {
  id: string;
  brand_id: string;
  code: string;
  name: string;
  model_number?: string;
  description?: string;
  image_file_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  brands?: { name: string };
}

export interface Manufacturer {
  id: string;
  code: string;
  name: string;
  description?: string;
  website_url?: string;
  country_of_origin?: string;
  image_file_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  supplier_code: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  website_url?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  code: string;
  name: string;
  description?: string;
  building?: string;
  floor?: string;
  room?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceLog {
  id: string;
  maintenance_no: string;
  asset_id: string;
  maintenance_type_id: string;
  performed_by_profile_id?: string;
  supplier_id?: string;
  attachment_file_id?: string;
  performed_at: string;
  cost?: number;
  description?: string;
  next_maintenance_date?: string;
  created_at: string;
}

export interface AssetTransaction {
  id: string;
  asset_id: string;
  transaction_type_id: string;
  from_location_id?: string;
  to_location_id?: string;
  from_profile_id?: string;
  to_profile_id?: string;
  attachment_file_id?: string;
  processed_by_profile_id: string;
  transaction_at: string;
  reference_no?: string;
  notes?: string;
  created_at: string;
}
