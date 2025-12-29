import MiniDrawer from './drawer'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { UpdaterProvider } from './providers/updater';

function App(): React.JSX.Element {

  return (
    <div>
      <BrowserRouter>
        <UpdaterProvider>
          {/* <MyThemeProvider>  */}
          <ToastContainer position='bottom-center' />
          <MiniDrawer />
          {/* </MyThemeProvider> */}
        </UpdaterProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
