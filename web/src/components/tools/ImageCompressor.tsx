"use client";

import { useState, useRef, useCallback } from "react";
import {
  ImageDown,
  Upload,
  Download,
  Trash2,
  FileImage,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Types ───────────────────────────────────────────────
type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

interface ProcessedImage {
  id: string;
  originalFile: File;
  originalUrl: string;
  originalSize: number;
  resultBlob: Blob | null;
  resultUrl: string | null;
  resultSize: number;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}

const FORMAT_OPTIONS: { value: OutputFormat; label: string; ext: string }[] = [
  { value: "image/jpeg", label: "JPG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

// ─── Helpers ─────────────────────────────────────────────
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

function getReduction(original: number, result: number): string {
  if (original === 0) return "0%";
  const pct = ((1 - result / original) * 100).toFixed(1);
  return `${pct}%`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

async function compressImage(
  file: File,
  quality: number,
  format: OutputFormat,
  maxWidth: number
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");

  let w = img.naturalWidth;
  let h = img.naturalHeight;

  if (maxWidth > 0 && w > maxWidth) {
    const ratio = maxWidth / w;
    w = maxWidth;
    h = Math.round(h * ratio);
  }

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d")!;
  // White background for JPG (no alpha)
  if (format === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, 0, 0, w, h);

  URL.revokeObjectURL(img.src);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Compression failed"));
      },
      format,
      format === "image/png" ? undefined : quality / 100
    );
  });
}

