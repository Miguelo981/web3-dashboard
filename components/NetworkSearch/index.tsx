import { SearchForm } from "../SearchForm"
import { addNetworkToWallet, web3 } from "../../services/metamask.service";
import { useState } from "react";
import { ChainNetwork } from "../../interfaces/networks/network.interface";
import { networks } from "../../interfaces/networks/networks";

export const NetworkSearch = () => {
    const [searchResults, setSearchResults] = useState([] as any[]);
    const [networkId, setNetwork] = useState(1);

    const filterResults = (keyword: string) => {
        const filteredNetwors = networks.filter((net) => net.chainId.toString().toLowerCase().includes(keyword.toLowerCase()) || net.chain.toLowerCase().includes(keyword.toLowerCase()) || net.name.toLowerCase().includes(keyword.toLowerCase()))
            .map((net) => { return { text: net.name + " ("+ net.chain +")", id: net.chainId, currency: net.nativeCurrency } });

        setSearchResults([...filteredNetwors]);
    }

    const changeNetwork = async ({ networkId/* , setError */ }) => {
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found");

            const network = networks.find(net => net.chainId === networkId);

            if (!network) {
                console.log("Network doesn't exist")
            }

            const newNetwork: ChainNetwork = {
                chainId: web3.utils.toHex(network.chainId),
                chainName: network.name,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: network.rpc,
                blockExplorerUrls: network.explorers ? network.explorers.map(ex => ex.url) : []
            }

            if (!network.explorers) {
                delete newNetwork.blockExplorerUrls;
            }

            await addNetworkToWallet(newNetwork);
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

    const handleNetworkClick = (netId: number) => (event) => {
        setSearchResults([]);
        setNetwork(netId);
        changeNetwork({ networkId: netId });
    }

    const handleNetworkAdd = () => {
        changeNetwork({ networkId })
    }

    return (
        <>
            <SearchForm className="w-80 relative z-30" onSearch={handleSearch} onType={handleSearch} onSearchRemoved={() => { setSearchResults([]) }} />
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
        </>
    )
}