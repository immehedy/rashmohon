import { createClient } from "contentful";
import { products as dummyProducts, categories as dummyCategories } from "./data";
import type { Product, Category } from "./types";

const client =
  process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN
    ? createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      })
    : null;

export async function getProducts(): Promise<Product[]> {
  if (!client) return dummyProducts;

  try {
    const result = await client.getEntries<any>({
      content_type: "product",
      include: 2,
    });

    return result.items.map((item: any) => ({
      id: item.sys.id,
      slug: item.fields.slug,
      name: item.fields.name,
      nameBn: item.fields.nameBn ?? "",
      description: item.fields.description ?? "",
      descriptionBn: item.fields.descriptionBn ?? "",
      price: Number(item.fields.price ?? 0),
      image: item.fields.image?.fields?.file?.url
        ? `https:${item.fields.image.fields.file.url}`
        : dummyProducts[0].image,
      categoryId: item.fields.category?.sys?.id ?? "",
      categoryName: item.fields.category?.fields?.name ?? "",
      categoryNameBn: item.fields.category?.fields?.nameBn ?? "",
    }));
  } catch {
    return dummyProducts;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!client) return dummyCategories;

  try {
    const result = await client.getEntries<any>({ content_type: "category" });

    return result.items.map((item: any) => ({
      id: item.sys.id,
      name: item.fields.name,
      nameBn: item.fields.nameBn ?? "",
      slug: item.fields.slug,
      image: item.fields.image?.fields?.file?.url
        ? `https:${item.fields.image.fields.file.url}`
        : dummyCategories[0].image,
    }));
  } catch {
    return dummyCategories;
  }
}

export async function getProductBySlug(slug: string) {
  const all = await getProducts();
  return all.find((product) => product.slug === slug);
}

export async function getRelatedProducts(product: Product) {
  const all = await getProducts();

  return all
    .filter(
      (p) =>
        p.categoryId === product.categoryId &&
        p.id !== product.id
    )
    .slice(0, 12);
}
