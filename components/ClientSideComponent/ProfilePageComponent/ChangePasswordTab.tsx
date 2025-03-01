"use client";

import { resetPassword, sendOtp, verifyOtp } from "@/api/loginPageApi";
import React, { useState, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StepIndicator, { Step } from "./StepIndicatorToResetPassword"; // Adjust the path as needed
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePasswordTab() {
  // Step tracking
  const [currentStep, setCurrentStep] = useState<Step>("sendOtp");

  // Form fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error state for inline error messages
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  // New state for toggling password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use consistent styling for inputs and buttons
  const inputClasses =
    "w-full p-2 border rounded-md text-black focus:ring-1 focus:ring-[--mainColor] outline-none mb-1";
  const buttonClasses =
    "bg-[--mainColor] text-white py-2 rounded-md hover:bg-[--mainHoverColor] transition px-5";

  // Clear all inline errors
  const clearErrors = () => {
    setEmailError("");
    setOtpError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
  };

  const userEmail = useSelector((state: RootState) => state.user.email);

  // Step 1: Send OTP handler
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Compare with email from Redux store
    if (userEmail && email.toLowerCase() !== userEmail.toLowerCase()) {
      setEmailError("Entered email does not match your registered email.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(email);
      console.log("API response:", res);
      // Check for an error message in the API response
      if (res.message === "User not found or not active") {
        toast.error(res.message);
        return;
      }
      toast.success(res.message || "OTP has been sent to your email.");
      setCurrentStep("verifyOtp");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(error.message || "Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP handler
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!otp) {
      setOtpError("OTP is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      console.log("OTP API response:", res);
      // Check for an error message that indicates an invalid OTP
      if (res.message === "Invalid OTP") {
        setOtpError("Invalid OTP. Please try again.");
        toast.error("Invalid OTP. Please try again.");
        return;
      }
      toast.success(res.message || "OTP verified successfully.");
      setCurrentStep("resetPassword");
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error.message || "Error verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password handler
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!newPassword) {
      setNewPasswordError("New password is required.");
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your new password.");
    }
    if (!newPassword || !confirmPassword) {
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(email, otp, newPassword, confirmPassword);
      toast.success(res.message || "Password reset successfully.");
      setCurrentStep("success");
    } catch (error: any) {
      toast.error(error.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for going back after success (or restarting the flow)
  const handleGoBack = () => {
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    clearErrors();
    setCurrentStep("sendOtp");
  };

  return (
    <div className="space-y-6 text-[--textColor] md:w-8/12 lg:w-6/12 mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Update Your Password
      </h2>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Success Screen */}
      {currentStep === "success" && (
        <div className="text-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-5xl text-green-500 mx-auto"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M9 12l2 2l4-4" />
          </svg>
          <p className="text-xl font-semibold">Password Reset Successful!</p>
          {/* <button onClick={handleGoBack} className={buttonClasses}>
              Go Back
              </button> */}
        </div>
      )}

      {/* Step 1: Send OTP */}
      {currentStep === "sendOtp" && (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              placeholder="Enter your email"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>
          <button type="submit" disabled={loading} className={buttonClasses}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {currentStep === "verifyOtp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={inputClasses}
              placeholder="Enter OTP"
            />
            {otpError && (
              <p className="text-red-500 text-xs mt-1">{otpError}</p>
            )}
          </div>
          <button type="submit" disabled={loading} className={buttonClasses}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}

      {/* Step 3: Reset Password */}
      {currentStep === "resetPassword" && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${inputClasses} pr-10`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? (
                  <FaEyeSlash className="w-5 h-5" />
                ) : (
                  <FaEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {newPasswordError && (
              <p className="text-red-500 text-xs mt-1">{newPasswordError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClasses} pr-10`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="w-5 h-5" />
                ) : (
                  <FaEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-red-500 text-xs mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>
          <button type="submit" disabled={loading} className={buttonClasses}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
}
