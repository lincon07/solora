import MiniDrawer from './drawer'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { UpdaterProvider } from './providers/updater';
import { MyThemeProvider } from './providers/theme';

function App(): React.JSX.Element {

  return (
    <div>
      <MyThemeProvider>
        <BrowserRouter>
          <UpdaterProvider>
            <ToastContainer position='bottom-center' />
            <MiniDrawer />
          </UpdaterProvider>
        </BrowserRouter>
      </MyThemeProvider>
    </div>
  )
}

export default App
