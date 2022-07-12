import '../styles/globals.scss';
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { web3 } from '../services/metamask.service';

function MyApp({ Component, pageProps }: AppProps) {
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
      console.log(web3.utils.hexToNumber(chainId))
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
      <Component {...pageProps} />
    </>
  )
}

export default MyApp