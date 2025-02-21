import React from "react";

interface UserData {
  first_name: string | undefined;
  last_name: string | undefined;
  email: string | undefined;
}

interface ProfileHeaderProps {
  user: UserData;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[--textColor]">Account</h1>
      <p className="mt-1 text-sm sm:text-base md:text-lg text-[#6b7280]">
        <span className="text-base sm:text-lg md:text-xl text-[--textColor]">
          {user.first_name ?? "First Name"} {user.last_name ?? "Last Name"},
        </span>{" "}
        {user.email}
      </p>
    </div>
  );
}
