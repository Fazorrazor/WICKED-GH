export type ProductVariation = {
  id: string;
  name: string;
  image: string;
};

export type Product = {
  id: string;
  category: string;
  name: string;
  price: string;
  styleCode: string;
  description: string;
  variations: ProductVariation[];
  productDetails: string[];
  materialsAndCare: string;
  commitment: string;
  breadcrumbs: string;
  images: string[]; // These are the 3 distinct images for the gallery shuffle
};

export const PRODUCTS: Product[] = [
  // OUTERWEAR (5 items)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `out-${i + 1}`,
    category: "Outerwear",
    name: `Oversized Trench Coat ${i + 1}`,
    price: `$${1250 + i * 150}`,
    styleCode: `STYLE OTW-${1000 + i}`,
    description:
      "A minimalist high-fashion oversized trench coat. Tailored to perfection, offering a luxurious drape and silhouette.",
    variations: [
      { id: "black", name: "Black", image: "/garments/out_1.png" },
      { id: "beige", name: "Beige", image: "/garments/out_2.png" },
    ],
    productDetails: [
      "Heavyweight Gabardine",
      "Double-breasted closure",
      "Storm flap details",
      "Made in Italy",
    ],
    materialsAndCare: "Dry clean only. Protect from direct light and heat.",
    commitment: "Ethically sourced materials and sustainable production.",
    breadcrumbs: "Men / Ready to Wear / Outerwear",
    images: [
      "/garments/out_1.png",
      "/garments/out_2.png",
      "/garments/out_3.png",
    ],
  })),

  // JACKETS (5 items)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `jkt-${i + 1}`,
    category: "Jackets",
    name: `Tailored Leather Jacket ${i + 1}`,
    price: `$${2150 + i * 200}`,
    styleCode: `STYLE JKT-${2000 + i}`,
    description:
      "A sleek black tailored leather jacket with a minimalist luxury finish. Essential for the modern wardrobe.",
    variations: [
      { id: "black", name: "Black", image: "/garments/jkt_1.png" },
      { id: "brown", name: "Brown", image: "/garments/jkt_2.png" },
    ],
    productDetails: [
      "100% Calfskin Leather",
      "Silver-tone hardware",
      "Silk blend lining",
      "Made in Italy",
    ],
    materialsAndCare: "Professional leather clean only.",
    commitment: "Responsibly sourced leather from certified tanneries.",
    breadcrumbs: "Men / Ready to Wear / Jackets",
    images: [
      "/garments/jkt_1.png",
      "/garments/jkt_2.png",
      "/garments/jkt_3.png",
    ],
  })),

  // SHIRTS (5 items)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `shrt-${i + 1}`,
    category: "Shirts",
    name: `Classic Button-Down Shirt ${i + 1}`,
    price: `$${450 + i * 50}`,
    styleCode: `STYLE SHT-${3000 + i}`,
    description:
      "A crisp white luxury button-down shirt. Features a sharp collar and minimalist detailing for versatile styling.",
    variations: [
      { id: "white", name: "White", image: "/garments/shrt_1.png" },
      { id: "blue", name: "Light Blue", image: "/garments/shrt_2.png" },
    ],
    productDetails: [
      "100% Cotton Poplin",
      "Mother-of-pearl buttons",
      "French cuffs",
      "Made in Italy",
    ],
    materialsAndCare: "Machine wash cold. Iron on medium heat.",
    commitment: "Produced with 100% organic cotton.",
    breadcrumbs: "Men / Ready to Wear / Shirts",
    images: [
      "/garments/shrt_1.png",
      "/garments/shrt_2.png",
      "/garments/shrt_3.png",
    ],
  })),

  // KNITWEAR (5 items)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `knit-${i + 1}`,
    category: "Knitwear",
    name: `Cashmere Sweater ${i + 1}`,
    price: `$${850 + i * 100}`,
    styleCode: `STYLE KNT-${4000 + i}`,
    description:
      "A luxurious beige cashmere sweater offering exceptional warmth and an ultra-soft handle.",
    variations: [
      { id: "beige", name: "Beige", image: "/garments/knit_1.png" },
      { id: "grey", name: "Grey", image: "/garments/knit_2.png" },
    ],
    productDetails: [
      "100% Pure Cashmere",
      "Ribbed trims",
      "Relaxed fit",
      "Made in Scotland",
    ],
    materialsAndCare: "Hand wash cold or dry clean. Dry flat.",
    commitment: "Cruelty-free cashmere harvesting.",
    breadcrumbs: "Men / Ready to Wear / Knitwear",
    images: [
      "/garments/knit_1.png",
      "/garments/knit_2.png",
      "/garments/knit_3.png",
    ],
  })),

  // PANTS (5 items)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `pnt-${i + 1}`,
    category: "Pants",
    name: `Tailored Trousers ${i + 1}`,
    price: `$${650 + i * 50}`,
    styleCode: `STYLE PNT-${5000 + i}`,
    description:
      "Luxury tailored black trousers with a sleek, straight-leg cut. Impeccable tailoring for formal or smart-casual wear.",
    variations: [{ id: "black", name: "Black", image: "/garments/pnt_1.png" }],
    productDetails: [
      "100% Virgin Wool",
      "Concealed hook and zip fastening",
      "Pressed creases",
      "Made in Italy",
    ],
    materialsAndCare: "Dry clean only.",
    commitment: "Sustainable wool sourcing.",
    breadcrumbs: "Men / Ready to Wear / Pants",
    images: [
      "/garments/pnt_1.png",
      "/garments/pnt_1.png",
      "/garments/pnt_1.png",
    ],
  })),

  // ACCESSORIES (5 items)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `acc-${i + 1}`,
    category: "Accessories",
    name: `Leather Accessory ${i + 1}`,
    price: `$${350 + i * 50}`,
    styleCode: `STYLE ACC-${6000 + i}`,
    description:
      "A premium accessory piece featuring luxurious leather and bespoke hardware detailing.",
    variations: [{ id: "black", name: "Black", image: "/garments/jkt_3.png" }],
    productDetails: [
      "100% Leather",
      "Bespoke hardware",
      "Compact design",
      "Made in Italy",
    ],
    materialsAndCare: "Wipe clean with a damp cloth.",
    commitment: "Zero waste production process.",
    breadcrumbs: "Men / Accessories",
    images: [
      "/garments/jkt_3.png",
      "/garments/out_3.png",
      "/garments/shrt_3.png",
    ],
  })),
];
