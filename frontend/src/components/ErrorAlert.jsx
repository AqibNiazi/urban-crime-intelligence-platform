function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
      <span className="mt-0.5 shrink-0">⚠</span>
      <p>{message}</p>
    </div>
  );
}

export default ErrorAlert;
