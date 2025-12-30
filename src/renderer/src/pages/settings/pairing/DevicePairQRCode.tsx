import { Box, CircularProgress, Typography } from "@mui/material";

export function PairQRCode({
    qr,
    code,
    pairingId,
}: {
    qr: string | null;
    code: string;
    pairingId: string;
}) {
    return (
        <Box sx={{ textAlign: "center", width: '100%', height: '100%' }}>
            {qr ? <img src={qr} width={260} height={260} /> : <CircularProgress />}
            <Typography sx={{ mt: 2 }}>
                Pairing Code: <strong>{code}</strong>
            </Typography>
            <Typography sx={{ mt: 1 }} fontSize={12} color="text.secondary">
                Pairing ID: {pairingId}
            </Typography>
        </Box>
    );
}
