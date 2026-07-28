"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter, Edit2, Tag } from "lucide-react";

export default function ArchiveClient({
  initialProducts,
  categories,
}: {
  initialProducts: any[];
  categories: any[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const router = useRouter();

  // ScrollSpy to highlight active category
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[data-category]");
      let current = "All";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // If section top is within 140px from viewport top (below sticky header)
        if (rect.top <= 140) {
          current = section.getAttribute("data-category") || "All";
        }
      });
      if (window.scrollY < 100) current = "All"; // Top of page
      setActiveCategory(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCategory = (catName: string) => {
    if (catName === "All") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(`category-${catName}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80; // 80px offset
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Filter products based on search and status (Category filtering is now ScrollSpy)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (activeStatus === "Available")
        matchesStatus = product.in_stock === true;
      if (activeStatus === "Archived")
        matchesStatus = product.in_stock === false;

      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, activeStatus]);

  // Group by category for sectioned rendering
  const groupedProducts = useMemo(() => {
    const groups: Record<string, any[]> = {};
    categories.forEach((c) => (groups[c.name] = []));
    groups["Uncategorized"] = [];

    filteredProducts.forEach((p) => {
      const catName = p.categories?.name || "Uncategorized";
      if (!groups[catName]) groups[catName] = [];
      groups[catName].push(p);
    });

    return groups;
  }, [filteredProducts, categories]);

  const handleOpenEdit = (product: any) => {
    router.push(`/store-management/archive/editor?id=${product.id}`);
  };

  const handleOpenAdd = () => {
    router.push("/store-management/archive/editor");
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-700 w-full min-h-screen bg-[#FDFDFD]">
      {/* Header */}
      <header className="px-12 pt-10 flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-black/10 bg-white shrink-0">
        <div className="flex flex-col justify-end">
          <h1 className="font-display text-4xl font-light uppercase tracking-widest">
            The Archive
          </h1>
          <p className="font-sans text-[0.65rem] tracking-[0.2em] text-black/40 mt-1.5 uppercase">
            {filteredProducts.length} Silhouettes Displayed
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="mt-6 md:mt-0 bg-black border border-black text-white px-6 py-2.5 font-sans text-[0.6rem] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Silhouette
        </button>
      </header>

      <div className="flex-1 flex flex-col w-full">
        {/* Filters & Search */}
        <div className="px-12 py-3 bg-white border-b border-black/5 flex flex-col 2xl:flex-row gap-6 justify-between 2xl:items-center sticky top-0 z-40 backdrop-blur-md bg-white/95">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <Filter className="w-3 h-3 text-black/30 mr-2 hidden sm:block" />
            <span className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] text-black/40 mr-2">
              Category:
            </span>
            <div className="flex flex-wrap gap-1">
              <FilterButton
                label="All"
                active={activeCategory === "All"}
                onClick={() => scrollToCategory("All")}
              />
              {categories.map((cat) => (
                <FilterButton
                  key={cat.id}
                  label={cat.name}
                  active={activeCategory === cat.name}
                  onClick={() => scrollToCategory(cat.name)}
                />
              ))}
            </div>
          </div>

          {/* Status & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 shrink-0 w-full 2xl:w-auto">
            <div className="flex items-center gap-3">
              <span className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] text-black/40">
                Status:
              </span>
              <div className="flex gap-1">
                <FilterButton
                  label="All"
                  active={activeStatus === "All"}
                  onClick={() => setActiveStatus("All")}
                />
                <FilterButton
                  label="Available"
                  active={activeStatus === "Available"}
                  onClick={() => setActiveStatus("Available")}
                />
                <FilterButton
                  label="Archived"
                  active={activeStatus === "Archived"}
                  onClick={() => setActiveStatus("Archived")}
                />
              </div>
            </div>

            <div className="w-[1px] h-4 bg-black/10 hidden sm:block"></div>

            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
              <input
                type="text"
                placeholder="Search archive..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FAFAFA] border-black/10 focus:bg-white border focus:border-black/30 pl-9 pr-4 py-1.5 font-sans text-[0.65rem] tracking-wider outline-none transition-all text-black placeholder:text-black/30"
              />
            </div>
          </div>
        </div>

        {/* Product Sections */}
        <div className="px-12 py-8 flex flex-col gap-10">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-black/10 bg-white">
              <Tag className="w-8 h-8 text-black/20 mb-4" />
              <span className="font-sans text-sm tracking-widest text-black/40 uppercase">
                No silhouettes found
              </span>
            </div>
          ) : (
            <>
              {categories.map((cat) => {
                const catProducts = groupedProducts[cat.name];
                if (!catProducts || catProducts.length === 0) return null;

                return (
                  <section
                    key={cat.name}
                    id={`category-${cat.name}`}
                    data-category={cat.name}
                    className="flex flex-col gap-4 scroll-mt-24"
                  >
                    <div className="flex justify-between items-end border-b border-black/10 pb-3">
                      <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-black">
                        {cat.name}
                      </h3>
                      <span className="font-sans text-[0.6rem] tracking-[0.2em] text-black/40 uppercase">
                        {catProducts.length}{" "}
                        {catProducts.length === 1
                          ? "Silhouette"
                          : "Silhouettes"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                      {catProducts.map((product: any) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={() => handleOpenEdit(product)}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}

              {groupedProducts["Uncategorized"] &&
                groupedProducts["Uncategorized"].length > 0 && (
                  <section
                    id="category-Uncategorized"
                    data-category="Uncategorized"
                    className="flex flex-col gap-4 scroll-mt-24"
                  >
                    <div className="flex justify-between items-end border-b border-black/10 pb-3">
                      <h3 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-black">
                        Uncategorized
                      </h3>
                      <span className="font-sans text-[0.6rem] tracking-[0.2em] text-black/40 uppercase">
                        {groupedProducts["Uncategorized"].length}{" "}
                        {groupedProducts["Uncategorized"].length === 1
                          ? "Silhouette"
                          : "Silhouettes"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                      {groupedProducts["Uncategorized"].map((product: any) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={() => handleOpenEdit(product)}
                        />
                      ))}
                    </div>
                  </section>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] transition-all rounded-sm ${
        active
          ? "bg-black text-white"
          : "bg-transparent text-black/50 hover:bg-black/5 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}

function ProductCard({
  product,
  onClick,
}: {
  product: any;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-white border border-black/10 hover:border-black/30 hover:shadow-xl transition-all duration-500 overflow-hidden relative cursor-pointer"
    >
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`inline-block px-2 py-1 font-sans text-[0.5rem] font-bold tracking-[0.2em] uppercase border backdrop-blur-md ${
            product.in_stock
              ? "bg-white/80 text-black border-black/10"
              : "bg-black/80 text-white border-black/40"
          }`}
        >
          {product.in_stock ? "Available" : "Archived"}
        </span>
      </div>

      <div className="aspect-[3/4] relative bg-[#FAFAFA] overflow-hidden">
        {product.image_solo_url ? (
          <Image
            src={product.image_solo_url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-8 h-8 text-black/10" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white px-6 py-2 border border-black/10 font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <Edit2 className="w-3 h-3" />
            Edit Details
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div className="flex flex-col gap-1.5">
          <span className="font-sans text-[0.65rem] tracking-[0.2em] text-black/40 uppercase">
            {product.categories?.name || "Uncategorized"}
          </span>
          <h3 className="font-sans text-sm tracking-wide font-medium text-black line-clamp-1">
            {product.title}
          </h3>
        </div>
        <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-end">
          <span className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase text-black/40">
            Base Price
          </span>
          <span className="font-sans text-sm tracking-wider font-medium text-black">
            ${(product.price_cents / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
