import { useState } from "react";
import { networks } from "../../../interfaces/networks/networks";
import { connectToMetamask, web3 } from "../../../services/metamask.service";

export const Navbar = ({ title }: any) => {
    const [networkId, setNetwork] = useState(1);
    const connect = async () => {
        connectToMetamask()
    }

    const changeNetwork = async ({ networkId/* , setError */ }) => {
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found");

            const network = networks.find(net => net.chainId === networkId);

            if (!network) {
                console.log("Network doesn't exist")
            }

            const newNetwork = {
                chainId: web3.utils.toHex(network.chainId),
                chainName: network.name,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: network.rpc,
                blockExplorerUrls: network.explorers.map(ex => ex.url)
            }

            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    newNetwork
                ]
            });
        } catch (err) {
            console.log(err)
            /* setError(err.message); */
        }
    };

    const handleNetworkSearch = (event) => {
        setNetwork(Number(event.target.value));
    }

    const handleNetworkAdd = () => {
        changeNetwork({ networkId })
    }

    return (
        <div className="p-4 flex justify-between items-center">
            <h2 className="text-5xl font-black">{title}</h2>
            <div className="flex space-x-6">
                <input type="text" onChange={handleNetworkSearch} />
                <button onClick={handleNetworkAdd} className="app-btn rounded-lg py-1 px-8 border-transparent shadow-lg">
                    <strong className="text-2xl">Add</strong>
                </button>
                <button onClick={connect} className="app-btn rounded-lg py-1 px-8 border-transparent shadow-lg">
                    <strong className="text-2xl">Connect</strong>
                </button>
            </div>
        </div>
    )
}