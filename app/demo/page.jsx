"use client"

import { useEffect } from 'react';

export default function demo() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.72/build/spline-viewer.js';
    document.head.appendChild(script);
  }, []);

  return (
    <main>
      <h1>My Spline Scene</h1>
      <spline-viewer url="https://prod.spline.design/6YsFi9J01IxLUOXB/scene.splinecode"></spline-viewer>
    </main>
  );
}
