import { SearchForm } from "../SearchForm"
import { useState } from "react";
import { networks } from "../../interfaces/networks/networks";
import { SearchProps } from "../TokenInfoSearch";

export const NetworkSearch = ({ onItemSearch, className }: SearchProps) => {
    const [searchResults, setSearchResults] = useState([] as any[]);

    const filterResults = (keyword: string) => {
        const filteredNetwors = networks.filter((net) => net.chainId.toString().toLowerCase().includes(keyword.toLowerCase()) || net.chain.toLowerCase().includes(keyword.toLowerCase()) || net.name.toLowerCase().includes(keyword.toLowerCase()))
            .map((net) => { return { text: net.name + " ("+ net.chain +")", id: net.chainId, currency: net.nativeCurrency } });

        setSearchResults([...filteredNetwors]);
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
        onItemSearch(netId)
    }

    return (
        <>
            <SearchForm className={ className || "z-30"} onSearch={handleSearch} onType={handleSearch} onSearchRemoved={() => { setSearchResults([]) }} />
            {
                searchResults.length > 0 ?
                    <div className='light-card rounded-b-2xl p-4 shadow-lg mx-auto flex flex-col space-y-4 absolute z-20 pt-16 w-full'>
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