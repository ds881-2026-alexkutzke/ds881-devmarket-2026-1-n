import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Category as CategoryIcon,
  Checkroom,
  Devices,
  Headphones,
  Home,
  LocalMall,
  SportsEsports,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CategoryChip from "@/components/CategoryChip";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SortSelect, { type SortOption } from "@/components/SortSelect";
import { getProducts } from "@/services/productService";
import type { Category } from "@/types/category.types";
import type { Product } from "@/types/product.types";
import { sortBy } from "@/utils/arraySort";
import { paginate } from "@/utils/paginate";
import { topNByDiscount } from "@/utils/topNByDiscount";
import { topNByFrequency } from "@/utils/topNByFrequency";

const HERO_HEIGHT = "h-[280px]";

const toDisplayLabel = (slug: string) =>
  slug
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");

function getCategoryIcon(slug: string) {
  if (slug.includes("beauty") || slug.includes("skin") || slug.includes("fragrance")) {
    return <CategoryIcon fontSize="small" />;
  }

  if (slug.includes("shirt") || slug.includes("dress") || slug.includes("clothing")) {
    return <Checkroom fontSize="small" />;
  }

  if (slug.includes("furniture") || slug.includes("home") || slug.includes("kitchen")) {
    return <Home fontSize="small" />;
  }

  if (slug.includes("laptop") || slug.includes("mobile") || slug.includes("phone")) {
    return <Devices fontSize="small" />;
  }

  if (slug.includes("audio") || slug.includes("headphones")) {
    return <Headphones fontSize="small" />;
  }

  if (slug.includes("sports") || slug.includes("gaming")) {
    return <SportsEsports fontSize="small" />;
  }

  return <LocalMall fontSize="small" />;
}

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>("relevance");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [featuredPage, setFeaturedPage] = useState(1);

  const loadProducts = () => {
    setIsLoading(true);
    setIsError(false);

    getProducts()
      .then((response) => {
        setProducts(response);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isActive = true;

    void getProducts()
      .then((response) => {
        if (isActive) {
          setProducts(response);
          setIsError(false);
        }
      })
      .catch(() => {
        if (isActive) {
          setIsError(true);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const categories = useMemo<Category[]>(() => {
    const slugs = topNByFrequency(
      products.map((product) => product.category),
      6,
    );

    return [
      {
        slug: "all",
        name: t("pages.home.categories.all"),
        url: "",
      },
      ...slugs.map((slug) => ({
        slug,
        name: t(`pages.home.categories.${slug}`, {
          defaultValue: toDisplayLabel(slug),
        }),
        url: "",
      })),
    ];
  }, [products, t]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const sortedProducts = useMemo(() => {
    if (selectedSort === "relevance") {
      return filteredProducts;
    }

    if (selectedSort === "price-asc") {
      return sortBy(filteredProducts, "price", "asc");
    }

    if (selectedSort === "price-desc") {
      return sortBy(filteredProducts, "price", "desc");
    }

    if (selectedSort === "rating-asc") {
      return sortBy(filteredProducts, "rating", "asc");
    }

    return sortBy(filteredProducts, "rating", "desc");
  }, [filteredProducts, selectedSort]);

  const spotlightProducts = useMemo(
    () => topNByDiscount(products, 6),
    [products],
  );

  const featuredProducts = useMemo(
    () => topNByDiscount(sortedProducts, 12),
    [sortedProducts],
  );

  const featuredPagination = useMemo(
    () => paginate(featuredProducts, featuredPage, 4),
    [featuredPage, featuredProducts],
  );

  const heroProduct = featuredProducts[0] ?? products[0] ?? null;

  if (isError) {
    return (
      <>
        <Header />
        <ErrorState message="pages.home.error" onRetry={loadProducts} />
      </>
    );
  }

  return (
    <>
      <main className="flex w-full flex-col gap-8 px-4 pb-10 pt-2">
        {isLoading ? (
          <div className="py-16 text-center text-muted-700">{t("pages.home.loading")}</div>
        ) : (
          <>
            <section className="grid gap-4 lg:grid-cols-[240px_1fr]">
              <aside className="rounded-xl border border-muted-300 bg-white p-4">
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-muted-950">
                  <CategoryIcon fontSize="small" />
                  {t("pages.home.categoriesTitle")}
                </h2>

                <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
                  {categories.map((category) => (
                    <div
                      key={category.slug}
                      className="inline-flex items-center gap-2 text-sm text-muted-700"
                    >
                      {category.slug !== "all" && getCategoryIcon(category.slug)}
                      <CategoryChip
                        category={category}
                        onClick={(nextCategory) => {
                          setSelectedCategory(nextCategory.slug);
                          setFeaturedPage(1);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </aside>

              <div
                className={`relative overflow-hidden rounded-xl border border-muted-300 bg-muted-950 ${HERO_HEIGHT}`}
              >
                {heroProduct && (
                  <img
                    src={heroProduct.images[0] ?? heroProduct.thumbnail}
                    alt={t("pages.home.hero.imageAlt", { title: heroProduct.title })}
                    className="h-full w-full object-cover opacity-65"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-muted-950/80 via-muted-950/45 to-transparent" />

                <div className="absolute inset-0 flex max-w-[520px] flex-col justify-center gap-3 px-8 text-left text-white">
                  <span className="w-fit rounded-full bg-primary-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {t("pages.home.hero.badge")}
                  </span>


                  <p className="text-sm text-white/90 lg:text-base">
                    {t("pages.home.hero.subtitle")}
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/search")}
                    className="mt-2 w-fit rounded-md bg-primary-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-500"
                  >
                    {t("pages.home.hero.cta")}
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-muted-300 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="m-0 text-3xl font-semibold text-muted-950">
                  {t("pages.home.trendingTitle")}
                </h2>
                <button
                  type="button"
                  onClick={() => navigate("/search")}
                  className="text-sm font-medium text-primary-700"
                >
                  {t("pages.home.seeAll")}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {spotlightProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="flex cursor-pointer flex-col items-center gap-2 text-center transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted-50 p-3">
                      <img
                        src={product.thumbnail}
                        alt={t("pages.home.trending.imageAlt", { title: product.title })}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p className="text-xs font-medium text-muted-950">{product.title}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="m-0 text-3xl font-semibold text-muted-950">
                  {t("pages.home.featuredTitle")}
                </h2>

                <div className="w-full md:w-[260px]">
                  <SortSelect
                    value={selectedSort}
                    onChange={(nextSort) => {
                      setSelectedSort(nextSort);
                      setFeaturedPage(1);
                    }}
                  />
                </div>
              </div>

              {featuredPagination.items.length > 0 ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredPagination.items.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => navigate(`/product/${product.id}`)}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <IconButton
                      onClick={() => setFeaturedPage((page) => Math.max(1, page - 1))}
                      disabled={featuredPagination.currentPage === 1}
                      aria-label={t("pages.home.pagination.previous")}
                    >
                      <ArrowBackIosNew fontSize="small" />
                    </IconButton>

                    <span className="text-sm text-muted-700">
                      {t("pages.home.pagination.page", {
                        current: featuredPagination.currentPage,
                        total: featuredPagination.totalPages,
                      })}
                    </span>

                    <IconButton
                      onClick={() =>
                        setFeaturedPage((page) =>
                          Math.min(featuredPagination.totalPages, page + 1),
                        )
                      }
                      disabled={
                        featuredPagination.currentPage === featuredPagination.totalPages ||
                        featuredPagination.totalPages === 0
                      }
                      aria-label={t("pages.home.pagination.next")}
                    >
                      <ArrowForwardIos fontSize="small" />
                    </IconButton>
                  </div>
                </>
              ) : (
                <EmptyState
                  title={t("pages.home.empty.title")}
                  description={t("pages.home.empty.description")}
                  action={{
                    label: t("pages.home.empty.action"),
                    onClick: () => setSelectedCategory("all"),
                  }}
                />
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default HomePage;
