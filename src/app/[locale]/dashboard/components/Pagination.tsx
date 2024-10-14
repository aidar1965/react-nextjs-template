import { Button } from "@/components/ui/button";
import { Pagination as PaginationComponent } from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
  isFirstPage: boolean;
}

export default function Pagination({ page, onPageChange, isFirstPage }: PaginationProps) {
  return (
    <div className="mt-4 flex justify-center">
      <PaginationComponent>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirstPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </PaginationComponent>
    </div>
  );
}