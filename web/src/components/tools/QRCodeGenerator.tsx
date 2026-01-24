"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Link as LinkIcon, Image, FileCode } from "lucide-react";
import QRCode from "qrcode";

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR Code when URL changes
  useEffect(() => {
    if (!url.trim()) {
      setQrDataUrl(null);
      setSvgString(null);
      return;
    }

    // Generate Canvas/PNG version
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: "#9A3412",
        light: "#FFFFFF",
      },
    })
      .then((dataUrl) => {
        setQrDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error("QR Code generation failed:", err);
      });

    // Generate SVG version
    QRCode.toString(url, {
      type: "svg",
      width: 300,
      margin: 2,
      color: {
        dark: "#9A3412",
        light: "#FFFFFF",
      },
    })
      .then((svg) => {
        setSvgString(svg);
      })
      .catch((err) => {
        console.error("SVG generation failed:", err);
      });
  }, [url]);

  // Download as PNG
  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrDataUrl;
    link.click();
  };

  // Download as JPG
  const downloadJPG = () => {
    if (!qrDataUrl) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Fill white background for JPG
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
    <div className="space-y-8">
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
          className="w-full px-4 py-3 rounded-xl border-2 border-primary/20 bg-white/50 font-body text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          autoComplete="url"
        />
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

              {/* Download Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={downloadPNG}
                  className="clay-button inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-body font-semibold"
                  aria-label="下載 PNG 格式"
                >
                  <Image className="w-4 h-4" />
                  PNG
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={downloadJPG}
                  className="clay-button inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white font-body font-semibold"
                  aria-label="下載 JPG 格式"
                >
                  <Image className="w-4 h-4" />
                  JPG
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={downloadSVG}
                  className="clay-button inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white font-body font-semibold"
                  aria-label="下載 SVG 格式"
                >
                  <FileCode className="w-4 h-4" />
                  SVG
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <LinkIcon className="w-12 h-12 text-primary/40" />
              </div>
              <p className="font-body text-text/50">
                輸入網址後，QR Code 將在這裡顯示
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
