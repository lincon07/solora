import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
} from "@mui/material";
import { DangerConfirmDialog } from "../dialogs/danger-dialog";




export default function DangerArea() {
    const [confirm, setConfirm] = useState<null | {
        title: string;
        description: string;
        confirmLabel: string;
        action: () => void;
    }>(null);

    /* ---------------- Actions ---------------- */

    const clearLocalData = async () => {
        await window.danger.clearDeviceToken();
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    };

    const clearCache = async () => {
        await window.danger.clearCache();
        window.location.reload();
    };

    const unpairHub = async () => {
        await window.danger.clearDeviceToken();
        window.location.href = "/settings/pair";
    };

    const factoryReset = async () => {
        await fetch("/hub/factory-reset", { method: "POST" });
        await window.danger.factoryResetLocal();
    };


    return (
        <>
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    border: "1px solid",
                    borderColor: "error.main",
                }}
            >
                <CardHeader
                    title="Danger Zone"
                    subheader="Irreversible and destructive actions"
                    titleTypographyProps={{ color: "error.main", fontWeight: 700 }}
                />

                <CardContent>
                    {/* ---------------- Clear App Data ---------------- */}
                    <Box sx={{ mb: 3 }}>
                        <Typography fontWeight={600}>Clear Local App Data</Typography>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                            Removes local storage, cached state, and device credentials.
                        </Typography>
                        <Button
                            color="error"
                            variant="outlined"
                            onClick={() =>
                                setConfirm({
                                    title: "Clear Local App Data?",
                                    description:
                                        "This will remove all local application data and restart the app. You may need to pair again.",
                                    confirmLabel: "Clear Data",
                                    action: clearLocalData,
                                })
                            }
                        >
                            Clear App Data
                        </Button>
                    </Box>

                    <Divider />

                    {/* ---------------- Clear Cache ---------------- */}
                    <Box sx={{ my: 3 }}>
                        <Typography fontWeight={600}>Clear Cache</Typography>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                            Clears cached resources and reloads the application.
                        </Typography>
                        <Button
                            color="error"
                            variant="outlined"
                            onClick={() =>
                                setConfirm({
                                    title: "Clear Cache?",
                                    description:
                                        "This will clear cached resources and reload the app.",
                                    confirmLabel: "Clear Cache",
                                    action: clearCache,
                                })
                            }
                        >
                            Clear Cache
                        </Button>
                    </Box>

                    <Divider />

                    {/* ---------------- Unpair Hub ---------------- */}
                    <Box sx={{ my: 3 }}>
                        <Typography fontWeight={600}>Unpair This Hub</Typography>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                            Disconnects this device from the hub.
                        </Typography>
                        <Button
                            color="error"
                            variant="outlined"
                            onClick={() =>
                                setConfirm({
                                    title: "Unpair Hub?",
                                    description:
                                        "This device will be unpaired from the hub and must be paired again.",
                                    confirmLabel: "Unpair Hub",
                                    action: unpairHub,
                                })
                            }
                        >
                            Unpair Hub
                        </Button>
                    </Box>

                    <Divider />

                    {/* ---------------- Factory Reset ---------------- */}
                    <Box sx={{ mt: 3 }}>
                        <Typography fontWeight={700} color="error.main">
                            Factory Reset Hub
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                            Permanently deletes hub data, members, devices, and settings.
                        </Typography>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() =>
                                setConfirm({
                                    title: "Factory Reset Hub?",
                                    description:
                                        "This will permanently delete ALL hub data. This action cannot be undone.",
                                    confirmLabel: "Factory Reset",
                                    action: factoryReset,
                                })
                            }
                        >
                            Factory Reset
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* ---------------- Confirmation Dialog ---------------- */}
            {confirm && (
                <DangerConfirmDialog
                    open
                    title={confirm.title}
                    description={confirm.description}
                    confirmLabel={confirm.confirmLabel}
                    onConfirm={confirm.action}
                    onClose={() => setConfirm(null)}
                />
            )}
        </>
    );
}