import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useSound } from "react-sounds";
import effect from "../../../../resources/solora_media_click.mp3";

export interface UpdaterContextType {
  checkForUpdates: () => Promise<void>;
}

export const UpdaterContext =
  React.createContext<UpdaterContextType | null>(null);

export const UpdaterProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  /* ---------------- Sound ---------------- */

  const { play, stop } = useSound(effect, {
    volume: 0.35,
  });

  const isPlayingRef = useRef(false);
  const lastPlayRef = useRef(0);

  const PLAY_COOLDOWN_MS = 120; // 👌 subtle, non-spammy

  const playClickSound = () => {
    const now = Date.now();

    if (isPlayingRef.current) return;
    if (now - lastPlayRef.current < PLAY_COOLDOWN_MS) return;

    isPlayingRef.current = true;
    lastPlayRef.current = now;

    play();

    setTimeout(() => {
      isPlayingRef.current = false;
    }, PLAY_COOLDOWN_MS);
  };

  /* ---------------- Updates ---------------- */

  const checkForUpdates = async () => {
    window?.updater?.checkForUpdates();
  };

  useEffect(() => {
    const offAvailable = window.updater.onUpdateAvailable(() => {
      toast.info("Update available");
    });

    const offDownloaded = window.updater.onUpdateDownloaded(() => {
      toast.success("Update ready — restarting");
      setTimeout(() => window.updater.restart(), 1500);
    });

    const offNoUpdate = window.updater.onNoUpdateAvailable(() => {
      toast.info("No update available");
    });

    const offError = window.updater.onUpdateError(() => {
      toast.error("Error checking for updates");
    });

    return () => {
      offAvailable();
      offDownloaded();
      offNoUpdate();
      offError();
    };
  }, []);

  /* ---------------- Global Click Listener ---------------- */

//   useEffect(() => {
//     const handleClick = () => {
//       playClickSound();
//     };

//     document.addEventListener("click", handleClick);

//     console.log("🔊 Click sound listener enabled");

//     return () => {
//       document.removeEventListener("click", handleClick);
//     };
//   }, []);

  /* ---------------- Context ---------------- */

  const value: UpdaterContextType = {
    checkForUpdates,
  };

  return (
    <UpdaterContext.Provider value={value}>
      {children}
    </UpdaterContext.Provider>
  );
};
