import { utils } from "ethers"
import { useState } from "react"
import { Link } from "react-router-dom"

const Transaction = ({contract, checkEventDeposit, checkEventWithdraw, loading, setLoading, setLoadingWithdraw, loadingWithdraw}) => {
    const [deposit, setDeposit] = useState("")
    const [maxConfirm, setMaxConfirm] = useState(0)
    const [withdraw, setWithdraw] = useState("")

    const depositFunds = async (amount) => {
        const txn = await contract.deposit({value: utils.parseEther(amount)})
        console.log(txn)
        checkEventDeposit()
    }

    const withdrawFunds = async (amount) => {
        const txn = await contract.withdraw(utils.parseEther(amount))
        console.log(txn)
        checkEventWithdraw()
    }

    const handleChange = (e) => {
        setDeposit(e.target.value)
    }

    const handleChangeWithdraw = (e) => {
        setWithdraw(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        depositFunds(deposit)
        setDeposit("")
    }

    const handleConfirmChange = (e) => {
        setMaxConfirm(e.target.value)
    }

    const handleMaxConfirm = async () => {
        if(maxConfirm !== 0){
            const txn = await contract.setMaxNumberOfWithdrawConfirmations(maxConfirm)
            console.log(txn)
        }
    }

    const handleSubmitWithdraw = (e) => {
        e.preventDefault()
        setLoadingWithdraw(true)
        withdrawFunds(withdraw)
        setWithdraw("")
    }
    
    return(
        <div>
            <form method="post" onSubmit={handleSubmitWithdraw}>
                <div className="flex flex-row">
                    <input type="text" onChange={handleChangeWithdraw} value={withdraw} name="withdraw" id="" placeholder="0.001" className="focus:outline-none rounded border border-gray-200 px-2 py-1 w-9/12" />
                    <input type="submit" name="withdraw" id="" disabled={loadingWithdraw} className={loadingWithdraw ? "focus:outline-none rounded bg-gray-500 px-1 py-1 w-3/12 text-white text-center text-sm" :"focus:outline-none rounded bg-red-500 px-1 py-1 w-3/12 text-white text-center text-sm hover:cursor-pointer hover:opacity-75"} value={loadingWithdraw ? "Loading .." : "Withdraw"}/>
                </div>
            </form>
            <form method="post" onSubmit={handleSubmit}>
                <div className="flex flex-row mt-4">
                    <input type="text"  onChange={handleChange} value={deposit} name="withdraw" id="" placeholder="0.001" className="focus:outline-none rounded border border-gray-200 px-2 py-1 w-9/12" />
                    <input type="submit" name="deposit" id="" disabled={loading} className={loading ? "focus:outline-none rounded bg-gray-500 px-1 py-1 w-3/12 text-white text-center text-sm" :"focus:outline-none rounded bg-sky-600 px-1 py-1 w-3/12 text-white text-center text-sm hover:cursor-pointer hover:opacity-75"} value={loading ? "Loading..": "Deposit"}/>
                </div>
            </form>
            <div className="mt-4 flex flex-row justify-content items-center">
                <p className="mr-2 text-sm">Set number of confirmations: </p>
                <input type="number" name="num" value={maxConfirm} onChange={handleConfirmChange} id="" className="rounded border border-gray-300 outline-none w-[15%] px-1"/>
                <input type="submit" value="SET" onClick={handleMaxConfirm} className="px-2 bg-red-500 text-white ml-2 rounded hover:cursor-pointer hover:opacity-50"/>
            </div>
            <div className="flex flex-row justify-content items-center">
                <Link to="/add" className="focus:outline-none mt-8 mr-4 rounded bg-sky-600 px-1 py-2 w-3/12 text-white text-center text-sm hover:cursor-pointer hover:opacity-75">Add Users</Link>
                <Link to="/users" className="focus:outline-none mt-8 rounded bg-red-600 px-1 py-2 w-3/12 text-white text-center text-sm hover:cursor-pointer hover:opacity-75">Users</Link>
            </div>
        </div>
    )
}

export default Transaction