// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ReputationNFT.sol";
import "./ProjectFactory.sol";

/**
 * @title GigFlowCore - Main platform contract leveraging Avalanche's high throughput
 * @dev Handles profiles, subscriptions, and integrates with other contracts
 */
contract GigFlowCore is Ownable, ReentrancyGuard {
    
    // Subscription tiers for different user types
    enum SubscriptionTier { FREE, PRO, ENTERPRISE }
    
    struct Profile {
        string name;
        string bio;
        string[] skills;
        string[] portfolioHashes; // IPFS/AvaCloud hashes
        SubscriptionTier tier;
        uint256 subscriptionExpiry;
        uint256 reputationScore;
        bool isFreelancer;
        bool isClient;
    }
    
    struct GigListing {
        uint256 id;
        address client;
        string title;
        string dataHash; // AvaCloud hash for detailed data
        uint256 budget;
        address token; // ERC20 token address or address(0) for AVAX
        bool isConfidential; // For future eERC integration
        uint256 createdAt;
        bool isActive;
        address assignedTo;
        address escrowContract;
    }
    
    // State variables
    mapping(address => Profile) public profiles;
    mapping(uint256 => GigListing) public gigs;
    mapping(address => uint256[]) public userGigs; // Client's posted gigs
    mapping(address => uint256[]) public freelancerGigs; // Freelancer's assigned gigs
    
    uint256 public nextGigId = 1;
    uint256 public subscriptionPrice = 0.1 ether; // AVAX
    
    // External contract references
    ReputationNFT public reputationNFT;
    ProjectFactory public projectFactory;
    
    // Events for indexing and notifications
    event ProfileUpdated(address indexed user, string name, SubscriptionTier tier);
    event GigPosted(uint256 indexed gigId, address indexed client, string title);
    event GigAssigned(uint256 indexed gigId, address indexed freelancer);
    event SubscriptionPurchased(address indexed user, SubscriptionTier tier, uint256 expiry);
    
    constructor(address _reputationNFT, address _projectFactory) Ownable(msg.sender) {
        reputationNFT = ReputationNFT(_reputationNFT);
        projectFactory = ProjectFactory(_projectFactory);
    }
    
    /**
     * @dev Update user profile with enhanced features
     */
    function updateProfile(
        string calldata _name,
        string calldata _bio,
        string[] calldata _skills,
        string[] calldata _portfolioHashes,
        bool _isFreelancer,
        bool _isClient
    ) external {
        Profile storage profile = profiles[msg.sender];
        profile.name = _name;
        profile.bio = _bio;
        profile.skills = _skills;
        profile.portfolioHashes = _portfolioHashes;
        profile.isFreelancer = _isFreelancer;
        profile.isClient = _isClient;
        
        emit ProfileUpdated(msg.sender, _name, profile.tier);
    }
    
    /**
     * @dev Purchase subscription using AVAX
     */
    function purchaseSubscription(SubscriptionTier _tier) external payable nonReentrant {
        require(_tier != SubscriptionTier.FREE, "Cannot purchase free tier");
        
        uint256 price = _tier == SubscriptionTier.PRO ? subscriptionPrice : subscriptionPrice * 3;
        require(msg.value >= price, "Insufficient payment");
        
        Profile storage profile = profiles[msg.sender];
        profile.tier = _tier;
        profile.subscriptionExpiry = block.timestamp + 30 days; // 30-day subscription
        
        emit SubscriptionPurchased(msg.sender, _tier, profile.subscriptionExpiry);
        
        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }
    
    /**
     * @dev Post a new gig (leveraging Avalanche's low fees for frequent posting)
     */
    function postGig(
        string calldata _title,
        string calldata _dataHash,
        uint256 _budget,
        address _token,
        bool _isConfidential,
        uint256[] calldata _milestones
    ) external returns (uint256) {
        Profile storage profile = profiles[msg.sender];
        require(profile.isClient, "Must be registered as client");
        
        // Check subscription limits
        if (profile.tier == SubscriptionTier.FREE) {
            require(userGigs[msg.sender].length < 2, "Free tier limited to 2 active gigs");
        }
        
        uint256 gigId = nextGigId++;
        
        // Create escrow contract through factory
        address escrowAddress = projectFactory.createProject{value: _token == address(0) ? _budget : 0}(
            address(0), // Will be set when gig is assigned
            _token,
            _milestones
        );
        
        GigListing storage gig = gigs[gigId];
        gig.id = gigId;
        gig.client = msg.sender;
        gig.title = _title;
        gig.dataHash = _dataHash;
        gig.budget = _budget;
        gig.token = _token;
        gig.isConfidential = _isConfidential;
        gig.createdAt = block.timestamp;
        gig.isActive = true;
        gig.escrowContract = escrowAddress;
        
        userGigs[msg.sender].push(gigId);
        
        emit GigPosted(gigId, msg.sender, _title);
        
        return gigId;
    }
    
    /**
     * @dev Assign gig to freelancer
     */
    function assignGig(uint256 _gigId, address _freelancer) external {
        GigListing storage gig = gigs[_gigId];
        require(gig.client == msg.sender, "Only client can assign");
        require(gig.isActive, "Gig not active");
        require(profiles[_freelancer].isFreelancer, "Assignee must be freelancer");
        
        gig.assignedTo = _freelancer;
        freelancerGigs[_freelancer].push(_gigId);
        
        emit GigAssigned(_gigId, _freelancer);
    }
    
    /**
     * @dev Complete gig and mint reputation NFT
     */
    function completeGig(uint256 _gigId) external {
        GigListing storage gig = gigs[_gigId];
        require(gig.client == msg.sender, "Only client can complete");
        require(gig.assignedTo != address(0), "Gig not assigned");
        
        gig.isActive = false;
        
        // Update reputation scores
        profiles[gig.assignedTo].reputationScore += 1;
        profiles[msg.sender].reputationScore += 1;
        
        // Mint reputation NFT to freelancer
        reputationNFT.mintReputation(gig.assignedTo);
    }
    
    // View functions for frontend
    function getProfile(address _user) external view returns (Profile memory) {
        return profiles[_user];
    }
    
    function getUserGigs(address _user) external view returns (uint256[] memory) {
        return userGigs[_user];
    }
    
    function getFreelancerGigs(address _freelancer) external view returns (uint256[] memory) {
        return freelancerGigs[_freelancer];
    }
    
    function getGig(uint256 _gigId) external view returns (GigListing memory) {
        return gigs[_gigId];
    }
    
    // Admin functions
    function setSubscriptionPrice(uint256 _price) external onlyOwner {
        subscriptionPrice = _price;
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
