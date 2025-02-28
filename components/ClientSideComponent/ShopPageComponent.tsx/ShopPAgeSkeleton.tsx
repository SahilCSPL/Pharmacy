export default function ShopPageSkeleton() {
    return (
      <div className="flex flex-wrap lg:mx-[20px] mt-5 max-w-8xl p-4" aria-busy="true" aria-label="Loading products">
        {/* Desktop Sidebar Skeleton */}
        <div className="hidden md:block md:w-1/3 lg:w-1/4 xl:w-1/5 pr-4">
          <div className="h-10 bg-gray-300 rounded-lg mb-3 animate-pulse"></div>
          <div className="bg-white h-[700px] rounded-lg p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="mb-4">
                <div className="h-8 bg-gray-200 rounded-md w-full mb-2 animate-pulse"></div>
                {index === 0 && (
                  <div className="pl-4 mt-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mb-2">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
  
        {/* Product Grid Skeleton */}
        <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 md:pl-4">
          <div className="flex justify-between items-center pb-4">
            <div className="block md:hidden w-1/2">
              <div className="h-10 bg-gray-300 rounded-md animate-pulse"></div>
            </div>
            <div className="w-1/2 flex justify-end">
              <div className="h-10 w-[180px] bg-gray-300 rounded-md animate-pulse"></div>
            </div>
          </div>
  
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 h-[700px] bg-white rounded-lg p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="mb-3 animate-pulse">
                <div className="aspect-square bg-gray-300 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  