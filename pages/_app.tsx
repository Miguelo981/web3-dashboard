import '../styles/globals.scss';
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import { store, persistor } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import SnackbarProvider from 'react-simple-snackbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <Head>
          <title>Miguelo DEV Blog</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
          <link href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap' rel="stylesheet" />
        </Head> */}
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