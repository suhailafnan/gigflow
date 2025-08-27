// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IERC20.sol";

contract MilestoneEscrow {
    address public immutable client;
    address public immutable freelancer;
    address public immutable token; // Address of the ERC20 token (e.g., USDC), or address(0) for AVAX
    uint256[] public milestones;

    uint256 public currentMilestoneIndex;
    enum ProjectStatus { InProgress, Completed, Refunded }
    ProjectStatus public status;

    event MilestonePaid(uint256 indexed milestoneIndex, uint256 amount);
    event ProjectCompleted();
    event ProjectRefunded(uint256 amount);

    modifier onlyClient() {
        require(msg.sender == client, "Only client");
        _;
    }

    modifier inProgress() {
        require(status == ProjectStatus.InProgress, "Project not in progress");
        _;
    }

    constructor(
        address _client,
        address _freelancer,
        address _token,
        uint256[] memory _milestones
    ) {
        require(_milestones.length > 0, "No milestones provided");
        client = _client;
        freelancer = _freelancer;
        token = _token;
        milestones = _milestones;
        status = ProjectStatus.InProgress;
    }

    function approveMilestone() external onlyClient inProgress {
        uint256 amountToPay = milestones[currentMilestoneIndex];
        require(amountToPay > 0, "Milestone amount is zero");

        _transferFunds(freelancer, amountToPay);

        emit MilestonePaid(currentMilestoneIndex, amountToPay);

        currentMilestoneIndex++;

        if (currentMilestoneIndex == milestones.length) {
            status = ProjectStatus.Completed;
            emit ProjectCompleted();
        }
    }

    function requestRefund() external onlyClient inProgress {
        uint256 remainingAmount = 0;
        for (uint256 i = currentMilestoneIndex; i < milestones.length; i++) {
            remainingAmount += milestones[i];
        }
        require(remainingAmount > 0, "No funds to refund");

        _transferFunds(client, remainingAmount);
        
        status = ProjectStatus.Refunded;
        emit ProjectRefunded(remainingAmount);
    }

    function _transferFunds(address _to, uint256 _amount) private {
        if (token == address(0)) { // Handle native AVAX
            payable(_to).transfer(_amount);
        } else { // Handle ERC20 tokens
            bool success = IERC20(token).transfer(_to, _amount);
            require(success, "ERC20 transfer failed");
        }
    }

    // Allow the contract to receive AVAX
    receive() external payable {}
}
