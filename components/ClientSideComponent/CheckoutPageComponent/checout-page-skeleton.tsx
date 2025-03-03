export default function CheckoutSkeleton() {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section Skeleton */}
          <div className="w-full md:w-2/3">
            <div className="border rounded space-y-3">
              <div className="h-14 bg-gray-300 rounded-t animate-pulse"></div>
              <div className="p-4 space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mt-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          {/* Right Section Skeleton */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="border rounded">
              <div className="h-14 bg-gray-300 rounded-t animate-pulse"></div>
              <div className="p-4 h-60 bg-gray-100 animate-pulse"></div>
            </div>
            <div className="border rounded">
              <div className="h-14 bg-gray-300 rounded-t animate-pulse"></div>
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border rounded">
              <div className="h-14 bg-gray-300 rounded-t animate-pulse"></div>
              <div className="p-4 h-12 bg-gray-100 animate-pulse"></div>
            </div>
            <div className="h-14 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }
  
  