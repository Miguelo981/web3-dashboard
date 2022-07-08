import { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import { Navbar } from '../components/layout/navbar'
import { connectToMetamask, DESTINATION_ADDRESS, getChainInfo, getNetworkBalance, getTokenInfo, getWalletAddress, sendNetworkBalance, web3 } from '../services/metamask.service';

const IndexPage = () => {
  const [network, setNetwork] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [token2, setToken2] = useState(undefined);
  const [amount, setAmount] = useState("0");
  const [destinationAddress, setDestinationAddress] = useState(DESTINATION_ADDRESS);
  const [validAddress, setValidAddress] = useState(true);
  let currencyAmout = 4560;
  let currencySymbol = "€";
  let cryptoCurrencyAmount = 1.51354;
  let selectedCryptoCurrency = "ETH";

  useEffect(() => {
    const getToken = async () => {
      await connectToMetamask();
      const chainInfo = getChainInfo();
      const { balance } = await getNetworkBalance();

      setNetwork({ balance, chainInfo });

      const t = await getTokenInfo('0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7'/* '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' */);

      if (t) setToken(t);

      const t2 = await getTokenInfo('0xEB58343b36C7528F23CAAe63a150240241310049');

      if (t2) setToken2(t2);
    }

    getToken();
  }, [])

  const handleAmountInput = (event) => {
    const value = Number(event.target.value);

    if (value > network?.balance) {
      setAmount(network?.balance);
      return;
    }

    setAmount(value.toString());
  }

  const handleMaxAmount = (event) => {
    setAmount(network?.balance);
  }

  const handleSendClick = () => {
    if (destinationAddress === '' || amount === '0') return;

    getWalletAddress().then(address => sendNetworkBalance(address, destinationAddress, amount));
  }

  const handleAddressInput = (event) => {
    const address = event.target.value;

    setValidAddress(web3.utils.isAddress(address));
    setDestinationAddress(address);
  }

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <div className='container mx-auto relative z-10'>
        <h1 className="text-7xl font-bold my-12">Wallet Balance</h1>

        <div className='absolute z-30 app-bg p-3 -mt-8 ml-12'>
          <h2 className="text-3xl font-bold">{network?.chainInfo.name}</h2>
        </div>
        <div className="relative z-10 flex flex-wrap gap-8 p-12 mb-8 border-teal-500 border-solid border-2 rounded-3xl">
          {
            network ?
              <div className="rounded-3xl card p-6 shadow-lg w-96 h-auto flex flex-col">
                <h3 className="text-3xl font-black mb-4 text-start">Total Balance:</h3>
                <p className="text-4xl text-end font-bold">{Number(network.balance).toFixed(8)} {network.chainInfo.nativeCurrency.symbol}</p>
              </div>
            : null
          }
          {
            token ?
              <div className="rounded-3xl card p-6 shadow-lg w-96 h-auto flex flex-col">
                <h3 className="text-3xl font-black mb-4 text-start">Total Balance:</h3>
                <p className="text-4xl text-end font-bold">{Number(token.balance).toFixed(8)} {token.symbol}</p>
              </div>
              : null
          }
          {
            token2 ?
              <div className="rounded-3xl card p-6 shadow-lg w-96 h-auto flex flex-col">
                <h3 className="text-3xl font-black mb-4 text-start">Total Balance:</h3>
                <p className="text-4xl text-end font-bold">{Number(token2.balance).toFixed(8)} {token2.symbol}</p>
              </div>
              : null
          }
        </div>

        <div className="rounded-3xl card p-6 shadow-lg flex flex-col gap-5 mb-8">
          <h2 className="text-4xl font-bold">Send Transaction</h2>
          <label className='text-2xl font-bold' htmlFor='token-amount'>Token amount ({network?.chainInfo.nativeCurrency.symbol}):</label>
          <div className="flex gap-4 w-full">
            <input name="" className='w-full p-2 rounded-xl' type="text" onChange={handleAmountInput} value={amount} />
            <button onClick={handleMaxAmount} className='app-btn p-2 px-5 rounded-xl font-bold'>Max</button>
          </div>
          <label className='text-2xl font-bold' htmlFor='destination-address'>Destination:</label>
          <input name='destination-address' type="text" onChange={handleAddressInput} className="p-2 rounded-xl" value={destinationAddress} />
          { !validAddress ? <small className='text-red-500'>This address is invalid</small> : null }
          {/* <hr className="my-4" /> */}
          <button onClick={handleSendClick} disabled={!validAddress || Number(amount) <= 0} className='app-btn h-11 rounded-xl font-bold'>Send {network?.chainInfo.nativeCurrency.symbol}</button>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
