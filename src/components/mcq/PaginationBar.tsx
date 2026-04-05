interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationBar = ({ currentPage, totalPages, onPageChange }: PaginationBarProps) => {
  if (currentPage >= totalPages) return null;

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-95"
      >
        Load Next 10 Questions
      </button>
    </div>
  );
};

export default PaginationBar;
