import { BLOCKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import type { Category, Product } from "./types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Fashion",
    nameBn: "ফ্যাশন",
    slug: "fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-2",
    name: "Beauty",
    nameBn: "বিউটি",
    slug: "beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-3",
    name: "Shoes",
    nameBn: "জুতা",
    slug: "shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-4",
    name: "Bags",
    nameBn: "ব্যাগ",
    slug: "bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-5",
    name: "Accessories",
    nameBn: "অ্যাক্সেসরিজ",
    slug: "accessories",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-6",
    name: "Lifestyle",
    nameBn: "লাইফস্টাইল",
    slug: "lifestyle",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80",
  },
];

// Real Contentful data returns rich-text fields as a Document object, not a
// plain string — this fallback data has to match that shape or components
// that call documentToReactComponents() on it will crash. Wraps a plain
// string as a minimal single-paragraph rich-text document.
function toRichText(text: string): Document {
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: "text",
            value: text,
            marks: [],
            data: {},
          },
        ],
      },
    ],
  } as Document;
}

const images = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80",
];

export const products: Product[] = images.map((image, i) => {
  const names = [
    "Classic Linen Shirt",
    "Everyday Cotton Dress",
    "Minimal Shoulder Bag",
    "Essential Sneakers",
    "Soft Knit Top",
    "Modern Casual Jacket",
  ];
  const name = names[i % names.length];
  const price = 950 + i * 125;
  // Every third dummy product gets a discount so the badge/strike-through
  // UI has something to render in local/dev without a live Contentful field.
  const discountedPrice = i % 3 === 0 ? Math.round(price * 0.85) : null;

  return {
    id: `product-${i + 1}`,
    slug: `${name.toLowerCase().replaceAll(" ", "-")}-${i + 1}`,
    name,
    nameBn: [
      "ক্লাসিক লিনেন শার্ট",
      "কটন ড্রেস",
      "মিনিমাল শোল্ডার ব্যাগ",
      "এসেনশিয়াল স্নিকার্স",
      "সফট নিট টপ",
      "মডার্ন ক্যাজুয়াল জ্যাকেট",
    ][i % 6],
    description: toRichText(
      "A carefully selected everyday product made for comfort, quality and modern style. Dummy product content can be replaced by Contentful."
    ),
    descriptionBn: toRichText(
      "আরাম, মান এবং আধুনিক স্টাইলের কথা মাথায় রেখে নির্বাচিত একটি পণ্য। পরে Contentful থেকে আসল তথ্য ব্যবহার করা যাবে।"
    ),
    price,
    discountedPrice,
    images: [image],
    categoryId: categories[i % categories.length].id,
    categoryName: categories[i % categories.length].name,
    categoryNameBn: categories[i % categories.length].nameBn,
  };
});