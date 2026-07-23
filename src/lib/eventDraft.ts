/**
 * Browser-only (localStorage) persistence helpers for the multi-step
 * Event Creation form. Lets an Event Organiser / Admin save an in-progress
 * event as a draft and resume it later on the same browser/device.
 *
 * Drafts are scoped per-user (by user id) so multiple accounts sharing a
 * browser don't clobber each other's in-progress drafts.
 */

const DRAFT_PREFIX = "adun-ems:event-draft:";

export const getDraftKey = (userId?: number | string | null): string =>
  `${DRAFT_PREFIX}${userId ?? "anon"}`;

export type ThumbnailMeta = {
  name: string;
  type: string;
  dataUrl: string;
};

export type EventDraftPayload = {
  /** All EventFormValues fields except the raw `thumbnail` FileList */
  values: Record<string, unknown>;
  /** Serialized thumbnail (if one was attached when the draft was saved) */
  thumbnailMeta: ThumbnailMeta | null;
  currentStep: number;
  savedAt: number;
};

/** Reads a File as a base64 data URL so it can be stashed in localStorage. */
export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/** Rebuilds a File object from a previously-stored data URL. */
export const dataUrlToFile = (
  dataUrl: string,
  filename: string,
  mimeType: string
): File => {
  const [, base64] = dataUrl.split(",");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mimeType });
};

/** Wraps a single File in a real FileList via DataTransfer, so it can be
 *  assigned back onto an <input type="file"> registered with react-hook-form. */
export const fileToFileList = (file: File): FileList => {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  return dataTransfer.files;
};

export const readDraft = (userId?: number | string | null): EventDraftPayload | null => {
  try {
    const raw = localStorage.getItem(getDraftKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as EventDraftPayload;
  } catch (error) {
    console.error("EVENT_DRAFT_READ_ERROR:", error);
    return null;
  }
};

export const writeDraft = (
  userId: number | string | null | undefined,
  payload: EventDraftPayload
): boolean => {
  try {
    localStorage.setItem(getDraftKey(userId), JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error("EVENT_DRAFT_WRITE_ERROR:", error);
    return false;
  }
};

export const clearDraft = (userId?: number | string | null): void => {
  try {
    localStorage.removeItem(getDraftKey(userId));
  } catch (error) {
    console.error("EVENT_DRAFT_CLEAR_ERROR:", error);
  }
};

/** Small "3m ago" / "2h ago" style relative time formatter for the draft banner. */
export const formatRelativeTime = (timestamp: number): string => {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
};