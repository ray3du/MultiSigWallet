require("@nomiclabs/hardhat-waffle");
require("dotenv").config()

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_API_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
