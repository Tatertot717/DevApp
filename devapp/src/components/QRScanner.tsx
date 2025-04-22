"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

export default function QRScanner({ onScan }: { onScan: (text: string) => void }) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraId, setCameraId] = useState<string | null>(null);
  const [cameras, setCameras] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");

  // Get available cameras
  useEffect(() => {
    async function setupScanner() {
      try {
        const foundCameras = await Html5Qrcode.getCameras();
        if (!foundCameras.length) {
          setError("No camera found.");
          return;
        }

        setCameras(foundCameras);
        setCameraId(foundCameras[0].id);
      } catch (err) {
        setError("Camera permission denied or unavailable.");
      }
    }

    setupScanner();
  }, []);

  // Start the scanner when cameraId changes
  useEffect(() => {
    if (!cameraId) return;

    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => onScan(decodedText),
        (errorMessage) => {
            console.log(errorMessage);
        }
      )
      .catch((err) => {
        setError("Failed to start camera.");
        console.error("Start error:", err);
      });

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            const reader = document.getElementById("reader");
            if (reader) {
              scannerRef.current?.clear();
            }
          })
          .catch((err) => {
            console.warn("Stop error:", err);
          });
      }
    };
  }, [cameraId, onScan]);

  const handleFlip = () => {
    if (cameras.length < 2) return;

    const nextIndex = (currentIndex + 1) % cameras.length;
    setCurrentIndex(nextIndex);
    setCameraId(cameras[nextIndex].id);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        id="reader"
        className="rounded-xl overflow-hidden border border-red-300 shadow-inner w-full max-w-sm"
      />
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
      {!error && cameras.length > 1 && (
        <button
          onClick={handleFlip}
          className="mt-2 text-sm text-red-700 underline hover:text-red-900 transition"
        >
          Flip Camera
        </button>
      )}
    </div>
  );
}