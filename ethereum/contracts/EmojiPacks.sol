// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract EmojiPacks is ERC1155 {
    uint256 public constant SILVER = 0;
    uint256 public constant GOLD = 1;
    uint256 public constant PLATINUM = 2;

    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        _mint(msg.sender, SILVER, 1000, "");
        _mint(msg.sender, GOLD, 1000, "");
        _mint(msg.sender, PLATINUM, 1000, "");
    }
}