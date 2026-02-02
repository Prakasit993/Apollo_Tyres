"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().optional(),
  brand: z.string().optional(),
  width: z.string().optional(),
  aspectRatio: z.string().optional(),
  rim: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

export async function filterProducts(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  // Construct query params
  const params = new URLSearchParams();

  if (data.query) params.set("q", data.query as string);
  if (data.brand && data.brand !== "All Brands") params.set("brand", data.brand as string);
  if (data.width && data.width !== "Any") params.set("width", data.width as string);
  if (data.aspect && data.aspect !== "Any") params.set("aspect", data.aspect as string);
  if (data.rim && data.rim !== "Any") params.set("rim", data.rim as string);
  if (data.minPrice) params.set("min", data.minPrice as string);
  if (data.maxPrice) params.set("max", data.maxPrice as string);
  if (data.carModel && data.carModel !== "") params.set("car", data.carModel as string);

  // Redirect to products page with search params
  // If we are already on products page, this will trigger a refresh with new params
  // Ideally, this should be used by the sidebar <form> directly.
  redirect(`/products?${params.toString()}`);
}

export async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const supabase = await createClient();

  let query = supabase.from("tyres_products").select("*").gt('stock', 0);

  const q = searchParams.q as string;
  const brand = searchParams.brand as string;
  const width = searchParams.width as string;
  const aspect = searchParams.aspect as string;
  const rim = searchParams.rim as string;

  if (q) {
    // Simple mock search or basic ILIKE
    query = query.ilike("model", `%${q}%`); // Search model only for now
  }
  if (brand) query = query.eq("brand", brand);
  if (width) query = query.eq("width", width);
  if (aspect) query = query.eq("aspect_ratio", aspect);
  if (rim) query = query.eq("rim", rim);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data;
}

export async function getProduct(idOrSlug: string) {
  const supabase = await createClient();

  // Check if it's a valid UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

  let query = supabase.from("tyres_products").select("*");

  if (isUUID) {
    query = query.eq("id", idOrSlug);
  } else {
    query = query.eq("slug", idOrSlug);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
}

export async function getProductVariants(brand: string, model: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tyres_products")
    .select("id, slug, width, aspect_ratio, rim, stock, price")
    .eq("brand", brand)
    .eq("model", model)
    .gt("stock", 0)
    .order("rim", { ascending: true })
    .order("width", { ascending: true });

  if (error) {
    console.error("Error fetching product variants:", error);
    return [];
  }
  return data;
}
