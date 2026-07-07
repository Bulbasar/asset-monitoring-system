import { toast } from "sonner";

export const handleDuplicateError = (error: any, itemName: string): boolean => {
  // Check for PostgreSQL duplicate key violation
  if (error?.code === "23505") {
    // Extract the field name from the error message
    const match = error.message?.match(/key "([^"]+)"/);
    const constraintName = match ? match[1] : "";

    let fieldName = "";
    if (constraintName?.includes("code")) {
      fieldName = "Code";
    } else if (constraintName?.includes("name")) {
      fieldName = "Name";
    } else if (constraintName?.includes("manufacturer_id_name")) {
      fieldName = "Name (must be unique per manufacturer)";
    } else if (constraintName?.includes("brand_id_name")) {
      fieldName = "Name (must be unique per brand)";
    } else if (constraintName?.includes("email")) {
      fieldName = "Email";
    } else if (constraintName?.includes("supplier_code")) {
      fieldName = "Supplier Code";
    } else {
      fieldName = "Value";
    }

    toast.error(
      `${fieldName} already exists. Please use a unique ${fieldName.toLowerCase()}.`,
    );
    return true;
  }
  return false;
};

export const formatValidationError = (error: any): string => {
  if (error?.code === "23505") {
    const match = error.message?.match(/key "([^"]+)"/);
    const constraintName = match ? match[1] : "";

    if (constraintName?.includes("code")) {
      return "This code already exists. Please use a unique code.";
    }
    if (constraintName?.includes("name")) {
      return "This name already exists. Please use a unique name.";
    }
    if (constraintName?.includes("email")) {
      return "This email already exists. Please use a unique email.";
    }
    if (constraintName?.includes("supplier_code")) {
      return "This supplier code already exists. Please use a unique code.";
    }
    return "A record with this value already exists. Please use a unique value.";
  }
  return error?.message || "An error occurred. Please try again.";
};
