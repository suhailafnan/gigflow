// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ICMBridge - Inter-Chain Messaging for cross-subnet gigs
 * @dev Allows gigs to be posted on C-Chain but managed on GigFlow subnet
 */
contract ICMBridge is Ownable {
    
    struct CrossChainGig {
        uint256 originChainId;
        uint256 gigId;
        address client;
        uint256 budget;
        address token;
        bytes32 messageHash;
        bool isProcessed;
    }
    
    mapping(bytes32 => CrossChainGig) public crossChainGigs;
    mapping(address => bool) public authorizedRelayers;
    
    event CrossChainGigCreated(bytes32 indexed messageHash, uint256 gigId, address client);
    event CrossChainGigProcessed(bytes32 indexed messageHash, address freelancer);
    
    constructor() Ownable(msg.sender) {}
    
    modifier onlyRelayer() {
        require(authorizedRelayers[msg.sender], "Not authorized relayer");
        _;
    }
    
    /**
     * @dev Receive cross-chain gig creation message
     */
    function receiveGigMessage(
        uint256 _originChainId,
        uint256 _gigId,
        address _client,
        uint256 _budget,
        address _token,
        bytes32 _messageHash
    ) external onlyRelayer {
        require(!crossChainGigs[_messageHash].isProcessed, "Already processed");
        
        CrossChainGig storage crossGig = crossChainGigs[_messageHash];
        crossGig.originChainId = _originChainId;
        crossGig.gigId = _gigId;
        crossGig.client = _client;
        crossGig.budget = _budget;
        crossGig.token = _token;
        crossGig.messageHash = _messageHash;
        crossGig.isProcessed = false;
        
        emit CrossChainGigCreated(_messageHash, _gigId, _client);
    }
    
    /**
     * @dev Process gig assignment and send back to origin chain
     */
    function processGigAssignment(
        bytes32 _messageHash,
        address _freelancer
    ) external onlyRelayer {
        CrossChainGig storage crossGig = crossChainGigs[_messageHash];
        require(!crossGig.isProcessed, "Already processed");
        
        crossGig.isProcessed = true;
        
        // Here you would send ICM message back to origin chain
        // Implementation depends on Avalanche's Teleporter protocol
        
        emit CrossChainGigProcessed(_messageHash, _freelancer);
    }
    
    function addRelayer(address _relayer) external onlyOwner {
        authorizedRelayers[_relayer] = true;
    }
    
    function removeRelayer(address _relayer) external onlyOwner {
        authorizedRelayers[_relayer] = false;
    }
}
