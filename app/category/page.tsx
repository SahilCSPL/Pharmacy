"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAllCategories, getCategoryWiseProducts } from "@/api/ShopPageApi";
import type {
  Category,
  Product,
} from "@/components/ClientSideComponent/ShopPageComponent.tsx/type";
import Breadcrumb from "@/components/ClientSideComponent/CategoryPageComponent/Breadcrumb";
import CategoryBanner from "@/components/ClientSideComponent/CategoryPageComponent/CategoryBanner";
import CategorySidebar from "@/components/ClientSideComponent/CategoryPageComponent/CategorySidebar";
import SubCategorySlider from "@/components/ClientSideComponent/CategoryPageComponent/SubCategorySlider";
import ProductGrid from "@/components/ClientSideComponent/CategoryPageComponent/ProductGrid";
export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id");

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesData = await getAllCategories();
        setAllCategories(categoriesData.product_categories);
        if (categoryId) {
          const selectedCategory = categoriesData.product_categories.find(
            (cat) => cat.id == categoryId
          );
          setCategory(selectedCategory || null);
          if (
            selectedCategory &&
            selectedCategory.child_categories &&
            selectedCategory.child_categories.length > 0
          ) {
            // Main category: fetch products for each subcategory
            const productsPromises = selectedCategory.child_categories.map(
              (subCat) =>
                getCategoryWiseProducts(subCat.id.toString()).then((data) => {
                  console.log(`Products for subcategory ${subCat.id}:`, data);
                  return data;
                })
            );

            const productsResponses = await Promise.all(productsPromises);

            const combinedProducts = productsResponses.reduce(
              (acc, response) => acc.concat(response.products || []),
              [] as Product[]
            );
            setProducts(combinedProducts);
            console.log("products : ", combinedProducts);
          } else {
            // Subcategory or no child categories: fetch directly
            const productsData = await getCategoryWiseProducts(categoryId);
            setProducts(productsData.products);
          }
        }
        setLoading(false);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    }
    fetchData();
  }, [categoryId]);

  const handleSubCategoryClick = async (subCategoryId: string) => {
    try {
      setLoading(true);
      const productsData = await getCategoryWiseProducts(subCategoryId);
      setProducts(productsData.products);
      setLoading(false);
    } catch (error) {
      setError("Error fetching products. Please try again later.");
      setLoading(false);
    }
  };

//   if (loading) return<LoadingSpinner />;
  if (error) return <div>{error}</div>;
  if (!category) return <div>Category not found{categoryId}</div>;

  return (
    <section>
      <CategoryBanner category={category} />
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb category={category} />
        <div className="flex flex-col md:flex-row gap-8 mt-4 border">
          <div className="w-full">
            <SubCategorySlider
              subCategories={category.child_categories}
              onSubCategoryClick={handleSubCategoryClick}
            />
            <ProductGrid products={products} />
          </div>
        </div>
        {/* <div className="md:w-1/4">
          <CategorySidebar
            categories={allCategories}
            currentCategoryId={categoryId || ""}
          />
        </div> */}
      </div>
    </section>
  );
}
