import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductImageGallery({
  images,
  alt,
}: ProductImageGalleryProps) {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "ArrowRight") {
      setSelectedIndex((current) =>
        Math.min(current + 1, images.length - 1)
      );
    }

    if (event.key === "ArrowLeft") {
      setSelectedIndex((current) =>
        Math.max(current - 1, 0)
      );
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={t("components.productImageGallery.gallery")}
      className="w-full focus:outline focus:outline-2"
    >
      <div className="overflow-hidden rounded-lg border">
        <img
          src={images[selectedIndex]}
          alt={alt}
          className="h-96 w-full object-contain"
        />
      </div>

    
      {images.length > 1 && (
        <div
          className="mt-4 flex gap-2 overflow-x-auto"
          aria-label={t("components.productImageGallery.thumbnails")}
        >
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={t(
                "components.productImageGallery.thumbnail",
                {
                  index: index + 1,
                }
              )}
              aria-current={selectedIndex === index}
              className={`
                overflow-hidden rounded border
                focus:outline focus:outline-2
                ${
                  selectedIndex === index
                    ? "ring-2"
                    : ""
                }
              `}
            >
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                className="h-20 w-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}