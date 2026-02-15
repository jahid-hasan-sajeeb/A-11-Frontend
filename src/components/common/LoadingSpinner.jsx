export const LoadingSpinner = ({ full = false }) => {
  const wrapperClass = full
    ? "min-h-[40vh] flex items-center justify-center"
    : "flex items-center justify-center py-8";

  return (
    <div className={wrapperClass}>
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
};
