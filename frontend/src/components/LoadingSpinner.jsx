import clsx from "clsx";
function LoadingSpinner({ size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <div
      className={clsx(
        "border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin",
        sizes[size],
      )}
    />
  );
}

export default LoadingSpinner;
