export default function BannerSkeleton() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
      <div className="relative z-10 container max-w-7xl mx-auto flex items-center h-full px-4">
        <div className="w-full md:w-1/2">
          <div className="h-6 w-48 bg-gray-300 rounded animate-pulse mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-8 bg-gray-300 rounded animate-pulse mb-2 ${
                i === 0
                  ? "w-full sm:w-3/4"
                  : i === 1
                  ? "w-5/6 sm:w-2/3"
                  : "w-4/6 sm:w-1/2"
              }`}
            ></div>
          ))}
          <div className="h-10 w-32 bg-gray-300 rounded-full animate-pulse mt-4"></div>
        </div>
      </div>
    </div>
  );
}
