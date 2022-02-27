import { ethers } from "ethers"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import abi from "../contracts/MultiSig.json"
import CONTRACT_ADDR from "../constants/index.json"

const Users = () => {
    const CONTRACT_ADDRESS = CONTRACT_ADDR.CONTRACT_ADDR
    const ABI = abi.abi

    const [users, setUsers] = useState([])


    const provider = () => {
        return new ethers.providers.Web3Provider(window.ethereum)
    }

    const signer = () => {
        return provider().getSigner()
    }

    const CONTRACT = () => {
        return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer())  
    }

    const getOwners = async () => {
        const txn = await CONTRACT().getOwners()
        setUsers(txn)
        console.log(txn)
    }

    useEffect(() => {
        getOwners()
    }, [])


    return (
    <div className="App bg-gray-400 h-screen flex flex-col justify-content items-center">
        <div className='w-11/12 md:w-8/12 m-auto p-4 flex flex-col shadow-md rounded bg-white'>
            <p className='text-xl text-center text-gray-700 font-bold'>Added Users(Wallet)</p>
            {
                users.length > 0 ? 
                users.map(user => (
                    <div className="flex flex-row mr-2 bg-gray-100 rounded py-1 px-2 my-1">
                        <p>1. </p>
                        <p className="text-slate-500 ml-1 truncate" key={user}>{user}</p>
                        <input type="submit" value="X" className="text-white ml-2 text-xs bg-red-500 rounded-full px-2 hover:cursor-pointer hover:opacity-50"/>
                    </div>
                )):
                <div className="flex flex-row mr-2 bg-gray-100 truncate rounded py-1 px-2 my-1">
                    <p>1</p>
                    <p className="ml-1 text-red-400">No added owners</p>
                </div>
            }
            <Link to="/" className="focus:outline-none mt-8 mr-4 rounded bg-sky-600 px-1 py-2 w-3/12 text-white text-center text-sm hover:cursor-pointer hover:opacity-75">Account</Link>
        </div> 
    </div>
    )
}

export default Users