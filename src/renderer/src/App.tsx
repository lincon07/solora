import MiniDrawer from "./drawer"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { UpdaterProvider } from "./providers/updater"
import { MyThemeProvider } from "./providers/theme/theme"
import { HubInfoProvider } from "./providers/hub-info"
import { useEffect } from "react"

function App(): React.JSX.Element {
  // useEffect(() => {
  //   const handleFocusIn = (e: FocusEvent) => {
  //     const target = e.target as HTMLElement
  //     if (
  //       target &&
  //       (target.tagName === "INPUT" ||
  //         target.tagName === "TEXTAREA" ||
  //         target.isContentEditable)
  //     ) {
  //       window.keyboard?.show()
  //     }
  //   }

  //   const handleFocusOut = () => {
  //     // small delay avoids flicker when switching inputs
  //     setTimeout(() => {
  //       const active = document.activeElement as HTMLElement | null
  //       if (
  //         !active ||
  //         (active.tagName !== "INPUT" &&
  //           active.tagName !== "TEXTAREA" &&
  //           !active.isContentEditable)
  //       ) {
  //         window.keyboard?.hide()
  //       }
  //     }, 150)
  //   }

  //   document.addEventListener("focusin", handleFocusIn)
  //   document.addEventListener("focusout", handleFocusOut)

  //   return () => {
  //     document.removeEventListener("focusin", handleFocusIn)
  //     document.removeEventListener("focusout", handleFocusOut)
  //   }
  // }, [])

  return (
    <MyThemeProvider>
      <BrowserRouter>
        <UpdaterProvider>
          <HubInfoProvider>
            <ToastContainer position="bottom-center" />
            <MiniDrawer />
          </HubInfoProvider>
        </UpdaterProvider>
      </BrowserRouter>
    </MyThemeProvider>
  )
}

export default App
