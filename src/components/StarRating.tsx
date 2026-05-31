import Rating from "@mui/material/Rating";

interface StarRatingProps {
  rating: number;
  size?: "small" | "medium" | "large";
}

export default function StarRating({ rating, size = "small" }: StarRatingProps) {
  return <Rating value={rating} readOnly precision={0.1} size={size} />;
}
