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
  FileText,
  X
} from "lucide-react";

interface Winner {
  name: string;
  index: number;
}

export default function LotteryMachine() {
  const [participantsText, setParticipantsText] = useState("");
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentBall, setCurrentBall] = useState<string | null>(null);
  const [ballAnimation, setBallAnimation] = useState(false);

  // Parse participants from text
  const getParticipants = (): string[] => {
    if (!participantsText.trim()) return [];

    // Split by newlines and filter empty lines
    const participants = participantsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Remove duplicates
    return Array.from(new Set(participants));
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

    const selectedWinners: Winner[] = [];
    const availableParticipants = [...participants];

    // Draw winners one by one
    for (let i = 0; i < winnerCount; i++) {
      // Animate ball spinning
      const spinDuration = 2000;
      const spinInterval = 80;
      const spins = spinDuration / spinInterval;

      for (let j = 0; j < spins; j++) {
        const randomIdx = Math.floor(Math.random() * availableParticipants.length);
        setCurrentBall(availableParticipants[randomIdx]);
        await new Promise(resolve => setTimeout(resolve, spinInterval + j * 3));
      }

      // Select winner
      const winnerIdx = Math.floor(Math.random() * availableParticipants.length);
      const winner = availableParticipants[winnerIdx];
      selectedWinners.push({ name: winner, index: i });
      setCurrentBall(winner);

      // Remove winner from pool
      availableParticipants.splice(winnerIdx, 1);

      // Pause between draws
      if (i < winnerCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    setBallAnimation(false);
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
            <div className="relative w-64 h-48 rounded-t-full bg-gradient-to-b from-white/80 to-white/40 border-4 border-black overflow-hidden">
              {/* Balls inside */}
              <div className="absolute inset-4 flex flex-wrap justify-center items-center gap-1 overflow-hidden">
                {participants.slice(0, 30).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-5 h-5 rounded-full ${ballColors[idx % ballColors.length]} ${
                      ballAnimation ? "animate-bounce" : ""
                    } border border-black/20 shadow-sm`}
                    style={{
                      animationDelay: `${idx * 0.05}s`,
                      animationDuration: "0.3s"
                    }}
                  />
                ))}
                {participants.length === 0 && (
                  <p className="text-text/40 text-sm font-body text-center">
                    請在下方輸入參與者名單
                  </p>
                )}
              </div>

              {/* Shine effect */}
              <div className="absolute top-4 left-8 w-16 h-8 bg-white/60 rounded-full blur-md transform -rotate-45" />
            </div>

            {/* Machine base */}
            <div className="relative w-64 h-24 bg-gradient-to-b from-primary to-primary/80 border-4 border-black border-t-0 rounded-b-3xl">
              {/* Output chute */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-12 bg-gray-800 rounded-t-xl border-4 border-black border-b-0">
                {/* Ball output */}
                {(currentBall || showResult) && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-black flex items-center justify-center shadow-lg animate-bounce">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute top-3 left-4 w-3 h-3 rounded-full bg-yellow-400 border border-black" />
              <div className="absolute top-3 right-4 w-3 h-3 rounded-full bg-yellow-400 border border-black" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2">
                <span className="font-heading text-white text-sm font-bold tracking-wider">LUCKY</span>
              </div>
            </div>
          </div>

          {/* Current Winner Display */}
          {(isDrawing || showResult) && currentBall && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-black min-w-[250px]">
              <p className="text-center font-body text-sm text-text/70 mb-1">
                {isDrawing ? "抽選中..." : "🎉 恭喜中獎！"}
              </p>
              <p className={`text-center font-heading text-xl font-bold text-text ${isDrawing ? "blur-[1px]" : ""}`}>
                {currentBall}
              </p>
            </div>
          )}

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
                  抽獎中...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  開始抽獎
                </>
              )}
            </button>

            {showResult && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-black bg-white text-text font-body font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                重新抽獎
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
            參與者名單
          </label>
          <span className="font-body text-sm text-text/60">
            共 <span className="font-semibold text-primary">{participants.length}</span> 位
          </span>
        </div>

        {/* Input methods */}
        <div className="flex gap-2 mb-3">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-primary/30 bg-primary/5 text-primary font-body font-medium cursor-pointer">
            <Upload className="w-4 h-4" />
            匯入 CSV
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
            清除全部
          </button>
        </div>

        <textarea
          value={participantsText}
          onChange={(e) => setParticipantsText(e.target.value)}
          placeholder="每行輸入一位參與者名稱&#10;例如：&#10;王小明&#10;李小華&#10;張小美"
          className="w-full h-48 px-4 py-3 rounded-xl border-2 border-primary/20 bg-white font-body text-text placeholder:text-text/40 focus:outline-none focus:border-primary resize-none"
        />

        <p className="mt-2 text-sm text-text/60 font-body flex items-center gap-1">
          <FileText className="w-4 h-4" />
          支援手動輸入或匯入 CSV 檔案（每行一位，或以逗號分隔）
        </p>
      </div>

      {/* Settings */}
      <div className="clay-card p-6">
        <p className="font-body font-semibold text-text mb-4">抽獎設定</p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 font-body text-sm text-text/70">
            <Trophy className="w-4 h-4" />
            抽出人數
          </label>
          <input
            type="number"
            min={1}
            max={Math.max(1, participants.length)}
            value={winnerCount}
            onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 px-4 py-2 rounded-xl border-2 border-primary/20 bg-white font-body text-text text-center focus:outline-none focus:border-primary"
          />
          <span className="font-body text-sm text-text/60">位</span>
        </div>

        {/* Validation message */}
        {participants.length > 0 && participants.length < winnerCount && (
          <p className="mt-3 text-red-500 font-body text-sm">
            參與者人數（{participants.length}）少於抽出人數（{winnerCount}）
          </p>
        )}
      </div>

      {/* Winners Display */}
      {showResult && winners.length > 0 && (
        <div className="clay-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="font-heading text-xl font-bold text-text">
              中獎名單
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
