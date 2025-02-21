"use client";

import { APICore } from "@/api/APICore";
import { setUser } from "@/redux/userSlice";
import React, { useState, FormEvent, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

// Update the interface to include an email field
interface UserData {
  id?: number;
  first_name: string | undefined;
  last_name: string | undefined;
  phone_number: string | undefined; // Keep it as string
  profile_picture: string | undefined;
  email: string | undefined;
  token: string | undefined;
}

interface AccountInfoTabProps {
  user: UserData;
}

export default function AccountInfoTab({ user }: AccountInfoTabProps) {
  // Local state for editable fields with fallbacks
  const [firstName, setFirstName] = useState(user.first_name ?? "");
  const [lastName, setLastName] = useState(user.last_name ?? "");
  // Convert phone number to string for input if defined
  const [phoneNumber, setPhoneNumber] = useState(
    user.phone_number !== undefined ? user.phone_number.toString() : ""
  );
  const [profilePicture, setProfilePicture] = useState(
    user.profile_picture ?? ""
  );
  // Email is non-editable so we do not need to update it
  const [email] = useState(user.email ?? "");

  // Track whether we are in editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  // Function to handle the PATCH update call
  // Inside the handleAccountInfoSubmit function
  // Inside the handleAccountInfoSubmit function
  const handleAccountInfoSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    // Prepare the data to update
    const updatedData = {
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber, // Optionally, convert this to a number if needed
      profile_picture: profilePicture,
      email: email,
    };

    try {
      // Retrieve token (adjust this to match your authentication)
      const data = await APICore<{ success: boolean }>(
        "/user/edit-profile/",
        "PATCH",
        updatedData,
        user.token
      );

      // Dispatch action to update the Redux store with the updated user data
      dispatch(
        setUser({
          ...user, // Spread the existing user state to retain other data
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          profile_picture: profilePicture,
          email: email,
        })
      );

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      alert("Error updating profile");
      console.error(error);
    }
  };

  // Only allow file input when editing
  const handleEditPictureClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  // Display a preview of the new profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
      // In a real app, you might upload the file here.
    }
  };

  return (
    <div className="space-y-6 text-[--textColor]">
      {/* Header with title and Edit/Update button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg lg:text-xl font-semibold md:mb-4">Account Information</h2>
        <button
          onClick={() => {
            if (isEditing) {
              // When editing, clicking Update submits the form
              handleAccountInfoSubmit();
            } else {
              setIsEditing(true);
            }
          }}
          className="bg-[--mainColor] text-white py-2 rounded-md hover:bg-[--mainHoverColor] transition px-5"
        >
          {isEditing ? "Update" : "Edit"}
        </button>
      </div>

      <form
        onSubmit={handleAccountInfoSubmit}
        className="space-y-6 account-form"
      >
        <div className="block md:flex md:space-x-4">
          {/* Profile Picture Section */}
          <div className="w-full md:w-1/3 mb-[30px] md:mb-none">
            <div className="relative w-40 h-40 mx-auto rounded-full bg-gray-100 overflow-hidden">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500">
                  No Image
                </div>
              )}
              {/* Overlay (only clickable when editing) */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 transition ${
                  isEditing ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={handleEditPictureClick}
              >
                {isEditing && (
                  <>
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path
                        d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <span className="text-white text-sm">Edit</span>
                  </>
                )}
              </div>
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Account Information Fields */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="flex space-x-3">
              <div className="w-1/2">
                <label className="block text-sm mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md text-black focus:ring-1 focus:ring-[--mainColor] outline-none"
                  placeholder="Enter first name"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md text-black focus:ring-1 focus:ring-[--mainColor] outline-none"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={!isEditing}
                className="w-full p-2 border rounded-md text-black focus:ring-1 focus:ring-[--mainColor] outline-none"
                placeholder="(123) 456-7890"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-2 border rounded-md text-black bg-gray-100 cursor-not-allowed"
                placeholder="Email address"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
