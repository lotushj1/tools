"use client";

import { useState } from "react";
import {
  Instagram,
  Users,
  Search,
  Trophy,
  Sparkles,
  Trash2,
  Play,
  RotateCcw,
  Gift,
  Star
} from "lucide-react";

interface Winner {
  name: string;
  index: number;
}

export default function InstagramGiveaway() {
  const [igLink, setIgLink] = useState("");
  const [participantsText, setParticipantsText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentSlotNames, setCurrentSlotNames] = useState<string[]>([]);

  // Parse participants from text
  const getParticipants = (): string[] => {
    if (!participantsText.trim()) return [];

    // Split by newlines and filter empty lines
    let participants = participantsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Filter by keyword if set
    if (keyword.trim()) {
      participants = participants.filter((p) =>
        p.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Remove duplicates
    return Array.from(new Set(participants));
  };

  const participants = getParticipants();

  // Slot machine animation
  const runSlotMachine = async () => {
    if (participants.length === 0 || participants.length < winnerCount) return;

    setIsDrawing(true);
    setShowResult(false);
    setWinners([]);

    // Shuffle participants for random selection
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const selectedWinners: Winner[] = shuffled
      .slice(0, winnerCount)
      .map((name, idx) => ({ name, index: idx }));

    // Animate slot machine
    const totalDuration = 3000; // 3 seconds
    const intervalSpeed = 50; // Update every 50ms
    const iterations = totalDuration / intervalSpeed;

    for (let i = 0; i < iterations; i++) {
      // Slow down towards the end
      const progress = i / iterations;
      const delay = intervalSpeed + progress * 100;

      await new Promise((resolve) => setTimeout(resolve, delay));

      // Show random names during animation
      const randomNames = Array(winnerCount)
        .fill(null)
        .map(() => participants[Math.floor(Math.random() * participants.length)]);

      setCurrentSlotNames(randomNames);
    }

    // Show final winners
    setCurrentSlotNames(selectedWinners.map((w) => w.name));
    setWinners(selectedWinners);
    setIsDrawing(false);
    setShowResult(true);
  };

  // Reset everything
  const handleReset = () => {
    setWinners([]);
    setShowResult(false);
    setCurrentSlotNames([]);
  };

  // Clear all
  const handleClearAll = () => {
    setIgLink("");
    setParticipantsText("");
    setKeyword("");
    setWinnerCount(1);
    handleReset();
  };

  return (
    <div className="space-y-6">
      {/* IG Link Input */}
      <div className="clay-card p-6">
        <label className="flex items-center gap-2 font-body font-semibold text-text mb-3">
          <Instagram className="w-5 h-5 text-primary" />
          Instagram 貼文連結（選填）
        </label>
        <input
          type="url"
          value={igLink}
          onChange={(e) => setIgLink(e.target.value)}
          placeholder="https://www.instagram.com/p/..."
          className="w-full px-4 py-3 rounded-xl border-2 border-primary/20 bg-white font-body text-text placeholder:text-text/40 focus:outline-none focus:border-primary"
        />
        <p className="mt-2 text-sm text-text/60 font-body">
          貼上 IG 連結作為活動參考，實際參與者請在下方輸入
        </p>
      </div>

      {/* Participants Input */}
      <div className="clay-card p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 font-body font-semibold text-text">
            <Users className="w-5 h-5 text-primary" />
            參與者名單
          </label>
          <span className="font-body text-sm text-text/60">
            共 <span className="font-semibold text-primary">{participants.length}</span> 位符合條件
          </span>
        </div>
        <textarea
          value={participantsText}
          onChange={(e) => setParticipantsText(e.target.value)}
          placeholder="每行輸入一位參與者（可包含 IG 帳號或留言內容）&#10;例如：&#10;@user1 想要這個獎品！&#10;@user2 +1&#10;@user3 我要參加抽獎"
          className="w-full h-48 px-4 py-3 rounded-xl border-2 border-primary/20 bg-white font-body text-text placeholder:text-text/40 focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {/* Settings */}
      <div className="clay-card p-6">
        <p className="font-body font-semibold text-text mb-4">抽獎設定</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Keyword Filter */}
          <div>
            <label className="flex items-center gap-2 font-body text-sm text-text/70 mb-2">
              <Search className="w-4 h-4" />
              關鍵字篩選（選填）
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="例如：+1、想要、參加"
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/20 bg-white font-body text-text placeholder:text-text/40 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Winner Count */}
          <div>
            <label className="flex items-center gap-2 font-body text-sm text-text/70 mb-2">
              <Trophy className="w-4 h-4" />
              抽出人數
            </label>
            <input
              type="number"
              min={1}
              max={Math.max(1, participants.length)}
              value={winnerCount}
              onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/20 bg-white font-body text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Slot Machine Display */}
      <div className="clay-card p-8">
        <div className="text-center">
          {/* Slot Machine Frame */}
          <div className="relative inline-block">
            {/* Decorative elements */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 px-4 py-1 bg-primary rounded-full">
                <Star className="w-4 h-4 text-white" />
                <span className="font-heading text-white text-sm font-bold">LUCKY DRAW</span>
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Main slot display */}
            <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 border-4 border-black shadow-clay overflow-hidden min-w-[300px]">
              {/* Slot windows */}
              <div className="space-y-3">
                {(showResult || isDrawing) ? (
                  currentSlotNames.map((name, idx) => (
                    <div
                      key={idx}
                      className={`relative bg-white rounded-xl p-4 border-2 border-black overflow-hidden ${
                        isDrawing ? "animate-pulse" : ""
                      }`}
                    >
                      <div className={`font-heading text-lg font-bold text-gray-900 truncate ${
                        isDrawing ? "blur-[2px]" : ""
                      }`}>
                        {showResult && (
                          <span className="text-primary mr-2">🎉</span>
                        )}
                        {name}
                      </div>
                      {showResult && (
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                          #{idx + 1}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white/10 rounded-xl p-8 border-2 border-dashed border-white/30">
                    <Gift className="w-12 h-12 text-white/50 mx-auto mb-2" />
                    <p className="font-body text-white/50 text-sm">
                      點擊下方按鈕開始抽獎
                    </p>
                  </div>
                )}
              </div>

              {/* Decorative lights */}
              <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500 animate-pulse [animation-delay:0.5s]" />
              <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-yellow-500 animate-pulse [animation-delay:0.25s]" />
              <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-blue-500 animate-pulse [animation-delay:0.75s]" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={runSlotMachine}
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
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-gray-300 bg-white text-text font-body font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                重新抽獎
              </button>
            )}

            <button
              onClick={handleClearAll}
              disabled={isDrawing}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-red-300 bg-white text-red-600 font-body font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              清除全部
            </button>
          </div>

          {/* Validation message */}
          {participants.length === 0 && participantsText.trim() && (
            <p className="mt-4 text-red-500 font-body text-sm">
              沒有符合條件的參與者，請檢查關鍵字設定
            </p>
          )}
          {participants.length > 0 && participants.length < winnerCount && (
            <p className="mt-4 text-red-500 font-body text-sm">
              參與者人數（{participants.length}）少於抽出人數（{winnerCount}）
            </p>
          )}
        </div>
      </div>

      {/* Winners Display */}
      {showResult && winners.length > 0 && (
        <div className="clay-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="font-heading text-xl font-bold text-text">
              恭喜中獎！
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {winners.map((winner, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border-2 border-primary/30"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
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
