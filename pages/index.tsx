import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout'
import { Navbar } from '../components/layout/navbar'
import { NetworkDetail } from '../components/NetworkDetail';
import { SendTrasaction } from '../components/SendTransaction';
import { MetamaskNetwork } from '../interfaces/networks/network.interface';
import { connectToMetamask, getChainInfo, getChainInfoById, getNetworkBalance, getTokenInfo, getWalletAddress, web3 } from '../services/metamask.service';
import { addAddress, removeAddress } from '../store/reducers/address.reducer';
import { addNetwork } from '../store/reducers/networks.reducer';

const IndexPage = () => {
  const networks: MetamaskNetwork[] = useSelector((state: any) => state.networks.networks);
  const [network, setNetwork] = useState(undefined);
  //const [networks, setNetworks] = useState([]);
  const [token, setToken] = useState(undefined);
  const [token2, setToken2] = useState(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      await connectToMetamask();

      dispatch(addAddress(await getWalletAddress()));

      const chainInfo = getChainInfo();
      const { balance } = await getNetworkBalance();

      setNetwork({ balance, chainInfo });
      dispatch(addNetwork({ tokens: [], balance: balance, name: chainInfo.name, nativeCurrency: chainInfo.nativeCurrency, chainId: chainInfo.chainId }));

      const t = await getTokenInfo('0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7'/* '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' */);

      if (t) setToken(t);

      const t2 = await getTokenInfo('0xEB58343b36C7528F23CAAe63a150240241310049');

      if (t2) setToken2(t2);

      const { ethereum } = window;

      /* ethereum.on('disconnect', (error) => {
        dispatch(removeAddress());
      }); */

      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length < 1) {
          console.log(accounts)
          dispatch(removeAddress());

          return;
        }
      });

      ethereum.on('chainChanged', async (chainId: string) => {
        const chainInfo = getChainInfoById(web3.utils.hexToNumber(chainId));
        const { balance } = await getNetworkBalance();

        dispatch(addNetwork({ tokens: [], balance: balance, name: chainInfo.name, nativeCurrency: chainInfo.nativeCurrency, chainId: chainInfo.chainId }));
      });
    }

    getToken();
  }, [])

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <div className='container mx-auto relative z-10'>
        <h1 className="text-7xl font-bold my-12">Wallet Balance</h1>
        {/* {
          network ?
            <NetworkDetail network={network?.chainInfo} tokens={[{ balance: network.balance, symbol: network.chainInfo.nativeCurrency.symbol }, token2, token2, token2, token2]} />
          : null
        } */}
        {
          networks ?
            networks.map((network: MetamaskNetwork) =>
            (
              <div className='mb-20'>
                <NetworkDetail network={network} tokens={[{ balance: network.balance, symbol: network.nativeCurrency.symbol }, token2, token2, token2, token2]} />
              </div>
            )
            )
            : null
        }
        {
          network ?
            <SendTrasaction />
          : null
        }
      </div>
    </Layout>
  )
}

export default IndexPage
