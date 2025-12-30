import React, { useEffect } from "react";
import { toast } from "react-toastify";

export interface UpdaterContextType {
  checkForUpdates: () => Promise<void>;
}

export const UpdaterContext =
  React.createContext<UpdaterContextType | null>(null);

export const UpdaterProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {


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
