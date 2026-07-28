"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Tag, Save, Loader2, Search } from "lucide-react";
import { upsertProduct } from "../actions";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";

export default function EditorClient({
  initialProduct,
  categories,
  allProducts,
}: {
  initialProduct: any | null;
  categories: any[];
  allProducts: any[];
}) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct || {});
  const [imageSoloUrl, setImageSoloUrl] = useState(
    product.image_solo_url || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Exclude the currently editing product if desired, or just show all
      if (initialProduct && p.id === initialProduct.id) return false;
      if (!searchTerm) return true;
      return p.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [allProducts, searchTerm, initialProduct]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: initialProduct?.id,
      title: formData.get("title"),
      price_cents: Number(formData.get("price_cents")),
      category_id: formData.get("category_id"),
      image_solo_url: formData.get("image_solo_url"),
      image_worn_url: formData.get("image_worn_url"),
      in_stock: formData.get("status") === "available",
      stock_quantity: Number(formData.get("stock_quantity")),
      sku: formData.get("sku"),
      description: formData.get("description"),
      materials: formData.get("materials"),
      care_instructions: formData.get("care_instructions"),
      our_commitment: formData.get("our_commitment"),
    };

    try {
      await upsertProduct(data);
      toast.success("Archive updated successfully");
      router.push("/store-management/archive");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update archive");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col animate-in fade-in duration-700 w-full min-h-screen bg-[#FDFDFD]"
    >
      <header className="px-12 pt-16 flex justify-between items-end pb-10 border-b border-black/10 bg-white shrink-0">
        <div>
          <button
            type="button"
            onClick={() => router.push("/store-management/archive")}
            className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Archive
          </button>
          <h1 className="font-display text-4xl font-light uppercase tracking-widest">
            {initialProduct ? "Edit Silhouette" : "New Silhouette"}
          </h1>
          <p className="font-sans text-[0.65rem] tracking-[0.2em] text-black/40 mt-3 uppercase">
            {initialProduct ? `ID: ${initialProduct.id}` : "Adding to catalog"}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push("/store-management/archive")}
            className="px-6 py-3 border border-black/10 bg-white text-black font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase hover:bg-[#fafafa] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-black text-white font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase hover:bg-black/80 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {isLoading
              ? "Saving..."
              : initialProduct
                ? "Save Changes"
                : "Create"}
          </button>
        </div>
      </header>

      <div className="flex-1 w-full px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left / Main Details */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            <section>
              <h2 className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase border-b border-black/10 pb-3 mb-6 text-black/40">
                Core Details
              </h2>
              <div className="flex flex-col gap-6 font-sans text-sm">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/60">
                    Silhouette Name
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={product.title || ""}
                    placeholder="e.g. Asymmetric Cashmere Wrap"
                    className="w-full border border-black/20 p-4 bg-transparent outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/60">
                      Base Price (Cents)
                    </label>
                    <input
                      type="number"
                      name="price_cents"
                      required
                      defaultValue={product.price_cents || ""}
                      placeholder="e.g. 85000"
                      className="w-full border border-black/20 p-4 bg-transparent outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/60">
                      Category
                    </label>
                    <select
                      name="category_id"
                      required
                      defaultValue={
                        product.category_id || product.categories?.id || ""
                      }
                      className="w-full border border-black/20 p-4 bg-transparent outline-none focus:border-black transition-colors appearance-none cursor-pointer rounded-none"
                    >
                      <option value="" disabled>
                        Select a Category
                      </option>
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/60">
                      Style ID / SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      defaultValue={product.sku || ""}
                      placeholder="e.g. STYLE BA742D0C"
                      className="w-full border border-black/20 p-4 bg-transparent outline-none focus:border-black transition-colors uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/60">
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={product.description || ""}
                    placeholder="A minimalist high-fashion..."
                    className="w-full border border-black/20 p-4 bg-transparent outline-none focus:border-black transition-colors resize-none"
                  />
                </div>

                {/* Accordion Content Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-black/5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.55rem] font-bold tracking-[0.1em] uppercase text-black/60 leading-relaxed">
                      Product Details Text
                    </label>
                    <textarea
                      name="materials"
                      rows={5}
                      defaultValue={product.materials || ""}
                      placeholder="Premium construction..."
                      className="w-full border border-black/10 p-3 text-xs bg-transparent outline-none focus:border-black transition-colors resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.55rem] font-bold tracking-[0.1em] uppercase text-black/60 leading-relaxed">
                      Materials & Care Text
                    </label>
                    <textarea
                      name="care_instructions"
                      rows={5}
                      defaultValue={product.care_instructions || ""}
                      placeholder="Dry clean only..."
                      className="w-full border border-black/10 p-3 text-xs bg-transparent outline-none focus:border-black transition-colors resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.55rem] font-bold tracking-[0.1em] uppercase text-black/60 leading-relaxed">
                      Our Commitment Text
                    </label>
                    <textarea
                      name="our_commitment"
                      rows={5}
                      defaultValue={product.our_commitment || ""}
                      placeholder="Ethically sourced..."
                      className="w-full border border-black/10 p-3 text-xs bg-transparent outline-none focus:border-black transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase border-b border-black/10 pb-3 mb-6 text-black/40">
                Visual Assets
              </h2>
              <div className="flex flex-col gap-6 font-sans text-sm">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/80">
                    First Image (Model wearing piece)
                  </label>
                  <span className="text-[0.55rem] text-black/50 tracking-wider mb-2 block">
                    This appears first in the product gallery, and is the hover
                    image in the Archive grid.
                  </span>
                  <ImageUpload
                    name="image_worn_url"
                    defaultValue={product.image_worn_url}
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/80">
                    Second Image (The piece by itself)
                  </label>
                  <span className="text-[0.55rem] text-black/50 tracking-wider mb-2 block">
                    This appears second in the product gallery, and is the
                    default cover in the Archive grid.
                  </span>
                  <ImageUpload
                    name="image_solo_url"
                    defaultValue={product.image_solo_url}
                    onChange={setImageSoloUrl}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right / Logistics */}
          <div className="flex flex-col gap-12">
            <section>
              <h2 className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase border-b border-black/10 pb-3 mb-6 text-black/40">
                Logistics & Availability
              </h2>

              <div className="flex flex-col gap-8 bg-white border border-black/10 p-8">
                <div className="flex flex-col gap-4">
                  <label className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/60">
                    Store Status
                  </label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="status"
                        value="available"
                        defaultChecked={product.in_stock !== false}
                        className="accent-black w-4 h-4"
                      />
                      <span className="text-xs uppercase tracking-wider group-hover:text-black text-black/60 transition-colors">
                        Available
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="status"
                        value="archived"
                        defaultChecked={product.in_stock === false}
                        className="accent-black w-4 h-4"
                      />
                      <span className="text-xs uppercase tracking-wider group-hover:text-black text-black/60 transition-colors">
                        Archived
                      </span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-black/5" />

                <div className="flex flex-col gap-4">
                  <label className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/60">
                    Items Left In Stock
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    defaultValue={product.stock_quantity ?? 0}
                    min="0"
                    className="w-full border border-black/20 p-4 bg-transparent outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase border-b border-black/10 pb-3 mb-6 text-black/40">
                Preview
              </h2>
              <div className="aspect-[3/4] relative bg-[#FAFAFA] overflow-hidden border border-black/10 flex items-center justify-center">
                {imageSoloUrl ? (
                  <Image
                    src={imageSoloUrl}
                    alt={product.title || "Preview"}
                    fill
                    className="object-cover mix-blend-multiply"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <Tag className="w-10 h-10" />
                    <span className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em]">
                      No Image
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Quick Edit Catalog Section */}
        <div className="mt-24 pt-12 border-t border-black/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h2 className="font-display text-2xl font-light uppercase tracking-widest">
                Quick Edit Catalog
              </h2>
              <p className="font-sans text-[0.65rem] tracking-[0.2em] text-black/40 mt-2 uppercase">
                Select another silhouette to edit
              </p>
            </div>

            <div className="relative w-full md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
              <input
                type="text"
                placeholder="Search silhouettes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FAFAFA] border-black/10 focus:bg-white border focus:border-black/30 pl-9 pr-4 py-1.5 font-sans text-[0.65rem] tracking-wider outline-none transition-all text-black placeholder:text-black/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-black/10 font-sans text-xs tracking-widest uppercase text-black/40">
                No other products found.
              </div>
            ) : (
              <>
                {categories.map((cat) => {
                  const catProducts = groupedProducts[cat.name];
                  if (!catProducts || catProducts.length === 0) return null;

                  return (
                    <section key={cat.name} className="flex flex-col gap-4">
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
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {catProducts.map((p: any) => (
                          <MiniProductCard
                            key={p.id}
                            p={p}
                            onClick={() =>
                              router.push(`/store-management/archive/editor?id=${p.id}`)
                            }
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}

                {groupedProducts["Uncategorized"] &&
                  groupedProducts["Uncategorized"].length > 0 && (
                    <section className="flex flex-col gap-4">
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
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {groupedProducts["Uncategorized"].map((p: any) => (
                          <MiniProductCard
                            key={p.id}
                            p={p}
                            onClick={() =>
                              router.push(`/store-management/archive/editor?id=${p.id}`)
                            }
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
    </form>
  );
}

function MiniProductCard({ p, onClick }: { p: any; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-white border border-black/10 hover:border-black/30 cursor-pointer transition-all duration-300"
    >
      <div className="aspect-[3/4] relative bg-[#FAFAFA] overflow-hidden">
        {p.image_solo_url ? (
          <Image
            src={p.image_solo_url}
            alt={p.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-6 h-6 text-black/10" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col">
        <span className="font-sans text-[0.55rem] tracking-[0.2em] text-black/40 uppercase mb-1">
          {p.categories?.name || "Uncategorized"}
        </span>
        <h3 className="font-sans text-xs tracking-wide font-medium text-black line-clamp-1">
          {p.title}
        </h3>
      </div>
    </div>
  );
}
