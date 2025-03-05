import React, { useState, useRef } from "react";

interface Custom360ViewProps {
  images: string[];
  width?: number;
  height?: number;
}

export default function Custom360View({
  images,
  width = 400,
  height = 400,
}: Custom360ViewProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // When the mouse button is pressed, start dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    // Prevent default to avoid unwanted selections
    e.preventDefault();
  };

  // Update the frame only if dragging is active
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    // Calculate the relative X position (0 to 1)
    const relativeX = (e.clientX - rect.left) / rect.width;
    // Determine the frame index based on the relative X value
    const frame = Math.floor(relativeX * images.length);
    setCurrentFrame(frame);
  };

  // End dragging when the mouse is released
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Also end dragging if mouse leaves the container
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ width, height, overflow: "hidden", cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={images[currentFrame]}
        alt={`360 view frame ${currentFrame}`}
        style={{ width: "100%", height: "100%", objectFit: "contain", userSelect: "none" }}
      />
    </div>
  );
}
