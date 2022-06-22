// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const SERVICE = await hre.ethers.getContractFactory("SssssmokinFinance");

  const service = await SERVICE.deploy('0x6E09231eD9f490E44EB7d9BBE117b2aE57b6273A', '0x4B1Da04F722a53DC559C62B05f79ce009b5F7b7d')

  await service.deployed();

  console.log("SERVICE deployed to:", service.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// module.exports = {
//   serviceAddr: addr
// }