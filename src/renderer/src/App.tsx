import MiniDrawer from './drawer'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { UpdaterProvider } from './providers/updater';
import { MyThemeProvider } from './providers/theme/theme';
import { HubInfoProvider } from './providers/hub-info';
import { HeartbeatProvider } from './providers/heartbeat';
import { useEffect } from 'react';
import { ipcMain } from 'electron';

function App(): React.JSX.Element {

  useEffect(() => {
    window.electron.ipcRenderer.invoke('show-keyboard')
  }, [])
  return (
    <div>
      <MyThemeProvider>
        <BrowserRouter>
          <UpdaterProvider>
            <HubInfoProvider>
              {/* <HeartbeatProvider>  */}
              <ToastContainer position='bottom-center' />
              <MiniDrawer />
              {/* </HeartbeatProvider> */}
            </HubInfoProvider>
          </UpdaterProvider>
        </BrowserRouter>
      </MyThemeProvider>
    </div>
  )
}

export default App
