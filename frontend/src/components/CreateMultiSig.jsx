import { useState } from "react"

const CreateMultiSig = ({contract, setAccountCreated}) => {

    const [load, setLoading] = useState(false)

    const createMultiSigWallet = async () => {
        const result = await contract.createMultiSigWallet()
        await result
        console.log(result)
        setLoading(false)
        setAccountCreated(true)
    }

    return(
        <div>
            <input type="submit" name="create" disabled={load} id="" onClick={() => { setLoading(true); createMultiSigWallet()}} className="focus:outline-none rounded bg-red-500 px-1 py-2 w-4/12 text-white text-center text-sm hover:cursor-pointer hover:opacity-75" value="Create Wallet"/>
        </div>
    )
}

export default CreateMultiSig