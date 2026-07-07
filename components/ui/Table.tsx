import { cn } from "@/lib/utils";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps extends TableProps {
  colSpan?: number;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "min-w-full divide-y divide-border transition-colors duration-300",
          className,
        )}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className }: TableProps) {
  return (
    <thead
      className={cn("bg-secondary transition-colors duration-300", className)}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: TableProps) {
  return (
    <tbody
      className={cn(
        "divide-y divide-border bg-card transition-colors duration-300",
        className,
      )}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ children, className }: TableProps) {
  return (
    <tr
      className={cn(
        "hover:bg-secondary/50 transition-colors duration-200",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TableHeaderCell({ children, className }: TableProps) {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider transition-colors duration-300",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className, colSpan }: TableCellProps) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "px-6 py-4 whitespace-nowrap text-sm text-[#0A0A0A] dark:text-[#E0E0E0] font-medium transition-colors duration-300",
        className,
      )}
    >
      {children}
    </td>
  );
}
