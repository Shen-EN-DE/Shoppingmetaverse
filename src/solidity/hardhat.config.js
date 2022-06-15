require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    // rinkeby: {
    //   url: "https://rinkeby.infura.io/v3/61215055bc184343a0c558fde59fa107",
    //   accounts: ["8f9449dd486083bfbd8bf0fc44891d02e22f1f6bb0a863184c764962a1ff7795"]
    // },
    hardhat: {
      chainId: 1337
    },
  },
};
