import { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { TokenInfo } from '../../../interfaces/token/token.interface';
import { addTokenToWallet, getTokenInfo, web3 } from '../../../services/metamask.service';
import { addCustomToken } from '../../../store/reducers/custom-tokens.reducer';
import { TokenInfokSearch } from '../../TokenInfoSearch'; 

export type ModalProps = {
    show: boolean;
    closeEvent: () => void;
    onTokenAdded?: (token: TokenInfo, exists?: boolean) => void;
}

const DEFAULT_TOKEN_INFO: TokenInfo = { decimals: 18, symbol: "", address: "", balance: 0 };

export const TokenModal = ({ show, closeEvent, onTokenAdded }: ModalProps) => {
    const [validAddress, setValidAddress] = useState(true);
    const [selectedToken, setSelectedToken] = useState(DEFAULT_TOKEN_INFO);
    const dispatch = useDispatch();
    
    const addToken = async (event) => {
        event.preventDefault();

        try {
            if (!window.ethereum) throw new Error("No crypto wallet found");

            await addTokenToWallet(selectedToken)
                .then(async res => {
                    dispatch(addCustomToken(selectedToken));
                    await getTokenInfo(selectedToken.address).then((res) => {
                        const token = { ...selectedToken }
                        
                        if (res !== undefined) token.balance = res.balance;

                        onTokenAdded(token, res !== undefined);
                        handleClose();
                    })
                    
                })
                .catch(console.log)
        } catch (err) {
            console.log(err)
        }
    };

    const handleTokenSelection = (token: TokenInfo) => {
        token.balance = 0;
        setSelectedToken({...token});
    }

    const handleAddressInput = (event) => {
        const address = event.target.value;

        selectedToken.address = address;
        setSelectedToken({...selectedToken});
        setValidAddress(web3.utils.isAddress(address));
    }

    const handleClose = () => {
        setSelectedToken(DEFAULT_TOKEN_INFO);
        closeEvent();
    }

    return (
        <>
            {
                show ?
                    <Modal isOpen={show} onRequestClose={handleClose} ariaHideApp={false} style={{
                        overlay: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            zIndex: 31
                        }
                    }}>
                        <div className='card p-6 '>
                            <div className="flex flex-col w-full relative">
                                <TokenInfokSearch className='relative z-30' onItemSearch={handleTokenSelection} />
                            </div>
                            <section>
                                <form className='flex flex-col space-y-2 pt-20' >
                                    <label className='text-2xl font-bold' htmlFor='destination-address'>Destination:</label>
                                    <input name='destination-address' type="text" onChange={handleAddressInput} className="p-2 rounded-xl" value={selectedToken.address} required />
                                    {!validAddress ? <small className='text-red-500'>This address is invalid</small> : null}
                                    <label className='text-2xl font-bold' htmlFor='destination-address'>Symbol:</label>
                                    <input name='destination-address' type="text" onChange={(event) => { selectedToken.symbol = event.target.value; setSelectedToken({...selectedToken}); }} className="p-2 rounded-xl" value={selectedToken.symbol} required />
                                    <label className='text-2xl font-bold' htmlFor='destination-address'>Decimals:</label>
                                    <input name='destination-address' type="text" onChange={(event) => { selectedToken.decimals = event.target.value; setSelectedToken({...selectedToken}); }} className="p-2 rounded-xl" value={selectedToken.decimals} required />
                                    <button type="submit" onClick={addToken} disabled={!validAddress || selectedToken.symbol.length < 1 || !selectedToken.decimals} className='app-btn h-11 rounded-xl font-bold'>Add Token</button>
                                </form>
                            </section>
                        </div>
                    </Modal>
                    :
                    null
            }
        </>
    )
}