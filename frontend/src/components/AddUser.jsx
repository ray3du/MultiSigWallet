import _ from "lodash"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import abi from "../contracts/MultiSig.json"
import CONTRACT_ADDR from "../constants/index.json"

const AddUser = () => {

    const [value, setValue] = useState(1)
    const [field, setField] = useState(1)
    const [wallectConnected, setWalletConnected] = useState(false)
    const [address, setAddress] = useState("")

    const CONTRACT_ADDRESS = CONTRACT_ADDR.CONTRACT_ADDR
    const ABI = abi.abi

    const connectWallet = async () => {
        try {
          if (window.ethereum) {
            const accounts = await window.ethereum.request({
              method:'eth_requestAccounts'
            })
    
            const account = accounts[0] 
            setAddress(account)
            setWalletConnected(true)
          }else{
            setWalletConnected(false)
            setError("Please install Metamask extension")
          }
        } catch (error) {
          console.error(error)
        }
    }

    const provider = () => {
        return new ethers.providers.Web3Provider(window.ethereum)
    }
    
    const signer = () => { 
          return provider().getSigner()
    }
    
    const CONTRACT = () => {
       return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer())  
    }

    const addOwner = async () => {
        const data = Object.values(field)
        console.log(data)
        if (data.length > 0) {
            const result = await CONTRACT().addOwner(data)
            console.log(result)
        }
    }

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    const handleInputChange = (e) => {
        setField(field => ({...field, 
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        connectWallet()
    }, [wallectConnected])

    return (
        <div className="bg-gray-200 h-screen flex flex-row justify-content items-center">
            <div className="bg-white text-gray-700 shadow rounded w-11/12 md:w-7/12 m-auto p-4">
                <p className="text-center font-bold">ADD ADDRESSES</p>
                <div className="flex flex-row my-2 py-2 items-center">
                    <p className="mr-2">Set number of Addresses: </p>
                    <input type="number" name="number" className="border border-gray-400 px-2 py-1 w-[20%] rounded outline-none" placeholder="0" onChange={handleChange} value={value}/>
                </div>
                {
                    value > 0 || value !== undefined ? 
                    _.times(value, i => (
                        <input type="text" value={field.i} onChange={handleInputChange} name={i} key={i} id="" placeholder="0x000000000000" className="outline-none border border-gray-400 rounded py-1 px-2 my-2" />                       
                    )) : null
                }
                <br/>
                <div className="mb-4"></div>
                <div className="flex flex-row">
                    <input type="submit" value="ADD" onClick={() => addOwner()} className="bg-sky-600 text-white py-2 px-4 rounded mt-4 mr-2 hover:opacity-75 hover:cursor-pointer"/>
                    <Link to="/" className="bg-gray-600 text-white py-2 px-4 rounded mt-4 hover:opacity-75">Account</Link>
                </div>
            </div>
        </div>
    )
}

export default AddUser