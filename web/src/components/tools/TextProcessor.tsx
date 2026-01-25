"use client";

import { useState } from "react";
import { Type, Space, SplitSquareVertical, Sparkles, Trash2, Copy, Check } from "lucide-react";

export default function TextProcessor() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Calculate character count
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;

  // Add half-width space between Chinese and English/numbers
  const addSpaceBetweenCJKAndLatin = (input: string): string => {
    // Add space between CJK and Latin/numbers
    let result = input;
    // CJK followed by Latin/number
    result = result.replace(/([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff])([a-zA-Z0-9])/g, "$1 $2");
    // Latin/number followed by CJK
    result = result.replace(/([a-zA-Z0-9])([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff])/g, "$1 $2");
    return result;
  };

  // Add special blank character between lines
  const addBlankBetweenLines = (input: string): string => {
    // Split by newlines, add blank character, rejoin
    const lines = input.split("\n");
    return lines.join("\n󠀠\n");
  };

  // Handle add space between CJK and Latin
  const handleAddSpace = () => {
    setText(addSpaceBetweenCJKAndLatin(text));
  };

  // Handle add blank between lines
  const handleAddBlankLines = () => {
    setText(addBlankBetweenLines(text));
  };

  // Handle both operations
  const handleBothOperations = () => {
    let result = addSpaceBetweenCJKAndLatin(text);
    result = addBlankBetweenLines(result);
    setText(result);
  };

  // Handle clear
  const handleClear = () => {
    setText("");
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      alert("複製失敗");
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="clay-card p-6">
        <div className="flex items-center justify-between mb-3">
          <label
            htmlFor="text-input"
            className="flex items-center gap-2 font-body font-semibold text-text"
          >
            <Type className="w-5 h-5 text-primary" />
            輸入或貼上文字
          </label>
          <div className="font-body text-sm text-text/60">
            共 <span className="font-semibold text-primary">{charCount}</span> 字
            （不含空白 <span className="font-semibold text-primary">{charCountNoSpaces}</span> 字）
          </div>
        </div>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在此輸入或貼上文字..."
          className="w-full h-64 px-4 py-3 rounded-xl border-2 border-primary/20 bg-white font-body text-text placeholder:text-text/40 focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="clay-card p-6">
        <p className="font-body font-semibold text-text mb-4">文字處理功能</p>
        <div className="flex flex-wrap gap-3">
          {/* Add space between CJK and Latin */}
          <button
            onClick={handleAddSpace}
            disabled={!text}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-300 bg-white text-text font-body font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            title="在中文與英數字之間添加半形空格"
          >
            <Space className="w-5 h-5" />
            中英加空格
          </button>

          {/* Add blank character between lines */}
          <button
            onClick={handleAddBlankLines}
            disabled={!text}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-300 bg-white text-text font-body font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            title="在每行之間添加空白符號"
          >
            <SplitSquareVertical className="w-5 h-5" />
            行間加空白
          </button>

          {/* Both operations */}
          <button
            onClick={handleBothOperations}
            disabled={!text}
            className="clay-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            title="同時執行以上兩個功能"
          >
            <Sparkles className="w-5 h-5" />
            一鍵全部處理
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            disabled={!text}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-red-300 bg-white text-red-600 font-body font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            title="清除所有文字"
          >
            <Trash2 className="w-5 h-5" />
            清除文字
          </button>
        </div>
      </div>

      {/* Copy Button */}
      {text && (
        <div className="clay-card p-6">
          <div className="flex items-center justify-between">
            <p className="font-body text-text/70">處理完成後，複製結果</p>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-body font-semibold ${
                copied
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300 bg-white text-text"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  已複製！
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  複製文字
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
