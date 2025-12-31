import { ipcMain, app, session } from "electron";
import { clearDeviceToken } from "./device";

/**
 * Clear device token (forces re-pair)
 */
ipcMain.handle("danger:clear-device-token", async () => {
  clearDeviceToken();
  return true;
});

/**
 * Clear Electron cache + storage
 */
ipcMain.handle("danger:clear-cache", async () => {
  try {
    const ses = session.defaultSession;

    await ses.clearCache();
    await ses.clearStorageData({
      storages: [
        "cookies",
        "localstorage",
        "indexdb",
        "serviceworkers",
        "cachestorage",
      ],
    });

    return true;
  } catch (err) {
    console.error("[danger] Failed to clear cache", err);
    throw err;
  }
});

/**
 * Full local factory reset (local only)
 */
ipcMain.handle("danger:factory-reset-local", async () => {
  clearDeviceToken();
  app.relaunch();
  app.exit(0);
});
