import Rating from "@mui/material/Rating";

export default function StarRating({ rating }: { rating: number }) {
  return <Rating value={rating} readOnly precision={0.1} size="small" />;
}
