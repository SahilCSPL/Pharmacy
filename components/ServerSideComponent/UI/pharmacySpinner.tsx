export function PharmacySpinner() {
  return (
    <div className="flex justify-center items-center" role="status">
      <div className="relative w-24 h-12">
        <div className="absolute w-full h-full rounded-full bg-blue-500 opacity-75 animate-ping"></div>
        <div className="relative w-full h-full bg-white border-4 border-blue-500 rounded-full flex justify-center items-center">
          <div className="w-1/2 h-1/2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