// ─── Main Component ──────────────────────────────────────
export default function ImageCompressor() {
  const { t } = useLanguage();

  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [maxWidth, setMaxWidth] = useState(0); // 0 = no resize
  const [isDragOver, setIsDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newImages: ProcessedImage[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      newImages.push({
        id: Math.random().toString(36).substring(2, 10),
        originalFile: file,
        originalUrl: URL.createObjectURL(file),
        originalSize: file.size,
        resultBlob: null,
        resultUrl: null,
        resultSize: 0,
        status: "pending",
      });
    }
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.originalUrl);
        if (img.resultUrl) URL.revokeObjectURL(img.resultUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.originalUrl);
      if (img.resultUrl) URL.revokeObjectURL(img.resultUrl);
    });
    setImages([]);
  }, [images]);

  const processAll = useCallback(async () => {
    if (images.length === 0) return;
    setProcessing(true);

    // Mark all as processing
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        status: "processing" as const,
        resultBlob: null,
        resultUrl: img.resultUrl
          ? (URL.revokeObjectURL(img.resultUrl), null)
          : null,
        resultSize: 0,
      }))
    );

    for (const img of images) {
      try {
        const blob = await compressImage(img.originalFile, quality, format, maxWidth);
        const url = URL.createObjectURL(blob);
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? {
                  ...i,
                  status: "done" as const,
                  resultBlob: blob,
                  resultUrl: url,
                  resultSize: blob.size,
                }
              : i
          )
        );
      } catch {
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? { ...i, status: "error" as const, error: "Compression failed" }
              : i
          )
        );
      }
    }

    setProcessing(false);
  }, [images, quality, format, maxWidth]);

  const downloadImage = useCallback(
    (img: ProcessedImage) => {
      if (!img.resultUrl || !img.resultBlob) return;
      const ext = FORMAT_OPTIONS.find((f) => f.value === format)?.ext || "jpg";
      const name = img.originalFile.name.replace(/\.[^.]+$/, "") + `_compressed.${ext}`;
      const a = document.createElement("a");
      a.href = img.resultUrl;
      a.download = name;
      a.click();
    },
    [format]
  );

  const downloadAll = useCallback(() => {
    const doneImages = images.filter((i) => i.status === "done");
    doneImages.forEach((img) => downloadImage(img));
  }, [images, downloadImage]);

  const totalOriginal = images.reduce((s, i) => s + i.originalSize, 0);
  const totalResult = images
    .filter((i) => i.status === "done")
    .reduce((s, i) => s + i.resultSize, 0);
  const hasDone = images.some((i) => i.status === "done");

  return (
    <div className="space-y-6">
      {/* ── Upload Area ── */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Upload className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-text text-lg">
            {t("img.uploadTitle")}
          </span>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-black/15 bg-gray-50/50 hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
            className="hidden"
          />
          <ImageDown className="w-10 h-10 mx-auto mb-3 text-primary/60" />
          <p className="font-body text-text/70 text-sm">
            {t("img.dropHint")}
          </p>
          <p className="font-body text-text/40 text-xs mt-1">
            {t("img.formatHint")}
          </p>
        </div>
      </div>

      {/* ── Settings ── */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <FileImage className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-text text-lg">
            {t("img.settingsTitle")}
          </span>
        </div>

        <div className="space-y-4">
          {/* Output format */}
          <div>
            <label className="block font-body text-sm text-text/70 mb-2">
              {t("img.formatLabel")}
            </label>
            <div className="flex gap-2">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFormat(opt.value)}
                  className={`px-4 py-2 rounded-xl border-2 font-body text-sm transition-all ${
                    format === opt.value
                      ? "border-black bg-primary/10 text-primary font-bold"
                      : "border-black/10 bg-white text-text/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality slider (not for PNG) */}
          {format !== "image/png" && (
            <div>
              <label className="block font-body text-sm text-text/70 mb-2">
                {t("img.qualityLabel")} — {quality}%
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between font-body text-xs text-text/40 mt-1">
                <span>{t("img.qualityLow")}</span>
                <span>{t("img.qualityHigh")}</span>
              </div>
            </div>
          )}

          {/* Max width */}
          <div>
            <label className="block font-body text-sm text-text/70 mb-2">
              {t("img.maxWidthLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: t("img.noResize"), value: 0 },
                { label: "800px", value: 800 },
                { label: "1200px", value: 1200 },
                { label: "1920px", value: 1920 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMaxWidth(opt.value)}
                  className={`px-4 py-2 rounded-xl border-2 font-body text-sm transition-all ${
                    maxWidth === opt.value
                      ? "border-black bg-primary/10 text-primary font-bold"
                      : "border-black/10 bg-white text-text/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={processAll}
            disabled={images.length === 0 || processing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-black bg-primary text-white font-body font-bold shadow-[3px_3px_0_black] hover:shadow-[4px_4px_0_black] hover:-translate-y-0.5 transition-all active:shadow-none active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            <ImageDown className="w-4 h-4" />
            {processing ? t("img.processing") : t("img.startCompress")}
          </button>

          {hasDone && (
            <button
              onClick={downloadAll}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-black bg-white text-text font-body font-bold shadow-[3px_3px_0_black] hover:shadow-[4px_4px_0_black] hover:-translate-y-0.5 transition-all active:shadow-none active:translate-y-0"
            >
              <Download className="w-4 h-4" />
              {t("img.downloadAll")}
            </button>
          )}

          {images.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-black/10 bg-white text-text/60 font-body text-sm hover:border-red-300 hover:text-red-500 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              {t("img.clearAll")}
            </button>
          )}
        </div>
      </div>

      {/* ── Stats summary ── */}
      {hasDone && (
        <div className="clay-card p-4">
          <div className="flex items-center justify-center gap-4 font-body text-sm">
            <div className="text-center">
              <div className="text-text/50">{t("img.totalOriginal")}</div>
              <div className="font-bold text-text">{formatSize(totalOriginal)}</div>
            </div>
            <ArrowRight className="w-5 h-5 text-primary" />
            <div className="text-center">
              <div className="text-text/50">{t("img.totalResult")}</div>
              <div className="font-bold text-primary">{formatSize(totalResult)}</div>
            </div>
            <div className="text-center px-3 py-1 bg-green-50 rounded-lg border border-green-200">
              <div className="text-green-600 font-bold">
                -{getReduction(totalOriginal, totalResult)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Image List ── */}
      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="clay-card p-4 flex flex-col sm:flex-row items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl border-2 border-black/10 overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  src={img.originalUrl}
                  alt={img.originalFile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="font-body text-sm font-bold text-text truncate">
                  {img.originalFile.name}
                </div>
                <div className="font-body text-xs text-text/50 mt-1">
                  {formatSize(img.originalSize)}
                  {img.status === "done" && (
                    <>
                      {" "}
                      <ArrowRight className="inline w-3 h-3" />{" "}
                      <span className="text-primary font-bold">
                        {formatSize(img.resultSize)}
                      </span>
                      <span className="ml-1 text-green-600">
                        (-{getReduction(img.originalSize, img.resultSize)})
                      </span>
                    </>
                  )}
                </div>

                {/* Status */}
                {img.status === "processing" && (
                  <div className="mt-1 text-xs text-primary font-body animate-pulse">
                    {t("img.processing")}
                  </div>
                )}
                {img.status === "error" && (
                  <div className="mt-1 text-xs text-red-500 font-body">
                    {img.error}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                {img.status === "done" && (
                  <button
                    onClick={() => downloadImage(img)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border-2 border-black bg-white text-text font-body text-xs font-bold shadow-[2px_2px_0_black] hover:shadow-[3px_3px_0_black] hover:-translate-y-0.5 transition-all active:shadow-none active:translate-y-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {t("img.download")}
                  </button>
                )}
                <button
                  onClick={() => removeImage(img.id)}
                  className="p-2 rounded-xl border-2 border-black/10 bg-white text-text/40 hover:border-red-300 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
