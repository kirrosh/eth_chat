// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract EmojiTrader  {

    mapping(address => mapping(uint256 => listing)) public listings;
    mapping(address => uint256) public balances;

    struct listing {
        uint256 price;
        address seller;
    }

    function addListing(uint256 price, address contractAddress, uint256 tokenId) public {
        IERC1155 tokenContract = IERC1155(contractAddress);
        require(tokenContract.balanceOf(msg.sender, tokenId) > 0, "Caller must own token");
        require(tokenContract.isApprovedForAll(msg.sender, address(this)), "Contract must be approwed");

        listings[contractAddress][tokenId] = listing(price, msg.sender);
    }

    function purchase(address contractAddress, uint256 tokenId, uint256 amount) public payable {
        listing memory item = listings[contractAddress][tokenId];
        require(msg.value >= item.price * amount, "Not enough money");
        balances[item.seller] += msg.value;

        IERC1155 tokenContract = IERC1155(contractAddress);
        tokenContract.safeTransferFrom(item.seller, msg.sender, tokenId, amount, "");
    }

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        payable(msg.sender).transfer(amount);
    }
}