import type { Review } from "@/types/review.types";
import { useTranslation } from "react-i18next";
import ReviewItem from "./ReviewItem";
import StarRating from "./StarRating";

interface ReviewListProps {
  rating: number;
  reviews: Review[];
}

export default function ReviewList({ rating, reviews }: ReviewListProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 text-left">
      <h2 className="text-xl font-bold text-muted-950">
        {t("components.reviewList.title")}
      </h2>

      {/* Destaque do Rating Geral */}
      <div className="flex items-center gap-6 rounded-xl bg-muted-50 p-6 border border-muted-300 dark:border-zinc-800">
        <span className="text-5xl font-extrabold text-muted-950">
          {rating.toFixed(1)}
        </span>
        <div className="flex flex-col gap-1">
          <StarRating rating={rating} size="large" />
          <span className="text-xs text-muted-500">
            {t("components.reviewList.outOfFive")}
          </span>
        </div>
      </div>

      {/* Lista de Avaliações */}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-500 py-4">
          {t("components.reviewList.noReviews")}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review, index) => (
            <ReviewItem key={`${review.reviewerEmail}-${index}`} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
