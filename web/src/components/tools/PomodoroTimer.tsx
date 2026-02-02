"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Briefcase,
  Settings,
  Volume2,
  VolumeX,
  SkipForward
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type TimerMode = "work" | "break";

export default function PomodoroTimer() {
  const { t } = useLanguage();
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [rounds, setRounds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleAN0zdK4gDIZMo3Y57BvFgpEoNvYlUULHnzU7K5hBQBWqNvNdCQHLYTP7JlRAAVLotTBZh0IJ3rR7pREAAtXqNi7XhQMLnzP6osxBhNcqNayUQwRNIPO5HkkBh9gqNamRwsYO4XM3mgdCidoq9WaOwofQ4nI1VYTDzJvr9OOLwoqTY3Dyz4HDj51ss2CLQouVI+9wjEGEEJ8t8d0IQkyXJO5tjQIDUuCvMNnGQ08ZJq2qSwIFVOIwb5bEhFEa5+xnSQKHV2OxbZODhdNdaSpkRsNJmmUyKtCChxYf6meiRQRMHOdz6A2CCNkiKqTew8YPX2l0pAqBylwk6yFaQwcSoWrzn8fCzh+pNN+FgpBia3HbBEOQoqvwWgOEUqOtLtfDBRTlbu0UgoYXZ6/rUYIHmqmxaQ6ByZzsMibLgYwd7jLkCMGOn/C0oAXBkWJ0NJtDQpTmN7Yax0FHEh3yMhEBBJDdMS+OwMQOmu9tDQEDjRltqktAwswY6+dJgULKF2kkyMHCCNWmogeBwggT5F9GggJGUeGcBQKCxQ9emUQCwsRNW5aDA0MDSxhTwoPCgokVEQIDwgHHUk6Bg8HBhZALwUOBgUSNiQEDAUFDy0bBA0EBA0kFAQMBAQLHg4EDQMDCRkKBA0CAwcVBwQNAgIGEgUEDQECBQ8EBA0BAQQNAwQNAQEDCwIEDQEBAwkBBA4BAQIHAQQOAQEBCAEEDQIBAQYBBQ0BAQEFAQQNAQEBBAMFDQEBAQQDBA0BAQEEA");

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Play notification sound
  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore audio play errors
      });
    }
  }, [soundEnabled]);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    playSound();

    if (mode === "work") {
      setRounds(prev => prev + 1);
      setMode("break");
      setTimeLeft(breakMinutes * 60);
    } else {
      setMode("work");
      setTimeLeft(workMinutes * 60);
    }

    setIsRunning(false);
  }, [mode, breakMinutes, workMinutes, playSound]);

  // Timer tick
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleTimerComplete]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const getProgress = (): number => {
    const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  // Start/Pause timer
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "work" ? workMinutes * 60 : breakMinutes * 60);
  };

  // Skip to next mode
  const skipToNext = () => {
    setIsRunning(false);
    if (mode === "work") {
      setRounds(prev => prev + 1);
      setMode("break");
      setTimeLeft(breakMinutes * 60);
    } else {
      setMode("work");
      setTimeLeft(workMinutes * 60);
    }
  };

  // Apply settings
  const applySettings = (newWork: number, newBreak: number) => {
    setWorkMinutes(newWork);
    setBreakMinutes(newBreak);
    if (!isRunning) {
      setTimeLeft(mode === "work" ? newWork * 60 : newBreak * 60);
    }
    setShowSettings(false);
  };

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className={`clay-card p-8 transition-colors ${
        mode === "work" ? "bg-white" : "bg-green-50"
      }`}>
        <div className="flex flex-col items-center">
          {/* Mode indicator */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            mode === "work"
              ? "bg-primary/10 text-primary"
              : "bg-green-500/10 text-green-600"
          }`}>
            {mode === "work" ? (
              <>
                <Briefcase className="w-5 h-5" />
                <span className="font-heading font-bold">{t("pomodoro.work")}</span>
              </>
            ) : (
              <>
                <Coffee className="w-5 h-5" />
                <span className="font-heading font-bold">{t("pomodoro.break")}</span>
              </>
            )}
          </div>

          {/* Circular progress */}
          <div className="relative w-64 h-64 mb-6">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke={mode === "work" ? "#F97316" : "#22C55E"}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - getProgress() / 100)}
                className="transition-all duration-1000"
              />
            </svg>

            {/* Time display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-6xl font-bold text-text">
                {formatTime(timeLeft)}
              </span>
              <span className="font-body text-text/60 mt-2">
                {t("pomodoro.round", { n: rounds + 1 })}
              </span>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={resetTimer}
              className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center"
              title={t("pomodoro.reset")}
            >
              <RotateCcw className="w-5 h-5 text-text" />
            </button>

            <button
              onClick={toggleTimer}
              className={`w-20 h-20 rounded-full border-4 border-black flex items-center justify-center shadow-clay ${
                mode === "work"
                  ? "bg-primary text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {isRunning ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>

            <button
              onClick={skipToNext}
              className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center"
              title={t("pomodoro.skip")}
            >
              <SkipForward className="w-5 h-5 text-text" />
            </button>
          </div>

          {/* Completed rounds */}
          <div className="mt-6 flex items-center gap-2">
            <span className="font-body text-text/60">{t("pomodoro.completed")}</span>
            <span className="font-heading font-bold text-primary">{rounds}</span>
            <span className="font-body text-text/60">{t("pomodoro.roundUnit")}</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="clay-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <span className="font-body font-semibold text-text">{t("pomodoro.settings")}</span>
          </div>
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
              soundEnabled
                ? "border-primary bg-primary/10 text-primary"
                : "border-gray-300 bg-gray-100 text-gray-400"
            }`}
            title={soundEnabled ? t("pomodoro.muteSound") : t("pomodoro.enableSound")}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Work time setting */}
          <div>
            <label className="flex items-center gap-2 font-body text-sm text-text/70 mb-2">
              <Briefcase className="w-4 h-4" />
              {t("pomodoro.workTime")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={120}
                value={workMinutes}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(120, parseInt(e.target.value) || 25));
                  setWorkMinutes(val);
                  if (!isRunning && mode === "work") {
                    setTimeLeft(val * 60);
                  }
                }}
                disabled={isRunning}
                className="w-20 px-3 py-2 rounded-xl border-2 border-primary/20 bg-white font-body text-text text-center focus:outline-none focus:border-primary disabled:opacity-50"
              />
              <span className="font-body text-text/60">{t("pomodoro.minutes")}</span>
            </div>
          </div>

          {/* Break time setting */}
          <div>
            <label className="flex items-center gap-2 font-body text-sm text-text/70 mb-2">
              <Coffee className="w-4 h-4" />
              {t("pomodoro.breakTime")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={60}
                value={breakMinutes}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(60, parseInt(e.target.value) || 5));
                  setBreakMinutes(val);
                  if (!isRunning && mode === "break") {
                    setTimeLeft(val * 60);
                  }
                }}
                disabled={isRunning}
                className="w-20 px-3 py-2 rounded-xl border-2 border-primary/20 bg-white font-body text-text text-center focus:outline-none focus:border-primary disabled:opacity-50"
              />
              <span className="font-body text-text/60">{t("pomodoro.minutes")}</span>
            </div>
          </div>
        </div>

        {/* Quick presets */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="font-body text-sm text-text/60 mb-2">{t("pomodoro.quickPresets")}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setWorkMinutes(25);
                setBreakMinutes(5);
                if (!isRunning) {
                  setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60);
                }
              }}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg border-2 border-gray-200 bg-white font-body text-sm text-text disabled:opacity-50"
            >
              {t("pomodoro.preset1")}
            </button>
            <button
              onClick={() => {
                setWorkMinutes(50);
                setBreakMinutes(10);
                if (!isRunning) {
                  setTimeLeft(mode === "work" ? 50 * 60 : 10 * 60);
                }
              }}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg border-2 border-gray-200 bg-white font-body text-sm text-text disabled:opacity-50"
            >
              {t("pomodoro.preset2")}
            </button>
            <button
              onClick={() => {
                setWorkMinutes(15);
                setBreakMinutes(3);
                if (!isRunning) {
                  setTimeLeft(mode === "work" ? 15 * 60 : 3 * 60);
                }
              }}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg border-2 border-gray-200 bg-white font-body text-sm text-text disabled:opacity-50"
            >
              {t("pomodoro.preset3")}
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="clay-card p-6">
        <p className="font-body font-semibold text-text mb-3">{t("pomodoro.tipsTitle")}</p>
        <ul className="space-y-2 font-body text-sm text-text/70">
          <li>{t("pomodoro.tip1")}</li>
          <li>{t("pomodoro.tip2")}</li>
          <li>{t("pomodoro.tip3")}</li>
          <li>{t("pomodoro.tip4")}</li>
          <li>{t("pomodoro.tip5")}</li>
        </ul>
      </div>
    </div>
  );
}
