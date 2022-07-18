import { MetamaskNetwork } from "../../interfaces/networks/network.interface";
import { TokenInfo } from "../../interfaces/token/token.interface";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeNetwork } from "../../store/reducers/networks.reducer";
import 'swiper/css';
import { Spinner } from "../Spinner";
import { TokenModal } from "../modals/TokenModal";

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
            tokens.splice(0, 0, network?.nativeCurrency).join();
        }

        setTokenList(tokens);
    }, [tokenList])

    const addToken = (event) => {
        tokens.push(tokens[0]);
        setTokenList([...tokens]);
        setModalShow(true);
    }

    const handleRemove = (event) => {
        dispatch(removeNetwork(network));
    }

    const handleModalClose = () => {
        setModalShow(false);
    }

    return (
        <>
            <TokenModal show={modalShow} closeEvent={handleModalClose} />
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
                                            <h3 className="text-2xl font-black mb-4 text-start">Total Balance:</h3>
                                            <p className="text-3xl text-end font-bold">{Number(token?.balance).toFixed(6)} {token?.symbol}</p>
                                        </div>
                                    </SwiperSlide>
                                    )
                                )
                            }
                            <SwiperSlide>
                                <div className="rounded-3xl p-6 max-w-xs h-auto flex">
                                    <p onClick={addToken} className="text-7xl font-bold ml-10 cursor-pointer text-white hover:text-gray-100">+</p>
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