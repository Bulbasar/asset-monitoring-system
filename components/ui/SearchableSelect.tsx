"use client";

import Select from "react-select";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  isClearable?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  error,
  required,
  disabled,
  className,
  isClearable = true,
}: SearchableSelectProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (option: Option | null) => {
    onChange(option?.value || "");
  };

  // Custom styles using CSS variables
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgb(var(--secondary))"
        : "rgb(var(--card))",
      borderColor: error
        ? "rgb(var(--destructive))"
        : state.isFocused
          ? "rgb(var(--primary))"
          : "rgb(var(--input))",
      borderWidth: "1px",
      borderRadius: "0.5rem",
      padding: "0.125rem 0",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(var(--primary), 0.1)"
        : "none",
      "&:hover": {
        borderColor: error ? "rgb(var(--destructive))" : "rgb(var(--primary))",
      },
      minHeight: "38px",
      transition: "all 0.2s",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "rgb(var(--card))",
      border: "1px solid rgb(var(--border))",
      borderRadius: "0.5rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      marginTop: "4px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgb(var(--secondary))"
        : "transparent",
      color: state.isSelected
        ? "rgb(var(--primary))"
        : "rgb(var(--foreground))",
      "&:hover": {
        backgroundColor: "rgb(var(--secondary))",
      },
      padding: "8px 12px",
      cursor: "pointer",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "rgb(var(--muted-foreground))",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "rgb(var(--foreground))",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "rgb(var(--foreground))",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: "rgb(var(--border))",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "rgb(var(--muted-foreground))",
      "&:hover": {
        color: "rgb(var(--foreground))",
      },
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: "rgb(var(--muted-foreground))",
      "&:hover": {
        color: "rgb(var(--foreground))",
      },
    }),
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5 transition-colors duration-300">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={disabled}
        isClearable={isClearable}
        styles={customStyles}
        classNamePrefix="react-select"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: isDark ? "#E0E0E0" : "#0A0A0A",
            primary75: isDark
              ? "rgba(224,224,224,0.75)"
              : "rgba(10,10,10,0.75)",
            primary50: isDark ? "rgba(224,224,224,0.5)" : "rgba(10,10,10,0.5)",
            primary25: isDark
              ? "rgba(224,224,224,0.25)"
              : "rgba(10,10,10,0.25)",
          },
        })}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
