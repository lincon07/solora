import { Button } from "@mui/material";
import { UpdaterContext } from "@renderer/providers/updater";
import React from "react";


export default function SettingsPage() {
    const updater = React.useContext(UpdaterContext)
    return (
        <>
            <h1>Settings Page</h1>
            <Button variant="contained" onClick={() => { updater?.checkForUpdates()
            }}>Check for Updates</Button>
        </>
    )
}