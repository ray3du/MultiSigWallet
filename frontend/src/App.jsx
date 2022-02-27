import { ethers, utils } from 'ethers'
import { useEffect, useState } from 'react'
import './App.css'
import CreateMultiSig from './components/CreateMultiSig'
import Transaction from './components/Transactions'
import abi from "./contracts/MultiSig.json"
import CONTRACT_ADDR from "./constants/index.json"

function App() {

  const [wallectConnected, setWalletConnected] = useState(false)
  const [error, setError] = useState("")
  const [events, setEvents] = useState("")
  const [address, setAddress] = useState("")
  const [truncate, setTruncate] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingWithdraw, setLoadingWithdraw] = useState(false)

  const [balance, setBalance] = useState(0)
  const [accountCreated, setAccountCreated] = useState(false)

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
        checkMultiSigWallet()
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

  const checkEventWithdraw = () => {
    let Events = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider())
    Events.on("Withdraw", (from, amount) => {
      setBalance(utils.formatEther(amount))
      console.log(JSON.stringify( amount))
      setEvents(`Withdraw from: ${JSON.stringify(from)}`)
      setLoadingWithdraw(false)
      setTruncate("")
    })
  }

  const checkEventDeposit = () => {
    let Events = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider())

    Events.on("Deposit", (from, amount) => {
      setBalance(utils.formatEther(amount))
      console.log(JSON.stringify( amount))
      setEvents(`Deposit by ${JSON.stringify(from)}`)
      setLoading(false)
      setTruncate("")
    })
  }

  const checkMultiSigWallet = async () => {
    let result = await CONTRACT().checkMultiSigWallet()
    if (result.toLowerCase() == address.toLowerCase()){
      setAccountCreated(true)
    }
    console.log(accountCreated)   
  }

  const getBalance = async () => {
    const result = await CONTRACT().getBalance()
    setBalance(utils.formatEther(result))
  }

  useEffect(() => {
    checkMultiSigWallet()
    connectWallet()
    getBalance()
  }, [wallectConnected, accountCreated])

  return (
    <div className="App bg-gray-400 h-screen flex flex-col justify-content items-center">
      { events != "" ?
       <div className={'w-11/12 md:w-8/12 m-auto flex flex-col items-center text-center relative -mb-12 bg-sky-400 h-12 rounded text-white ' + truncate}>
        <p className='pt-3 truncate w-10/12 text-sm'>{events}</p>
        <input type="submit" onClick={() => setTruncate("hidden")} value="X" className='bg-sky-400 text-gray-600 absolute right-2 bottom-3 hover:cursor-pointer'/>
      </div> : null}
      <div className='w-11/12 md:w-8/12 m-auto p-4 flex flex-col shadow-md rounded bg-white'>
        <p className='text-xl text-center text-gray-700 font-bold'>MultiSig Wallet</p>
        <div className='bg-gray-700 rounded my-4 flex flex-col py-2'>
          <p className='text-lg text-white px-4 pt-2'>Your Address:</p>
          <p className='text-sm text-gray-200 px-4 truncate'>{address}</p>
          <p className='text-lg text-white px-4 pt-2 pb-[1px]'>Amount</p>
          <div className='mx-4 flex flex-row'>
            <p className='text-white mr-2'>ETH: </p>
            <p className='text-sm bg-gray-100 px-4 py-[1px] w-[25%] md:w-[15%] rounded'>{balance}</p>
          </div>
        </div>
        { accountCreated ? <Transaction 
          contract={CONTRACT()}
          checkEventWithdraw={checkEventWithdraw} 
          checkEventDeposit={checkEventDeposit} 
          setLoading={setLoading}
          loading={loading}
          setLoadingWithdraw={setLoadingWithdraw}
          loadingWithdraw={loadingWithdraw}
          />: < CreateMultiSig contract={CONTRACT()} setAccountCreated={setAccountCreated}/> }
      </div>
    </div>
  )
}

export default App
