import '../styles/globals.scss';
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { getChainInfo, web3 } from '../services/metamask.service';
import { useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import { store, persistor } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';

function MyApp({ Component, pageProps }: AppProps) {
  //const dispatch = useDispatch();

  useEffect(() => {
    const { ethereum } = window;

    ethereum.on('connect', (connectInfo) => {

    });
    ethereum.on('disconnect', (error) => {

    });

    ethereum.on('accountsChanged', (accounts) => {
      console.log(accounts)
    });

    ethereum.on('chainChanged', (chainId: string) => {
      console.log(web3.utils.hexToNumber(chainId), getChainInfo())

      //dispatch(getChainInfo() as any);
      //window.location.reload();
    });
  })

  return (
    <>
      {/* <Head>
          <title>Miguelo DEV Blog</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
          <link href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap' rel="stylesheet" />
        </Head> */}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  )
}

export default MyApp