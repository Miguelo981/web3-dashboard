import { useState } from "react";
import { networks } from "../../../interfaces/networks/networks";
import { connectToMetamask, web3 } from "../../../services/metamask.service";
import { SearchForm } from "../../SearchForm";

export const Navbar = ({ title }: any) => {
    const [searchResults, setSearchResults] = useState([] as any[]);
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
                blockExplorerUrls: network.explorers ? network.explorers.map(ex => ex.url) : []
            }

            if (!network.explorers) {
                delete newNetwork.blockExplorerUrls;
            }

            console.log(newNetwork)

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
        console.log(event)
        setNetwork(Number(event))
        //setNetwork(Number(event.target.value));
    }

    const handleSearch = (keyword: string) => {
        if (keyword.length < 1) {
            setSearchResults([]);
            return;
        }

        filterResults(keyword);
    }

    const filterResults = (keyword: string) => {
        const filteredNetwors = networks.filter((net) => net.chainId.toString().toLowerCase().includes(keyword.toLowerCase()) || net.chain.toLowerCase().includes(keyword.toLowerCase()) || net.name.toLowerCase().includes(keyword.toLowerCase()))
            .map((net) => { return { text: net.name + " ("+ net.chain +")", id: net.chainId, currency: net.nativeCurrency } });

        setSearchResults([...filteredNetwors]);
    }

    const handleNetworkClick = (netId: number) => (event) => {
        setSearchResults([]);
        setNetwork(netId);
        changeNetwork({ networkId: netId });
    }

    const handleNetworkAdd = () => {
        changeNetwork({ networkId })
    }

    return (
        <div className="p-4 flex justify-between items-center">
            <h2 className="text-5xl font-black">{title}</h2>
            <div className="flex space-x-6">
                <div className="flex flex-col">
                    <SearchForm className="w-80 relative z-30" onSearch={handleSearch} onType={handleSearch} />
                    {
                        searchResults.length > 0 ?
                            <div className='light-card rounded-b-2xl p-4 shadow-lg mx-auto flex flex-col space-y-4 absolute z-20 pt-16 w-80'>
                                {
                                    searchResults.filter((r, i) => i < 10).map((r: any, i) => (
                                        <p key={"results-" + i} className="cursor-pointer" onClick={handleNetworkClick(r.id)}>{r.text}</p>
                                    ))
                                }
                            </div>
                            : null
                    }
                    {/* <input type="text" onChange={handleNetworkSearch} /> */}
                </div>

                {/* <button onClick={handleNetworkAdd} className="app-btn rounded-lg py-1 px-8 border-transparent shadow-lg">
                    <strong className="text-2xl">Add</strong>
                </button> */}
                <button onClick={connect} className="app-btn rounded-lg py-1 px-8 border-transparent shadow-lg">
                    <strong className="text-2xl">Connect</strong>
                </button>
            </div>
        </div>
    )
}