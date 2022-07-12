import { SearchForm } from "../SearchForm"
import { addTokenToWallet } from "../../services/metamask.service";
import { useEffect, useState } from "react";
import tokenList from "../../assets/tokens/tokens.json";
import { TokenInfo } from "../../interfaces/token/token.interface";

export const TokenInfokSearch = () => {
    const [ tokens, setTokens ] = useState([]);
    const [searchResults, setSearchResults] = useState([] as any[]);

    useEffect(() => {
        setTokens(Object.keys(tokenList).map((key) => {
            return { name: key, ...tokenList[key]}
        }))
    }, [])

    const filterResults = (keyword: string) => {
        const filteredTokens = tokens
            .filter((token: TokenInfo) => token.name.toString().toLowerCase().includes(keyword.toLowerCase()) || token.address.toLowerCase().includes(keyword.toLowerCase()) || token.symbol.toLowerCase().includes(keyword.toLowerCase()))

        setSearchResults([...filteredTokens]);
    }

    const addToken = async (token: TokenInfo) => {
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found");

            await addTokenToWallet(token);
        } catch (err) {
            console.log(err)
            /* setError(err.message); */
        }
    };

    const handleSearch = (keyword: string) => {
        if (keyword.length < 1) {
            setSearchResults([]);
            return;
        }

        filterResults(keyword);
    }

    const handleTokenClick = (token: TokenInfo) => (event) => {
        setSearchResults([]);
        addToken(token);
    }

    return (
        <>
            <SearchForm className="w-80 relative z-30" placeholder={"Search name, symbol, address..."} onSearch={handleSearch} onType={handleSearch} onSearchRemoved={() => { setSearchResults([]) }} />
            {
                searchResults.length > 0 ?
                    <div className='light-card rounded-b-2xl p-4 shadow-lg mx-auto flex flex-col space-y-4 absolute z-20 pt-16 w-80'>
                        {
                            searchResults.filter((r, i) => i < 10).map((r: any, i) => (
                                <p key={"results-" + i} className="cursor-pointer" onClick={handleTokenClick(r)}>{r.name + (!r.name.includes(r.symbol) ? " ("+ r.symbol +")" : "" )}</p>
                            ))
                        }
                    </div>
                    : null
            }
        </>
    )
}