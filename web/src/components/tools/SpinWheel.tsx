"use client";

import { useState, useRef, useEffect } from "react";
import {
  ListPlus,
  Play,
  Square,
  Timer,
  Trash2,
  RotateCcw
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function SpinWheel() {
  const { t } = useLanguage();
  const [itemsText, setItemsText] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [autoStopSeconds, setAutoStopSeconds] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentSpeedRef = useRef(0);

  // Parse items from text
  const getItems = (): string[] => {
    if (!itemsText.trim()) return [];

    const normalized = itemsText
      .replace(/[,，;；、]/g, "\n")
      .split("\n")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    return Array.from(new Set(normalized));
  };

  const items = getItems();

  // Generate colors for wheel segments
  const segmentColors = [
    "#F97316", // orange
    "#3B82F6", // blue
    "#22C55E", // green
    "#EAB308", // yellow
    "#EC4899", // pink
    "#8B5CF6", // purple
    "#14B8A6", // teal
    "#F43F5E", // rose
  ];

  // Calculate which item is selected based on rotation
  const getSelectedItem = (currentRotation: number): string | null => {
    if (items.length === 0) return null;

    const segmentAngle = 360 / items.length;
    // Normalize rotation to 0-360
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    // The pointer is at top (0 degrees), so we need to find which segment is there
    // Wheel rotates clockwise, so we subtract from 360
    const pointerAngle = (360 - normalizedRotation + segmentAngle / 2) % 360;
    const selectedIndex = Math.floor(pointerAngle / segmentAngle) % items.length;

    return items[selectedIndex];
  };

  // Start spinning
  const startSpin = () => {
    if (items.length < 2) return;

    setIsSpinning(true);
    setResult(null);
    currentSpeedRef.current = 20 + Math.random() * 10; // Random initial speed

    // Start spinning animation
    spinIntervalRef.current = setInterval(() => {
      setRotation(prev => prev + currentSpeedRef.current);
    }, 16); // ~60fps

    // Set up auto-stop if configured
    if (autoStopSeconds > 0) {
      setCountdown(autoStopSeconds);

      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      autoStopTimeoutRef.current = setTimeout(() => {
        stopSpin();
      }, autoStopSeconds * 1000);
    }
  };

  // Stop spinning (with deceleration)
  const stopSpin = () => {
    // Clear auto-stop timers
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(null);

    // Start deceleration
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }

    const decelerate = () => {
      currentSpeedRef.current *= 0.98; // Slow down gradually

      if (currentSpeedRef.current < 0.5) {
        // Stop completely
        setIsSpinning(false);
        setRotation(prev => {
          const finalRotation = prev;
          const selected = getSelectedItem(finalRotation);
          setResult(selected);
          return finalRotation;
        });
        return;
      }

      setRotation(prev => prev + currentSpeedRef.current);
      requestAnimationFrame(decelerate);
    };

    decelerate();
  };

  // Handle spin button click
  const handleSpinClick = () => {
    if (isSpinning) {
      stopSpin();
    } else {
      startSpin();
    }
  };

  // Reset
  const handleReset = () => {
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setIsSpinning(false);
    setRotation(0);
    setResult(null);
    setCountdown(null);
  };

  // Clear all
  const handleClearAll = () => {
    handleReset();
    setItemsText("");
    setAutoStopSeconds(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // Render wheel segments as SVG
  const renderWheel = () => {
    if (items.length === 0) {
      return (
        <div className="w-full h-full rounded-full bg-gray-200 border-4 border-black flex items-center justify-center">
          <p className="text-gray-400 font-body text-sm text-center px-4">
            {t("wheel.readyPrompt")}
          </p>
        </div>
      );
    }

    const segmentAngle = 360 / items.length;

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {items.map((item, idx) => {
          const startAngle = idx * segmentAngle - 90; // Start from top
          const endAngle = startAngle + segmentAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = 100 + 95 * Math.cos(startRad);
          const y1 = 100 + 95 * Math.sin(startRad);
          const x2 = 100 + 95 * Math.cos(endRad);
          const y2 = 100 + 95 * Math.sin(endRad);

          const largeArcFlag = segmentAngle > 180 ? 1 : 0;

          const pathD = `M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

          // Text position (middle of segment)
          const midAngle = startAngle + segmentAngle / 2;
          const midRad = (midAngle * Math.PI) / 180;
          const textX = 100 + 60 * Math.cos(midRad);
          const textY = 100 + 60 * Math.sin(midRad);

          return (
            <g key={idx}>
              <path
                d={pathD}
                fill={segmentColors[idx % segmentColors.length]}
                stroke="#000"
                strokeWidth="2"
              />
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={items.length > 8 ? "8" : items.length > 5 ? "10" : "12"}
                fontWeight="bold"
                transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                className="font-heading"
              >
                {item.length > 6 ? item.slice(0, 6) + "…" : item}
              </text>
            </g>
          );
        })}
        {/* Center circle */}
        <circle cx="100" cy="100" r="15" fill="#1F2937" stroke="#000" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Wheel Display */}
      <div className="clay-card p-8">
        <div className="flex flex-col items-center">
          {/* Pointer */}
          <div className="relative z-10 -mb-4">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-500"
                 style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" }} />
          </div>

          {/* Wheel */}
          <div
            className="w-72 h-72 relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {renderWheel()}
          </div>

          {/* Countdown display */}
          {countdown !== null && (
            <div className="mt-4 px-4 py-2 bg-yellow-100 rounded-full border-2 border-yellow-400">
              <span className="font-heading text-yellow-700 font-bold">
                {countdown} {t("wheel.autoStop")}
              </span>
            </div>
          )}

          {/* Result display */}
          {result && !isSpinning && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-black min-w-[200px]">
              <p className="text-center font-body text-sm text-text/70 mb-1">
                {t("wheel.result")}
              </p>
              <p className="text-center font-heading text-2xl font-bold text-text">
                {result}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button
              onClick={handleSpinClick}
              disabled={items.length < 2}
              className="clay-button-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSpinning ? (
                <>
                  <Square className="w-5 h-5" />
                  {t("wheel.stop")}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {t("wheel.start")}
                </>
              )}
            </button>

            {result && !isSpinning && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-black bg-white text-text font-body font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                {t("wheel.restart")}
              </button>
            )}
          </div>

          {items.length < 2 && items.length > 0 && (
            <p className="mt-4 text-red-500 font-body text-sm">
              {t("wheel.minOptions")}
            </p>
          )}
        </div>
      </div>

      {/* Items Input */}
      <div className="clay-card p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 font-body font-semibold text-text">
            <ListPlus className="w-5 h-5 text-primary" />
            {t("wheel.listTitle")}
          </label>
          <span className="font-body text-sm text-text/60">
            {t("wheel.totalPrefix")} <span className="font-semibold text-primary">{items.length}</span> {t("wheel.totalSuffix")}
          </span>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={handleClearAll}
            disabled={isSpinning || !itemsText.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-300 bg-white text-red-600 font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {t("wheel.clearAll")}
          </button>
        </div>

        <textarea
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
          placeholder={t("wheel.placeholder")}
          className="w-full h-36 px-4 py-3 rounded-xl border-2 border-primary/20 bg-white font-body text-text placeholder:text-text/40 focus:outline-none focus:border-primary resize-none"
          disabled={isSpinning}
        />
      </div>

      {/* Settings */}
      <div className="clay-card p-6">
        <p className="font-body font-semibold text-text mb-4">{t("wheel.settings")}</p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 font-body text-sm text-text/70">
            <Timer className="w-4 h-4" />
            {t("wheel.autoStopLabel")}
          </label>
          <input
            type="number"
            min={0}
            max={30}
            value={autoStopSeconds}
            onChange={(e) => setAutoStopSeconds(Math.max(0, Math.min(30, parseInt(e.target.value) || 0)))}
            className="w-20 px-4 py-2 rounded-xl border-2 border-primary/20 bg-white font-body text-text text-center focus:outline-none focus:border-primary"
            disabled={isSpinning}
          />
          <span className="font-body text-sm text-text/60">{t("wheel.autoStopHint")}</span>
        </div>
      </div>
    </div>
  );
}
