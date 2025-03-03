"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { saveAddresses } from "@/redux/userSlice";
import { getCustomerAddresses } from "@/api/ProfilePageApi";
import ProfileHeader from "@/components/ServerSideComponent/ProfilePageComponent/ProfileHeader";
import ProfileTabs from "@/components/ServerSideComponent/ProfilePageComponent/ProfileTab";
import AccountInfoTab from "./AccountInfoTab";
import OrderInfoTab from "@/components/ServerSideComponent/ProfilePageComponent/OrderInfoTab";
// import CartInfoTab from "@/components/ServerSideComponent/ProfilePageComponent/CartInfoTab";
import WishlistInfoTab from "@/components/ServerSideComponent/ProfilePageComponent/WishlistInfoTab";
import ChangePasswordTab from "./ChangePasswordTab";
import AddressInfoTab from "./AddressInfoTab";
import { useRouter, useSearchParams } from "next/navigation";

// Update the interface to allow for undefined fields (matching your Redux slice)
interface UserData {
  id: number | undefined;
  token: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  email: string | undefined;
  phone_number: string | undefined;
  profile_picture: string | undefined;
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  // Get the "tab" query parameter (if provided)
  const queryTab = searchParams.get("tab");
const router = useRouter();
  // Fetch user data from Redux store
  const user: UserData = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (user.token && user.id) {
      getCustomerAddresses(user.id, user.token)
        .then((response) => {
          console.log(response);
          // Assuming the API returns an object with an addresses field
          dispatch(saveAddresses({ addresses: response.addresses }));
        })
        .catch((error) => {
          console.error("Error fetching addresses:", error);
          router.push("/user-login");
        });
    } else {
      router.push("/user-login")
    }
  }, [user.token, user.id, dispatch]);

  // Manage tab state; default to "accountInfo"
  const [activeTab, setActiveTab] = useState("accountInfo");

  // If there's a query parameter for the tab, update the active tab accordingly
  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  return (
    <div className="bg-white px-4 py-8">
      <div className="w-full md:max-w-4xl mx-auto">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Tab Navigation */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="bg-[white] border-[1px] rounded-lg p-6 mt-5">
          {activeTab === "accountInfo" && <AccountInfoTab user={user} />}
          {activeTab === "manageAddress" && <AddressInfoTab />}
          {activeTab === "orderInfo" && <OrderInfoTab />}
          {/* {activeTab === "cartInfo" && <CartInfoTab />} */}
          {activeTab === "wishlistInfo" && <WishlistInfoTab />}
          {activeTab === "changePassword" && <ChangePasswordTab />}
        </div>
      </div>
    </div>
  );
}
