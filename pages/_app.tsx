import '../styles/globals.scss';
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import { store, persistor } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import SnackbarProvider from 'react-simple-snackbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
        <SnackbarProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Component {...pageProps} />
            </PersistGate>
          </Provider>
        </SnackbarProvider>
    </>
  )
}

export default MyApp