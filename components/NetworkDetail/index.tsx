import { ChainNetwork, MetamaskNetwork } from "../../interfaces/networks/network.interface";
import { TokenInfo } from "../../interfaces/token/token.interface";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeNetwork, updateNetwork } from "../../store/reducers/networks.reducer";
import 'swiper/css';
import { Spinner } from "../Spinner";
import { TokenModal } from "../modals/TokenModal";
import { addNetworkToWallet, changeToMainNet, web3 } from "../../services/metamask.service";
import { removeCustomToken } from "../../store/reducers/custom-tokens.reducer";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { networks } from "../../interfaces/networks/networks";
import { useSnackbar } from 'react-simple-snackbar';
import Image from "next/image";

type NetworkDetailProps = {
    network: MetamaskNetwork;
    tokens: TokenInfo[];
    loading?: boolean;
}

export const NetworkDetail = ({ network, tokens, loading }: NetworkDetailProps) => {
    const [openSnackbar, closeSnackbar] = useSnackbar({ duration: 2000, position: 'top-right' })
    const [tokenList, setTokenList] = useState(tokens || []);
    const [modalShow, setModalShow] = useState(false);
    const { height, width } = useWindowDimensions();
    const dispatch = useDispatch();

    useEffect(() => {
        handleUpdateTokenList();
    }, [])

    const handleUpdateTokenList = () => {
        const nativeTokenExists = tokens.find(token => network && (network.nativeCurrency?.address === token?.address || network.nativeCurrency?.symbol === token?.symbol));

        //if (nativeTokenExists || network) return;
        if (!nativeTokenExists && network) {
            console.log(nativeTokenExists, 'entered', network)
            tokens.splice(0, 0, { balance: network.balance, symbol: network.nativeCurrency.symbol, decimals: "18" }).join();
        }

        setTokenList([...tokens]);
    }

    const addToken = (event) => {
        if (network.chainId !== Number(window.ethereum.networkVersion)) return;

        setModalShow(true);
    }

    const handleRemove = (event) => {
        dispatch(removeNetwork(network));
        openSnackbar("Network removed successfully");
    }

    const handleModalClose = () => {
        setModalShow(false);
    }

    const handleTokenAdded = (token: TokenInfo, exists: boolean) => {
        if (!exists) {
            openSnackbar("Token doesn't belong to the actual network");
            return;
        }

        tokens.push(token);
        dispatch(updateNetwork({ tokens: tokens, balance: network.balance, name: network.name, nativeCurrency: network.nativeCurrency, chainId: network.chainId }));
        setTokenList([...tokens]);
        openSnackbar("Token added successfully");
    }

    const handleRemoveToken = (token: TokenInfo) => {
        const index = tokens.indexOf(token);

        if (index === -1) return;

        tokens.splice(index, 1);
        dispatch(removeCustomToken(token));
        dispatch(updateNetwork({ tokens: tokens, balance: network.balance, name: network.name, nativeCurrency: network.nativeCurrency, chainId: network.chainId }));
        setTokenList([...tokens]);
        openSnackbar("Token removed successfully");
    }

    const changeNetwork = async () => {
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found");

            if (network.chainId === 1) {
                await changeToMainNet();
                openSnackbar("Network changed successfully");
                return;
            }

            const n = networks.find(net => net.chainId === network.chainId);

            if (!network) {
                console.log("Network doesn't exist")
            }

            const net: ChainNetwork = {
                chainId: web3.utils.toHex(n.chainId),
                chainName: n.name,
                nativeCurrency: n.nativeCurrency,
                rpcUrls: n.rpc,
                blockExplorerUrls: n.explorers ? [...n.explorers].map(ex => ex.url) : []
            }

            await addNetworkToWallet(net);
            openSnackbar("Network changed successfully");
        } catch (err) {
            console.log(err)
            /* setError(err.message); */
        }
    };

    return (
        <>
            <TokenModal show={modalShow} closeEvent={handleModalClose} onTokenAdded={handleTokenAdded} />
            <div className='absolute z-30 app-bg p-3 -mt-7 md:-mt-8 ml-12 flex space-x-4'>
                <h2 className="text-lg md:text-3xl font-bold">{network?.name}</h2>
                { 
                    network.chainId !== Number(window.ethereum.networkVersion) ?
                        <button className="app-btn rounded-lg py-1 px-4 border-transparent font-semibold mt-1" onClick={changeNetwork}>Change</button>
                    : null
                }
            </div>
            <div className='absolute z-30 app-bg p-3 -mt-7 md:-mt-8 right-10'>
                <h2 onClick={handleRemove} className="text-xl md:text-3xl font-bold cursor-pointer hover:text-teal-600">X</h2>
            </div>
            <div className="relative z-10 flex flex-wrap gap-8 p-8 md:p-12 mb-8 border-teal-500 border-solid border-2 rounded-3xl">
                {
                    tokenList && !loading ?
                        <Swiper
                            className="w-full"
                            spaceBetween={30}
                            slidesPerView={width > 640 ? 4.5 : 1.5}
                        >
                            {
                                tokenList.map((token, index) => (
                                    <SwiperSlide key={`token-slide-${index}`}>
                                        <div className="rounded-3xl card p-4 md:p-6 shadow-lg max-w-sm h-auto flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-md md:text-2xl font-black text-start">Total Balance:</h3>
                                                <Image onClick={() => {handleRemoveToken(token)}} src="/assets/icons/delete.svg" className="h-4 md:h-5 w-auto cursor-pointer" alt="" />
                                            </div>
                                            <p className="text-lg md:text-3xl text-end font-bold">{Number(token?.balance).toFixed(6)} {token?.symbol}</p>
                                        </div>
                                    </SwiperSlide>
                                    )
                                )
                            }
                            <SwiperSlide>
                                <div className="rounded-3xl p-4 md:p-6 max-w-xs h-auto">
                                    <p onClick={addToken} className={"text-5xl md:text-7xl font-bold mt-2 md:mt-0 ml-0 md:ml-10 " + ( network.chainId === Number(window.ethereum.networkVersion) ? 'cursor-pointer text-white hover:text-gray-200' : 'text-gray-300') }>+</p>
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