"use client";

import { useState, useEffect } from "react";
import { Download, Link as LinkIcon, Copy, Check } from "lucide-react";
import QRCode from "qrcode";

// Preset color options (orange/brown theme only)
const colorPresets = [
  { name: "深琥珀", value: "#9A3412" },
  { name: "咖啡色", value: "#78350F" },
  { name: "深橘", value: "#C2410C" },
  { name: "純黑", value: "#000000" },
];

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("");
  const [qrColor, setQrColor] = useState("#9A3412");
  const [includeWhiteBg, setIncludeWhiteBg] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrTransparentUrl, setQrTransparentUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate QR Code when URL or color changes
  useEffect(() => {
    if (!url.trim()) {
      setQrDataUrl(null);
      setQrTransparentUrl(null);
      setSvgString(null);
      return;
    }

    // Generate with white background
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: qrColor,
        light: "#FFFFFF",
      },
    })
      .then((dataUrl) => {
        setQrDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error("QR Code generation failed:", err);
      });

    // Generate with transparent background
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: qrColor,
        light: "#FFFFFF00",
      },
    })
      .then((dataUrl) => {
        setQrTransparentUrl(dataUrl);
      })
      .catch((err) => {
        console.error("Transparent QR Code generation failed:", err);
      });

    // Generate SVG version
    QRCode.toString(url, {
      type: "svg",
      width: 300,
      margin: 2,
      color: {
        dark: qrColor,
        light: "#FFFFFF",
      },
    })
      .then((svg) => {
        setSvgString(svg);
      })
      .catch((err) => {
        console.error("SVG generation failed:", err);
      });
  }, [url, qrColor]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      // Fallback: try to copy as text (data URL)
      try {
        await navigator.clipboard.writeText(qrDataUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        alert("複製失敗，請手動右鍵複製圖片");
      }
    }
  };

  // Download as PNG
  const downloadPNG = () => {
    const dataUrl = includeWhiteBg ? qrDataUrl : qrTransparentUrl;
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = dataUrl;
    link.click();
  };

  // Download as JPG (always with white background)
  const downloadJPG = () => {
    if (!qrDataUrl) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }

      const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.download = "qrcode.jpg";
      link.href = jpgDataUrl;
      link.click();
    };

    img.src = qrDataUrl;
  };

  // Download as SVG
  const downloadSVG = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "qrcode.svg";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="clay-card p-6">
        <label
          htmlFor="url-input"
          className="flex items-center gap-2 font-body font-semibold text-text mb-3"
        >
          <LinkIcon className="w-5 h-5 text-primary" />
          輸入網址或文字
        </label>
        <input
          id="url-input"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-3 rounded-xl border-2 border-primary/20 bg-white font-body text-text placeholder:text-text/40 focus:outline-none focus:border-primary transition-colors"
          autoComplete="url"
        />
      </div>

      {/* Color Settings */}
      <div className="clay-card p-6">
        <p className="font-body font-semibold text-text mb-3">QR Code 顏色</p>
        <div className="flex flex-wrap gap-3">
          {colorPresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setQrColor(preset.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-body text-sm transition-colors ${
                qrColor === preset.value
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 bg-white"
              }`}
              aria-label={`選擇 ${preset.name}`}
            >
              <span
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: preset.value }}
              />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* QR Code Display */}
      <div className="clay-card p-8">
        <div className="flex flex-col items-center">
          {qrDataUrl ? (
            <>
              {/* QR Code Image */}
              <div className="p-4 bg-white rounded-2xl shadow-inner mb-6">
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  width={300}
                  height={300}
                  className="block"
                />
              </div>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className={`mb-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-body font-semibold transition-colors ${
                  copied
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-300 bg-white text-text"
                }`}
                aria-label="複製 QR Code"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    已複製！
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    複製圖片
                  </>
                )}
              </button>

              {/* PNG Background Option */}
              <label className="flex items-center gap-2 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeWhiteBg}
                  onChange={(e) => setIncludeWhiteBg(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="font-body text-text/70 text-sm">
                  PNG 下載時包含白色背景
                </span>
              </label>

              {/* Download Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={downloadPNG}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-300 bg-white text-text font-body font-semibold transition-colors"
                  aria-label="下載 PNG 格式"
                >
                  PNG
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={downloadJPG}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-300 bg-white text-text font-body font-semibold transition-colors"
                  aria-label="下載 JPG 格式"
                >
                  JPG
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={downloadSVG}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-300 bg-white text-text font-body font-semibold transition-colors"
                  aria-label="下載 SVG 格式"
                >
                  SVG
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-accent-light flex items-center justify-center">
                <LinkIcon className="w-12 h-12 text-primary/40" />
              </div>
              <p className="font-body text-text/50">
                輸入網址後，QR Code 將在這裡顯示
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
