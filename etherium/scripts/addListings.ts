import {emoji_address_ropsten} from '../address/emoji'

import { ethers } from "hardhat";

async function main () {
    const trader = await ethers.getContractAt("EmojiTrader", emoji_address_ropsten.trader);
    await trader.addListing(1000, emoji_address_ropsten.packs, 0); // silver
    await trader.addListing(10000, emoji_address_ropsten.packs, 1); // gold
    await trader.addListing(100000, emoji_address_ropsten.packs, 2); // platinum

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });