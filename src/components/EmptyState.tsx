interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: EmptyStateAction;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-lg font-semibold text-gray-700">{title}</p>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm cursor-pointer font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
