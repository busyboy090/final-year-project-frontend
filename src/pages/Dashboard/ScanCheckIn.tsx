import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { ScanLine, CircleCheck, CircleX, CameraOff, KeyRound, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCheckinWithToken } from "@/hooks/useEvent";

const READER_ELEMENT_ID = "qr-reader-region";

interface ScanLogEntry {
  id: string;
  success: boolean;
  message: string;
  attendeeName?: string;
  eventTitle?: string;
  time: string;
}

/**
 * Extracts the check-in token from whatever the camera decodes.
 * The QR encodes a full URL like
 *   https://.../v1/events/enrollments/checkin-with-token?token=abc123
 * but we also accept a bare token string as a fallback (e.g. manual entry).
 */
function extractToken(rawValue: string): string {
  try {
    const url = new URL(rawValue);
    const token = url.searchParams.get("token");
    if (token) return token;
  } catch {
    // Not a URL — fall through and treat the raw text as the token.
  }
  return rawValue.trim();
}

export default function ScanCheckIn() {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualToken, setManualToken] = useState("");
  const [log, setLog] = useState<ScanLogEntry[]>([]);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const busyRef = useRef(false); // guards against overlapping check-in calls
  const checkin = useCheckinWithToken();

  const pushLogEntry = useCallback((entry: Omit<ScanLogEntry, "id" | "time">) => {
    setLog((prev) => [
      {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ].slice(0, 25));
  }, []);

  const submitToken = useCallback(
    async (rawValue: string) => {
      if (busyRef.current) return;
      const token = extractToken(rawValue);
      if (!token) return;

      busyRef.current = true;
      try {
        const result = await checkin.mutateAsync({ token });
        const attendeeName = [result.data?.user?.first_name, result.data?.user?.last_name]
          .filter(Boolean)
          .join(" ");
        toast.success(result.message || "Checked in successfully", {
          description: attendeeName || result.data?.event?.title,
        });
        pushLogEntry({
          success: true,
          message: result.message || "Checked in successfully",
          attendeeName,
          eventTitle: result.data?.event?.title,
        });
      } catch (error) {
        const message =
          (error as AxiosError<{ message?: string }>)?.response?.data?.message || "Check-in failed";
        toast.error(message);
        pushLogEntry({ success: false, message });
      } finally {
        // Small cooldown so the same badge isn't submitted twice while
        // still in frame, without blocking the next different scan for long.
        setTimeout(() => {
          busyRef.current = false;
        }, 1500);
      }
    },
    [checkin, pushLogEntry],
  );

  const startScanning = useCallback(async () => {
    setCameraError(null);
    try {
      const scanner = new Html5Qrcode(READER_ELEMENT_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        (decodedText: string) => {
          void submitToken(decodedText);
        },
        () => {
          // Per-frame decode failures are expected while aiming the camera; ignore.
        },
      );

      setIsScanning(true);
    } catch (err) {
      setIsScanning(false);
      const message = err instanceof Error ? err.message : "";
      setCameraError(
        message.includes("Permission")
          ? "Camera permission was denied. Allow camera access and try again."
          : "Could not start the camera. Check that a camera is available and not in use by another app.",
      );
    }
  }, [submitToken]);

  const stopScanning = useCallback(async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        await scanner.stop();
        scanner.clear();
      } catch {
        // Ignore — scanner may already be stopped.
      }
    }
    scannerRef.current = null;
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      void stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSubmit = async () => {
    if (!manualToken.trim()) return;
    await submitToken(manualToken.trim());
    setManualToken("");
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b5800]">
          Participation
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40]">
          Scan Check-In
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Scan an attendee's QR code to check them in. Each code can only be used once.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="size-4" />
              Camera
            </CardTitle>
            <CardDescription>
              Point the camera at the attendee's QR code. Scanning resumes automatically after each check-in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative mx-auto w-full max-w-sm">
              <div
                id={READER_ELEMENT_ID}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950"
                style={{ minHeight: isScanning ? undefined : 260 }}
              />

              {checkin.isPending && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-950/70 backdrop-blur-sm">
                  <Loader2 className="size-8 animate-spin text-white" />
                  <p className="text-sm font-medium text-white">Checking in…</p>
                </div>
              )}
            </div>

            {!isScanning && (
              <div className="flex flex-col items-center justify-center gap-3 py-2 text-center text-sm text-slate-500">
                {cameraError ? (
                  <>
                    <CameraOff className="size-6 text-red-500" />
                    <p className="text-red-600">{cameraError}</p>
                  </>
                ) : (
                  <p>Camera is off. Start scanning to begin checking in attendees.</p>
                )}
              </div>
            )}

            <div className="flex justify-center gap-3">
              {!isScanning ? (
                <Button type="button" onClick={() => void startScanning()}>
                  <ScanLine className="size-4" />
                  Start Scanning
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={() => void stopScanning()}>
                  Stop Scanning
                </Button>
              )}
            </div>

            <div className="border-t pt-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <KeyRound className="size-3.5" />
                No camera? Enter the token manually
              </p>
              <div className="flex gap-2">
                <Input
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Paste QR token or check-in link"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleManualSubmit();
                  }}
                />
                <Button type="button" onClick={() => void handleManualSubmit()} disabled={checkin.isPending}>
                  Check In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scan Log</CardTitle>
            <CardDescription>Most recent check-ins this session.</CardDescription>
          </CardHeader>
          <CardContent>
            {log.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No scans yet.</p>
            ) : (
              <ul className="space-y-3">
                {log.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                    {entry.success ? (
                      <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    ) : (
                      <CircleX className="mt-0.5 size-4 shrink-0 text-red-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#001e40]">
                        {entry.attendeeName || entry.eventTitle || "Scan result"}
                      </p>
                      <p className="text-xs text-slate-500">{entry.message}</p>
                    </div>
                    <Badge variant={entry.success ? "default" : "destructive"} className="shrink-0 text-[10px]">
                      {entry.time}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}