"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Category, ChildCategory } from "../../ShopPageComponent.tsx/type"

interface OurCategoryClientProps {
  categories: Category[]
}

export function SubCategoryTab({ categories }: OurCategoryClientProps) {
  const [activeTabId, setActiveTabId] = useState<string>(categories.length > 0 ? categories[0].id : "")

  // Find the active category based on the activeTabId
  const activeCategory = categories.find((category) => category.id === activeTabId)

  if (!categories || categories.length === 0) {
    return (
      <section className="container mx-auto py-4 lg:py-5" id="our-category">
        <div className="container mx-auto">
          <div>
            <h2 className="text-[20px] lg:text-[35px] text-[--textColor] text-center font-bold">
              Explore Our Categories
            </h2>
            <p className="text-center text-gray-500 mt-4">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto py-4 lg:py-5" id="our-category">
      <div className="container mx-auto">
        <div>
          <h2 className="text-[20px] lg:text-[35px] text-[--textColor] text-center font-bold">
            Explore Our Categories
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-nowrap border-b lg:justify-center overflow-x-auto hiddenScrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`p-4 text-sm lg:text-base xl:text-xl font-semibold focus:outline-none transition duration-300 ease-in-out 
                ${
                  activeTabId === category.id
                    ? "text-[--mainColor] border-b-[3px] border-[--mainColor]"
                    : "text-[--textColor] hover:text-[--mainColor]"
                }
              `}
              onClick={() => setActiveTabId(category.id)}
              aria-selected={activeTabId === category.id}
              role="tab"
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4 flex flex-wrap lg:flex-no-wrap">
          {/* Right Column: Subcategories Display */}
          <div className="w-full">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap">
                {activeCategory && activeCategory.child_categories && activeCategory.child_categories.length > 0 ? (
                  activeCategory.child_categories.map((subCat: ChildCategory) => (
                    <div key={subCat.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
                      <Link href={`/shop/?category=${subCat.id}`}>
                        <div className="border p-4 rounded-lg text-center hover:shadow-md transition-all duration-300">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${subCat.image}`}
                            alt={subCat.name}
                            width={300}
                            height={300}
                            className="object-cover rounded-md h-40 w-full mb-2"
                          />
                          <p className="font-semibold">{subCat.name}</p>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 w-full text-center py-8">No subcategories available for this category.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

