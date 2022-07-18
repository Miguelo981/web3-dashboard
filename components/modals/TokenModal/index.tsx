import Modal from 'react-modal';
import { TokenInfo } from '../../../interfaces/token/token.interface';
import { TokenInfokSearch } from '../../TokenInfoSearch';

export type ModalProps = {
    show: boolean;
    closeEvent: () => void;
}

export const TokenModal = ({ show, closeEvent }: ModalProps) => {
    const addToken = async (token: TokenInfo) => {
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found");

            //await addTokenToWallet(token);
        } catch (err) {
            console.log(err)
            /* setError(err.message); */
        }
    };

    return (
        <>
        {
            show ?
                <Modal isOpen={show} onRequestClose={closeEvent} style={{
                    overlay: {
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      'z-index': 31
                    }}}>
                    <div className='card p-6 '>
                        <div className="flex flex-col w-full relative">
                            <TokenInfokSearch className='relative z-30' onItemSearch={addToken} />
                        </div>
                    </div>
                </Modal>
            :
            null
        }
        </>
    )
}