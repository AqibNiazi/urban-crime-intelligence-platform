function PageHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}

export default PageHeader;
