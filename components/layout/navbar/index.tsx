import { useSelector } from "react-redux";
import { connectToMetamask } from "../../../services/metamask.service";
import { getSimplifiedAddress } from "../../../utils/text";
import { NetworkSearch } from "../../NetworkSearch";
import { TokenInfokSearch } from "../../TokenInfoSearch";

export const Navbar = ({ title }: any) => {
    const address: string = useSelector((state: any) => state.address);

    const connect = async () => {
        await connectToMetamask();
    }

    return (
        <div className="p-4 flex justify-between items-center">
            <h2 className="text-5xl font-black">{title}</h2>
            <div className="flex space-x-6 items-center">
                <h3 className="text-xl font-bold">Add Network: </h3>
                <div className="flex flex-col">
                    <NetworkSearch />
                </div>
                <h3 className="text-xl font-bold">Add Token: </h3>
                <div className="flex flex-col">
                    <TokenInfokSearch />
                </div>
                {/* <button onClick={handleNetworkAdd} className="app-btn rounded-lg py-1 px-8 border-transparent shadow-lg">
                    <strong className="text-2xl">Add</strong>
                </button> */}
                <button onClick={connect} className="app-btn rounded-lg py-1 px-8 border-transparent shadow-lg max-w-xs">
                    {
                        address ?
                            <strong className="text-md">{ getSimplifiedAddress(address) }</strong>
                        :
                            <strong className="text-2xl">Connect</strong>
                    }
                </button>
            </div>
        </div>
    )
}