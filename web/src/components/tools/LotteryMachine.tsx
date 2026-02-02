"use client";

import { useState, useCallback } from "react";
import {
  Users,
  Trophy,
  Sparkles,
  Trash2,
  Play,
  RotateCcw,
  Upload,
  FileText
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Winner {
  name: string;
  index: number;
}

export default function LotteryMachine() {
  const { t } = useLanguage();
  const [participantsText, setParticipantsText] = useState("");
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentBall, setCurrentBall] = useState<string | null>(null);
  const [ballAnimation, setBallAnimation] = useState(false);
  const [rollingNames, setRollingNames] = useState<string[]>([]);

  // Parse participants from text (support both newline and comma separated)
  const getParticipants = (): string[] => {
    if (!participantsText.trim()) return [];

    // Support multiple separators: newline, comma (English & Chinese), semicolon
    // First replace all separators with newline, then split
    const normalized = participantsText
      .replace(/[,，;；、]/g, "\n")  // Replace commas and semicolons with newline
      .split("\n")
      .map(name => name.trim())
      .filter(name => name.length > 0);

    // Remove duplicates
    return Array.from(new Set(normalized));
  };

  const participants = getParticipants();

  // Handle CSV import
  const handleCSVImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Parse CSV - handle both comma and newline separated
      const lines = text.split(/[\n\r]+/).filter(line => line.trim());
      const names: string[] = [];

      lines.forEach(line => {
        // Split by comma and take first column (or whole line if no comma)
        const parts = line.split(",");
        const name = parts[0]?.trim();
        if (name && name.length > 0) {
          names.push(name);
        }
      });

      // Append to existing or replace
      if (participantsText.trim()) {
        setParticipantsText(prev => prev + "\n" + names.join("\n"));
      } else {
        setParticipantsText(names.join("\n"));
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = "";
  }, [participantsText]);

  // Lottery animation
  const runLottery = async () => {
    if (participants.length === 0 || participants.length < winnerCount) return;

    setIsDrawing(true);
    setShowResult(false);
    setWinners([]);
    setBallAnimation(true);
    setRollingNames([]);

    const selectedWinners: Winner[] = [];
    const availableParticipants = [...participants];

    // Draw winners one by one
    for (let i = 0; i < winnerCount; i++) {
      // Animate rolling names
      const spinDuration = 2500;
      const startInterval = 50;
      const endInterval = 200;
      let elapsed = 0;

      while (elapsed < spinDuration) {
        // Calculate current interval (slows down over time)
        const progress = elapsed / spinDuration;
        const currentInterval = startInterval + (endInterval - startInterval) * progress;

        // Pick 5 random names for the rolling display
        const rolling: string[] = [];
        for (let k = 0; k < 5; k++) {
          const randomIdx = Math.floor(Math.random() * availableParticipants.length);
          rolling.push(availableParticipants[randomIdx]);
        }
        setRollingNames(rolling);
        setCurrentBall(rolling[2]); // Middle one is the "selected"

        await new Promise(resolve => setTimeout(resolve, currentInterval));
        elapsed += currentInterval;
      }

      // Select winner
      const winnerIdx = Math.floor(Math.random() * availableParticipants.length);
      const winner = availableParticipants[winnerIdx];
      selectedWinners.push({ name: winner, index: i });
      setCurrentBall(winner);
      setRollingNames([winner]);

      // Remove winner from pool
      availableParticipants.splice(winnerIdx, 1);

      // Pause between draws
      if (i < winnerCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setBallAnimation(false);
    setRollingNames([]);
    setWinners(selectedWinners);
    setIsDrawing(false);
    setShowResult(true);
  };

  // Reset everything
  const handleReset = () => {
    setWinners([]);
    setShowResult(false);
    setCurrentBall(null);
  };

  // Clear all
  const handleClearAll = () => {
    setParticipantsText("");
    setWinnerCount(1);
    handleReset();
  };

  // Generate random ball colors
  const ballColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  return (
    <div className="space-y-6">
      {/* Gacha Machine Display */}
      <div className="clay-card p-8">
        <div className="flex flex-col items-center">
          {/* Machine Top */}
          <div className="relative">
            {/* Glass dome */}
            <div className="relative w-72 h-52 rounded-t-[50%] bg-gradient-to-b from-sky-100 to-sky-50 border-4 border-black overflow-hidden">
              {/* Balls inside */}
              <div className="absolute inset-3 bottom-6 flex flex-wrap justify-center content-center gap-1.5 overflow-hidden p-2">
                {participants.slice(0, 35).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-full ${ballColors[idx % ballColors.length]} ${
                      ballAnimation ? "animate-bounce" : ""
                    } border-2 border-white/50 shadow-md`}
                  />
                ))}
                {participants.length === 0 && (
                  <p className="text-gray-400 text-sm font-body text-center px-4">
                    {t("lottery.readyPrompt")}
                  </p>
                )}
              </div>

              {/* Shine effect */}
              <div className="absolute top-6 left-10 w-20 h-10 bg-white/70 rounded-full blur-lg transform -rotate-45" />
            </div>

            {/* Machine base */}
            <div className="relative w-72 h-28 bg-gradient-to-b from-primary to-orange-600 border-4 border-black border-t-0 rounded-b-3xl">
              {/* Rolling display window */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-16 bg-gray-900 rounded-lg border-2 border-black overflow-hidden">
                {isDrawing && rollingNames.length > 0 ? (
                  <div className="h-full flex flex-col justify-center items-center animate-pulse">
                    {rollingNames.slice(0, 3).map((name, idx) => (
                      <div
                        key={idx}
                        className={`text-center font-heading truncate w-full px-2 ${
                          idx === 1 ? "text-yellow-400 text-lg font-bold" : "text-gray-500 text-xs"
                        }`}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                ) : showResult && currentBall ? (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-yellow-400 font-heading text-lg font-bold truncate px-2">
                      🎉 {currentBall}
                    </span>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-gray-600 font-body text-sm">{t("lottery.ready")}</span>
                  </div>
                )}
              </div>

              {/* Decorative lights */}
              <div className="absolute bottom-3 left-4 w-3 h-3 rounded-full bg-green-400 border border-black animate-pulse" />
              <div className="absolute bottom-3 right-4 w-3 h-3 rounded-full bg-red-400 border border-black animate-pulse" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <span className="font-heading text-white text-xs font-bold tracking-widest">LUCKY DRAW</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button
              onClick={runLottery}
              disabled={isDrawing || participants.length === 0 || participants.length < winnerCount}
              className="clay-button-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDrawing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  {t("lottery.drawing")}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {t("lottery.startDraw")}
                </>
              )}
            </button>

            {showResult && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-black bg-white text-text font-body font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                {t("lottery.redraw")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Participants Input */}
      <div className="clay-card p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 font-body font-semibold text-text">
            <Users className="w-5 h-5 text-primary" />
            {t("lottery.listTitle")}
          </label>
          <span className="font-body text-sm text-text/60">
            {t("lottery.totalPrefix")} <span className="font-semibold text-primary">{participants.length}</span> {t("lottery.totalSuffix")}
          </span>
        </div>

        {/* Input methods */}
        <div className="flex gap-2 mb-3">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-primary/30 bg-primary/5 text-primary font-body font-medium cursor-pointer">
            <Upload className="w-4 h-4" />
            {t("lottery.importCsv")}
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleCSVImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleClearAll}
            disabled={isDrawing || !participantsText.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-300 bg-white text-red-600 font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {t("lottery.clearAll")}
          </button>
        </div>

        <textarea
          value={participantsText}
          onChange={(e) => setParticipantsText(e.target.value)}
          placeholder={t("lottery.placeholder")}
          className="w-full h-48 px-4 py-3 rounded-xl border-2 border-primary/20 bg-white font-body text-text placeholder:text-text/40 focus:outline-none focus:border-primary resize-none"
        />

        <p className="mt-2 text-sm text-text/60 font-body flex items-center gap-1">
          <FileText className="w-4 h-4" />
          {t("lottery.supportHint")}
        </p>
      </div>

      {/* Settings */}
      <div className="clay-card p-6">
        <p className="font-body font-semibold text-text mb-4">{t("lottery.settings")}</p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 font-body text-sm text-text/70">
            <Trophy className="w-4 h-4" />
            {t("lottery.winnerCount")}
          </label>
          <input
            type="number"
            min={1}
            max={Math.max(1, participants.length)}
            value={winnerCount}
            onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 px-4 py-2 rounded-xl border-2 border-primary/20 bg-white font-body text-text text-center focus:outline-none focus:border-primary"
          />
          <span className="font-body text-sm text-text/60">{t("lottery.winnerUnit")}</span>
        </div>

        {/* Validation message */}
        {participants.length > 0 && participants.length < winnerCount && (
          <p className="mt-3 text-red-500 font-body text-sm">
            {t("lottery.notEnough")}
          </p>
        )}
      </div>

      {/* Winners Display */}
      {showResult && winners.length > 0 && (
        <div className="clay-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="font-heading text-xl font-bold text-text">
              {t("lottery.winnerList")}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {winners.map((winner, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border-2 border-primary/30"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-black">
                  {idx + 1}
                </div>
                <span className="font-body font-semibold text-text truncate flex-1">
                  {winner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
