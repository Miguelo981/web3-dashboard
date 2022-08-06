import { useEffect, useState } from "react";
import { connectToMetamask, DESTINATION_ADDRESS, getChainInfo, getChainInfoById, getNetworkBalance, getWalletAddress, sendNetworkBalance, web3 } from "../../services/metamask.service";

export const SendTrasaction = () => {
    const [network, setNetwork] = useState(undefined);
    const [amount, setAmount] = useState("0");
    const [destinationAddress, setDestinationAddress] = useState(DESTINATION_ADDRESS);
    const [validAddress, setValidAddress] = useState(true);

    useEffect(() => {
        initWallet();
    }, [])

    const handleAmountInput = (event) => {
        const value = Number(event.target.value);

        if (value > network?.balance) {
            setAmount(network?.balance);
            return;
        }

        setAmount(value.toString());
    }

    const initWallet = async () => {
        const chainInfo = getChainInfo();
        const { balance } = await getNetworkBalance();

        setNetwork({ balance, chainInfo });

        const { ethereum } = window;

        ethereum.on('chainChanged', async (chainId: string) => {
            const chainInfo = getChainInfoById(web3.utils.hexToNumber(chainId));
            const { balance } = await getNetworkBalance();

            setNetwork({ balance, chainInfo });
        });
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
        <div className="rounded-3xl card p-6 shadow-lg flex flex-col gap-5 mb-8">
            <h2 className="text-4xl font-bold">Send Transaction</h2>
            <label className='text-2xl font-bold' htmlFor='token-amount'>Token amount ({network?.chainInfo.nativeCurrency.symbol}):</label>
            <div className="flex gap-4 w-full">
                <input name="" className='w-full p-2 rounded-xl' type="text" onChange={handleAmountInput} value={amount} />
                <button onClick={handleMaxAmount} className='app-btn p-2 px-5 rounded-xl font-bold'>Max</button>
            </div>
            <label className='text-2xl font-bold' htmlFor='destination-address'>Destination:</label>
            <input name='destination-address' type="text" onChange={handleAddressInput} className="p-2 rounded-xl" value={destinationAddress} />
            {!validAddress ? <small className='text-red-500'>This address is invalid</small> : null}
            {/* <hr className="my-4" /> */}
            <button onClick={handleSendClick} disabled={!validAddress || Number(amount) <= 0} className='app-btn h-11 rounded-xl font-bold'>Send {network?.chainInfo.nativeCurrency.symbol}</button>
        </div>
    )
}