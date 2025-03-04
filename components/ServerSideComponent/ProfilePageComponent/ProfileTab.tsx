import React from "react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileTabs({
  activeTab,
  setActiveTab,
}: ProfileTabsProps) {
  const tabs = [
    { key: "accountInfo", label: "Account Info" },
    { key: "manageAddress", label: "Manage Address" },
    { key: "orderInfo", label: "Order Info" },
    // { key: "cartInfo", label: "Cart info" },
    { key: "wishlistInfo", label: "Wishlist Info" },
    { key: "changePassword", label: "Change Password" },
  ];

  return (
    <ul role="tablist" className="flex overflow-x-auto md:overflow-x-0 hiddenScrollbar border-b border-t justify-start space-x-10">
      {tabs.map((tab) => (
        <li
          key={tab.key}
          role="tab"
          aria-selected={activeTab === tab.key}
          tabIndex={0}
          className={`cursor-pointer py-5 flex-shrink-0 text-sm lg:text-base xl:text-lg focus:outline-none transition duration-300 ease-in-out ${
            activeTab === tab.key
              ? "text-[--mainColor] border-b-[3px] border-[--mainColor]"
              : "text-[--textColor] hover:text-[--mainColor]"
          }`}
          onClick={() => setActiveTab(tab.key)}

        >
          {tab.label}
        </li>
      ))}
    </ul>
  );
}
