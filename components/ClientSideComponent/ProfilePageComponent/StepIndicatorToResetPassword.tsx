"use client";

import React from "react";

export type Step = "sendOtp" | "verifyOtp" | "resetPassword" | "success";

interface StepIndicatorProps {
  currentStep: Step;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  // Define the order of steps
  const stepsOrder: Step[] = [
    "sendOtp",
    "verifyOtp",
    "resetPassword",
    "success",
  ];

  // Check if a given step is completed
  const isStepCompleted = (step: Step) => {
    return stepsOrder.indexOf(currentStep) > stepsOrder.indexOf(step);
  };

  // Determine circle color based on current step or if the step is completed
  const getCircleColor = (step: Step) => {
    if (currentStep === step || isStepCompleted(step)) {
      return "bg-blue-600";
    }
    return "bg-gray-300";
  };

  // Determine connector color (if the previous step is completed)
  const getConnectorColor = (from: Step) => {
    if (isStepCompleted(from)) {
      return "bg-blue-600";
    }
    return "bg-gray-300";
  };

  return (
    <div className="max-w-[400px] mx-auto mb-6">
      <div className="flex items-center justify-between">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg transition-colors ${getCircleColor(
              "sendOtp"
            )}`}
          >
            {isStepCompleted("sendOtp") ? (
              <i className="fas fa-check"></i>
            ) : (
              "1"
            )}
          </div>
          <span className="text-xs mt-1 w-10 text-center">Send OTP</span>
        </div>

        {/* Connector */}
        <div
          className={`flex-1 h-1 transition-colors ${getConnectorColor(
            "sendOtp"
          )} mb-[30px]`}
        ></div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg transition-colors ${getCircleColor(
              "verifyOtp"
            )}`}
          >
            {isStepCompleted("verifyOtp") ? (
              <i className="fas fa-check"></i>
            ) : (
              "2"
            )}
          </div>
          <span className="text-xs mt-1 w-10 text-center">Verify OTP</span>
        </div>

        {/* Connector */}
        <div
          className={`flex-1 h-1 transition-colors ${getConnectorColor(
            "verifyOtp"
          )} mb-[30px]`}
        ></div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg transition-colors ${getCircleColor(
              "resetPassword"
            )}`}
          >
            {isStepCompleted("resetPassword") ? (
              <i className="fas fa-check"></i>
            ) : (
              "3"
            )}
          </div>
          <span className="text-xs mt-1 w-10 text-center">Reset Password</span>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
