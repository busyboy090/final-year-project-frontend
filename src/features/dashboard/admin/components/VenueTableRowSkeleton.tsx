import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function VenueTableRowSkeleton() {
  return (
    <TableRow className="animate-pulse">
      {/* Index Column */}
      <TableCell className="px-6">
        <Skeleton className="h-4 w-4 rounded" />
      </TableCell>

      {/* Image & Name & Location Column */}
      <TableCell className="pl-6 py-4 w-[280px]">
        <div className="flex items-center gap-3">
          {/* Image Skeleton */}
          <Skeleton className="size-12 rounded-lg shrink-0" />
          
          <div className="flex flex-col gap-2 flex-1">
            {/* Name Skeleton */}
            <Skeleton className="h-4 w-[140px] rounded" />
            {/* Location Skeleton */}
            <Skeleton className="h-3 w-[100px] rounded" />
          </div>
        </div>
      </TableCell>

      {/* Type Column */}
      <TableCell>
        <Skeleton className="h-4 w-16 rounded" />
      </TableCell>

      {/* Capacity Column */}
      <TableCell>
        <Skeleton className="h-4 w-20 rounded" />
      </TableCell>

      {/* Status Column */}
      <TableCell>
        <Skeleton className="h-6 w-24 rounded-full" />
      </TableCell>

      {/* Actions Column */}
      <TableCell className="px-6 text-center">
        <Skeleton className="size-8 rounded-md mx-auto" />
      </TableCell>
    </TableRow>
  );
}