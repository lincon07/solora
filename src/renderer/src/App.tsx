import MiniDrawer from "./drawer"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { UpdaterProvider } from "./providers/updater"
import { MyThemeProvider } from "./providers/theme/theme"
import { HubInfoProvider } from "./providers/hub-info"
import { useEffect } from "react"
import "./assets/main.css"
function App(): React.JSX.Element {

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
