const { ethers } = require("hardhat")

const main = async () => {
    const MultiSigContract = await ethers.getContractFactory('MultiSig')
    const MultiSigContractDeploy = await MultiSigContract.deploy()

    await MultiSigContractDeploy.deployed()

    console.log(`Contract Address: ${MultiSigContractDeploy.address}`)
}

main()
.then(() => process.exit(0))
.catch(err => {
    console.error(err)
    process.exit(1)
})