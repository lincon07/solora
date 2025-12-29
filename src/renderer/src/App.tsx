import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import MiniDrawer from './drawer'
import { BrowserRouter } from 'react-router-dom'
  import { ToastContainer, toast } from 'react-toastify';
import { UpdaterProvider } from './providers/updater';
import { MyThemeProvider } from './providers/theme';

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div>
      <BrowserRouter>
      <UpdaterProvider> 
        {/* <MyThemeProvider>  */}
          <ToastContainer position='bottom-center'/>
          <MiniDrawer />
        {/* </MyThemeProvider> */}
        </UpdaterProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
