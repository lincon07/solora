type RecordState =
  | { status: "pending"; promise: Promise<void> }
  | { status: "resolved" }
  | { status: "error"; error: unknown };

const cache = new Map<string, RecordState>();

function loadImage(src: string): RecordState {
  if (!cache.has(src)) {
    const record: RecordState = {
      status: "pending",
      promise: new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          record.status = "resolved";
          resolve();
        };
        img.onerror = (err) => {
          (record as { status: "error"; error: unknown }).status = "error";
          (record as { status: "error"; error: unknown }).error = err;
          reject(err);
        };
      }),
    };

    cache.set(src, record);
  }

  return cache.get(src)!;
}

export function readAvatar(src: string) {
  const record = loadImage(src);

  if (record.status === "pending") {
    throw record.promise;
  }

  if (record.status === "error") {
    throw record.error;
  }

  // ✅ resolved → render normally
}
