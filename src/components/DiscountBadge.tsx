interface DiscountBadgeProps {
  percentage: number;
}

export default function DiscountBadge({ percentage }: DiscountBadgeProps) {
  if (!percentage || percentage <= 0) return null;

  return (
    <span className="inline-flex items-center rounded-md bg-danger-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
      -{Math.round(percentage)}%
    </span>
  );
}