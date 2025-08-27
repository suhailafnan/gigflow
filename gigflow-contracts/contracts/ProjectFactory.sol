// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MilestoneEscrow.sol";
import "./interfaces/IERC20.sol";

contract ProjectFactory {
    address[] public deployedProjects;

    event ProjectCreated(
        address indexed projectAddress,
        address indexed client,
        address indexed freelancer,
        uint256 totalValue,
        address token
    );

    function createProject(
        address _freelancer,
        address _token, // address(0) for AVAX, token address for ERC20
        uint256[] memory _milestones
    ) external payable returns (address) {
        uint256 totalValue = 0;
        for (uint256 i = 0; i < _milestones.length; i++) {
            totalValue += _milestones[i];
        }
        require(totalValue > 0, "Total value must be > 0");

        if (_token == address(0)) { // Handling AVAX payment
            require(msg.value == totalValue, "Incorrect AVAX sent");
        } else { // Handling ERC20 payment
            require(msg.value == 0, "Do not send AVAX for token projects");
            IERC20(_token).transferFrom(msg.sender, address(this), totalValue);
        }

        MilestoneEscrow newProject = new MilestoneEscrow(
            msg.sender,
            _freelancer,
            _token,
            _milestones
        );

        if (_token == address(0)) {
            payable(address(newProject)).transfer(totalValue);
        } else {
            IERC20(_token).transfer(address(newProject), totalValue);
        }

        deployedProjects.push(address(newProject));
        emit ProjectCreated(address(newProject), msg.sender, _freelancer, totalValue, _token);

        return address(newProject);
    }
}
