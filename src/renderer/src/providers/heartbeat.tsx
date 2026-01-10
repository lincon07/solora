import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { fetchHealth } from "../../api/health"
import { HubInfoContext } from "./hub-info"

import {
  Backdrop,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material"

import CloudOffIcon from "@mui/icons-material/CloudOff"
import RefreshIcon from "@mui/icons-material/Refresh"

/* ========================================================= */

export interface HeartbeatContextType {
  isConnected: boolean
}

export const HeartbeatContext =
  createContext<HeartbeatContextType | null>(null)

/* ========================================================= */

export const HeartbeatProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const hubInfo = useContext(HubInfoContext)
  const hubId = hubInfo?.hubId
  const paired = hubInfo?.paired

  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)

  const timeoutRef = useRef<number | null>(null)

  /* ========================================================= */
  /* FAIL SAFE */
  /* ========================================================= */

  const startFailSafe = () => {
    clearFailSafe()
    timeoutRef.current = window.setTimeout(() => {
      setIsConnected(false)
    }, 10_000)
  }

  const clearFailSafe = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  /* ========================================================= */
  /* API CHECK */
  /* ========================================================= */

  const checkApi = async () => {
    if (!hubId) return

    try {
      setChecking(true)
      startFailSafe()

      const res = await fetchHealth()

      if (res.ok) {
        clearFailSafe()
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    } catch {
      setIsConnected(false)
    } finally {
      setChecking(false)
    }
  }

  /* ========================================================= */
  /* INIT */
  /* ========================================================= */

  useEffect(() => {
    if (!paired) {
      // ✅ Do NOT block UI when not paired
      setIsConnected(true)
      return
    }

    setIsConnected(null)
    checkApi()

    const interval = setInterval(checkApi, 15_000)
    return () => clearInterval(interval)
  }, [hubId, paired])

  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (paired && isConnected === null) {
    return (
      <Backdrop open sx={{ zIndex: 1300 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">
            Checking API connection…
          </Typography>
        </Stack>
      </Backdrop>
    )
  }

  /* ========================================================= */
  /* DISCONNECTED */
  /* ========================================================= */

  if (paired && !isConnected) {
    return (
      <Backdrop
        open
        sx={{
          zIndex: 1300,
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        <Card sx={{ maxWidth: 420, mx: 2, borderRadius: 4 }}>
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <CloudOffIcon sx={{ fontSize: 64, color: "error.main" }} />
              <Typography variant="h5" fontWeight={600}>
                API Disconnected
              </Typography>
              <Typography color="text.secondary" textAlign="center">
                Your hub can’t reach the API service.
              </Typography>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={checkApi}
                disabled={checking}
                fullWidth
              >
                {checking ? "Reconnecting…" : "Retry Connection"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Backdrop>
    )
  }

  return (
    <HeartbeatContext.Provider value={{ isConnected: true }}>
      {children}
    </HeartbeatContext.Provider>
  )
}
