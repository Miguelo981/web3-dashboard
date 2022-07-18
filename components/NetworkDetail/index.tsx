import { MetamaskNetwork } from "../../interfaces/networks/network.interface";
import { TokenInfo } from "../../interfaces/token/token.interface";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeNetwork, updateNetwork } from "../../store/reducers/networks.reducer";
import 'swiper/css';
import { Spinner } from "../Spinner";
import { TokenModal } from "../modals/TokenModal";
import { web3 } from "../../services/metamask.service";
import { removeCustomToken } from "../../store/reducers/custom-tokens.reducer";

type NetworkDetailProps = {
    network: MetamaskNetwork;
    tokens: TokenInfo[];
    loading?: boolean;
}

export const NetworkDetail = ({ network, tokens, loading }: NetworkDetailProps) => {
    const [tokenList, setTokenList] = useState(tokens || []);
    const [modalShow, setModalShow] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const nativeTokenExists = tokens.find(token => network && (network.nativeCurrency?.address === token?.address || network.nativeCurrency?.symbol === token?.symbol));

        //if (nativeTokenExists || network) return;
        if (!nativeTokenExists && network) {
            console.log(nativeTokenExists, 'entered', network)
            tokens.splice(0, 0, { balance: network.balance, symbol: network.nativeCurrency.symbol, decimals: "18" }).join();
        }

        setTokenList([...tokens]);
    }, [tokenList])

    const addToken = (event) => {
        if (network.chainId !== Number(window.ethereum.networkVersion)) return;

        setModalShow(true);
    }

    const handleRemove = (event) => {
        dispatch(removeNetwork(network));
    }

    const handleModalClose = () => {
        setModalShow(false);
    }

    const handleTokenAdded = (token: TokenInfo, exists: boolean) => {
        if (!exists) return;

        tokens.push(token);
        dispatch(updateNetwork({ tokens: tokens, balance: network.balance, name: network.name, nativeCurrency: network.nativeCurrency, chainId: network.chainId }));
        setTokenList([...tokens]);
    }

    const handleRemoveToken = (token: TokenInfo) => {
        const index = tokens.indexOf(token);

        if (index === -1) return;

        tokens.splice(index, 1);
        dispatch(removeCustomToken(token));
        setTokenList([...tokens]);
        dispatch(updateNetwork({ tokens: tokens, balance: network.balance, name: network.name, nativeCurrency: network.nativeCurrency, chainId: network.chainId }));
        console.log(tokens)
    }

    return (
        <>
            <TokenModal show={modalShow} closeEvent={handleModalClose} onTokenAdded={handleTokenAdded} />
            <div className='absolute z-30 app-bg p-3 -mt-8 ml-12'>
                <h2 className="text-3xl font-bold">{network?.name}</h2>
            </div>
            <div className='absolute z-30 app-bg p-3 -mt-8 right-10'>
                <h2 onClick={handleRemove} className="text-3xl font-bold cursor-pointer hover:text-teal-600">X</h2>
            </div>
            <div className="relative z-10 flex flex-wrap gap-8 p-12 mb-8 border-teal-500 border-solid border-2 rounded-3xl">
                {
                    tokenList && !loading ?
                        <Swiper
                            className="w-full"
                            spaceBetween={30}
                            slidesPerView={4.5}
                        >
                            {
                                tokenList.map((token, index) => (
                                    <SwiperSlide key={`token-slide-${index}`}>
                                        <div className="rounded-3xl card p-6 shadow-lg max-w-sm h-auto flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-2xl font-black text-start">Total Balance:</h3>
                                                <img onClick={() => {handleRemoveToken(token)}} src="/assets/icons/delete.svg" className="h-5 w-auto cursor-pointer" alt="" />
                                            </div>
                                            
                                            <p className="text-3xl text-end font-bold">{Number(token?.balance).toFixed(6)} {token?.symbol}</p>
                                        </div>
                                    </SwiperSlide>
                                    )
                                )
                            }
                            <SwiperSlide>
                                <div className="rounded-3xl p-6 max-w-xs h-auto flex">
                                    <p onClick={addToken} className={"text-7xl font-bold ml-10 " + ( network.chainId === Number(window.ethereum.networkVersion) ? 'cursor-pointer text-white hover:text-gray-200' : 'text-gray-300') }>+</p>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                        : 
                        loading ?
                            <div className="mx-auto">
                                <Spinner />
                            </div>
                        : null
                }
            </div>
        </>
    )
}