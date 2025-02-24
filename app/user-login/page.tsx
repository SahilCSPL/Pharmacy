"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { loginCustomer } from "@/api/loginPageApi";
import { setUser } from "@/redux/userSlice";
import HeaderLogo from "@/components/ServerSideComponent/HeaderComponent/HeaderLogo";
import { setCart } from "@/redux/cartSlice";
import { getCart } from "@/api/cartPageApi";

interface LoginResponse {
  token?: string;
  message?: string;
  id?: number;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  profile_picture?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data: LoginResponse = await loginCustomer(username, password);
      if (data?.token) {
        dispatch(
          setUser({
            token: data.token,
            id: data.id || undefined,
            first_name: data.first_name || undefined,
            last_name: data.last_name || undefined,
            phone_number: data.phone_number || undefined,
            email: data.email || undefined,
            profile_picture: data.profile_picture || undefined,
          })
        );

        try {
          const cartData = await getCart(data.id!, data.token);
          if (cartData && cartData.products) {
            // Map the backend cart data to match our Redux cart state shape.
            const cartItems = cartData.products.map((product) => ({
              id: product.id.toString(),
              quantity: product.quantity,
              image: product.image,
              price: product.price,
              name: product.name,
            }));
            const totalItems = cartItems.length;
            const totalQuantity = cartItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            dispatch(setCart({ cartItems, totalItems, totalQuantity }));
          }
        } catch (cartError) {
          console.error("Error fetching backend cart:", cartError);
          // Optionally, you can notify the user that cart sync failed.
        }


        router.push("/");
      } else {
        setError(data?.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#e0f6ff17] container mx-auto min-h-[85vh]">
      <div className="flex items-center justify-center min-h-[85vh]">
        <div className="w-full lg:w-5/12">
          <div className="w-[400px] mx-auto px-5 md:px-0">
            <HeaderLogo />
            <h2 className="text-2xl font-semibold mb-6 text-[--textColor] mt-10 text-center md:text-start">
              Welcome! Please Login to continue
            </h2>

            {error && (
              <div className="text-red-500 bg-red-100 p-2 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="mb-4">
                <input
                  type="email"
                  className="w-full p-2 border rounded-md text-black focus:ring-1 focus:ring-[--mainColor] outline-none placeholder-{--textColor}"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  className="w-full p-2 border rounded-md text-black focus:ring-1 focus:ring-[--mainColor] outline-none"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-[--mainColor] text-white py-2 rounded-md hover:bg-[--mainHoverColor] transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="flex justify-start mt-4">
              <p className="text-gray-600">
                New user?{" "}
                <button
                  onClick={() => router.push("/user-registration")}
                  className="text-[--mainColor] hover:underline"
                >
                  Sign up
                </button>
              </p>

              <p className="text-gray-600 hidden">
                <button
                  onClick={() => router.push("/reset-password")}
                  className="text-[--mainColor] hover:underline"
                >
                  Forgot Password?
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Swiper Slider Section */}
        <div className="slider hidden lg:block w-7/12">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{ delay: 10000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            className="h-[85vh] w-full"
          >
            <SwiperSlide>
              <div className="flex items-center justify-center h-full w-full">
                <div>
                  <img
                    src="/background/login-slider-1.png"
                    alt="Slide 1"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="flex items-center justify-center">
              <div className="flex items-center justify-center h-full w-full">
                <div>
                  <img
                    src="/background/login-slider-2.png"
                    alt="Slide 2"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
