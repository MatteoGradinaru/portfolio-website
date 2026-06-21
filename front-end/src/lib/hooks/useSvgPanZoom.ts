"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";

interface PanZoomOptions {
  minScale?: number;
  maxScale?: number;
  zoomFactor?: number;
  dragFactor?: number;
}

export function useSvgPanZoom(options: PanZoomOptions = {}) {
  const { minScale = 0.5, maxScale = 2.5, zoomFactor = 0.05 } = options;

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Wheel zoom handling
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          setScale((prev) => Math.min(prev + zoomFactor, maxScale));
        } else {
          setScale((prev) => Math.max(prev - zoomFactor, minScale));
        }
      }
    };

    svgEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      svgEl.removeEventListener("wheel", handleWheel);
    };
  }, [maxScale, minScale, zoomFactor]);

  // Fullscreen escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // Mouse Drag Events
  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Only left click drag
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.15, maxScale));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.15, minScale));
  const resetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return {
    scale,
    setScale,
    pan,
    setPan,
    isDragging,
    isFullscreen,
    setIsFullscreen,
    svgRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
