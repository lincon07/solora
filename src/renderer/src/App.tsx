import MiniDrawer from './drawer'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { UpdaterProvider } from './providers/updater';
import { MyThemeProvider } from './providers/theme/theme';
import { HubInfoProvider } from './providers/hub-info';

function App(): React.JSX.Element {

  return (
    <div>
      <MyThemeProvider>
        <BrowserRouter>
          <UpdaterProvider>
            <HubInfoProvider>
              <ToastContainer position='bottom-center' />
              <MiniDrawer />
            </HubInfoProvider>
          </UpdaterProvider>
        </BrowserRouter>
      </MyThemeProvider>
    </div>
  )
}

export default App
