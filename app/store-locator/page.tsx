import StoreLocator from "@/components/ClientSideComponent/StoreLocator/StoreLocator";

export default function StoreLocatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner with heading */}
      <div
        className="h-[300px] md:h-[400px] bg-cover bg-center py-5 lg:py-10 flex justify-center items-center flex-col"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/background/store-locator-banner-3.jpg)",
        }}
      >
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">Find Our Stores</h1>
        <p className="text-white text-center px-4">
          Locate our stores across India and get directions to visit us
        </p>
      </div>
      <div className="max-w-7xl mx-auto py-8 md:x-4 ">
        <StoreLocator />
      </div>
    </div>
  )
}

