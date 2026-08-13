export type Locale = "en" | "bn";

export type Product = {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  price: number;
  image: string;
  categoryId: string;
  categoryName: string;
  categoryNameBn: string;
};

export type Category = {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  image: string;
};

export type CartItem = Product & {
  quantity: number;
};
