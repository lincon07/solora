import MiniDrawer from "./drawer"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { UpdaterProvider } from "./providers/updater"
import { MyThemeProvider } from "./providers/theme/theme"
import { HubInfoProvider } from "./providers/hub-info"
import React, { useEffect } from "react"
import "./assets/main.css"
import Idle from "./idle/idle"
import { HeartbeatProvider } from "./providers/heartbeat"
import HubGate from "./providers/gate"
function App(): React.JSX.Element {
  const [isIdle, setIsIdle] = React.useState(false)

  useEffect(() => {
    let idleTimeout: NodeJS.Timeout
    let activityEvents = ["mousemove", "keydown", "mousedown", "touchstart"]

    const resetIdleTimer = () => {
      clearTimeout(idleTimeout)
      setIsIdle(false)
      idleTimeout = setTimeout(() => setIsIdle(true), 5 * 60 * 1000) // 5 minutes
    }

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetIdleTimer)
    )

    resetIdleTimer() // Initialize the timer on mount

    return () => {
      clearTimeout(idleTimeout)
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      )
    }
  }, [])

  return (
    <MyThemeProvider>
      <BrowserRouter>
        <UpdaterProvider>
          <HubGate> 
          <HubInfoProvider>
            <HeartbeatProvider>
            <ToastContainer position="bottom-center" />
            {isIdle ? <Idle /> : <MiniDrawer />}
             </HeartbeatProvider>
          </HubInfoProvider>
          </HubGate>
        </UpdaterProvider>
      </BrowserRouter>
    </MyThemeProvider>
  )
}

export default App
