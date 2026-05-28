import type { Review } from "@/types/review.types";
import StarRating from "./StarRating";

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const reviewDate = new Date(review.date);
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(reviewDate);
  const isoDate = reviewDate.toISOString();

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-muted-300 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-muted-950">
            {review.reviewerName}
          </span>
          <time dateTime={isoDate} className="text-xs text-muted-500">
            {formattedDate}
          </time>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-sm text-muted-700">{review.comment}</p>
    </div>
  );
}
