// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    address public awmRelayer;

    constructor(address initialOwner) ERC721("GigFlow Reputation", "GFR") Ownable(initialOwner) {}

    modifier onlyRelayerOrOwner() {
        require(msg.sender == owner() || msg.sender == awmRelayer, "Not authorized");
        _;
    }

    function setAwmRelayer(address _relayer) external onlyOwner {
        awmRelayer = _relayer;
    }

    function mintReputation(address to) external onlyRelayerOrOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    // OpenZeppelin v5: override _update, not _beforeTokenTransfer
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        // Allow mint (from == address(0)), block any later transfers
        if (from != address(0)) {
            revert("Soul-bound: cannot transfer");
        }
        return super._update(to, tokenId, auth);
    }
}
