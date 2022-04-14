// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

// Trader address 0xe3374313a836d96752bC78618aC027Affccf9e2f
// Packs address 0xa0C46BE6a150E627FeB9b417D71eA54feFC572e8


import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const EmojiPacks = await ethers.getContractFactory("EmojiPacks");
  const EmojiTrader = await ethers.getContractFactory("EmojiTrader");
  const packs = await EmojiPacks.deploy();
  const trader = await EmojiTrader.deploy();

  await packs.deployed();
  await trader.deployed();
  await packs.setApprovalForAll(trader.address, true);
  await trader.addListing(1000, packs.address, 0); // silver
  await trader.addListing(10000, packs.address, 1); // gold
  await trader.addListing(100000, packs.address, 2); // platinum

  console.log("Trader address", trader.address);
  console.log("Packs address", packs.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
