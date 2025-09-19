// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract PointsToRewards {
    struct Member {
        string name; 
        uint points; 
        bool isRegistered; 
    }

    mapping(address => Member) public members;

    address public admin;

    enum RewardType { TShirt, VIPStatus }

    event PointsAwarded(address indexed member, uint points);
    event RewardRedeemed(address indexed member, RewardType reward);

    constructor() {
        admin = msg.sender; 
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function registerMember(string memory name) public {
        require(!members[msg.sender].isRegistered, "You are already registered");
        members[msg.sender] = Member(name, 0, true);
    }

    function awardPoints(address member, uint points) public onlyAdmin {
        require(members[member].isRegistered, "Member is not registered");
        members[member].points += points;
        emit PointsAwarded(member, points);
    }

    function transferPoints(address to, uint points) public {
        require(members[msg.sender].isRegistered, "You are not registered");
        require(members[to].isRegistered, "Recipient is not registered");
        require(members[msg.sender].points >= points, "Insufficient points");
        members[msg.sender].points -= points;
        members[to].points += points;
    }

    function getPointsBalance() public view returns (uint) {
        require(members[msg.sender].isRegistered, "You are not registered");
        return members[msg.sender].points;
    }

    function redeemReward(RewardType reward) public {
        require(members[msg.sender].isRegistered, "You are not registered");
        uint cost;
        if (reward == RewardType.TShirt) {
            cost = 50;
        } else if (reward == RewardType.VIPStatus) {
            cost = 100;
        }
        require(members[msg.sender].points >= cost, "Insufficient points");
        uint currentBalance = members[msg.sender].points;
        members[msg.sender].points = currentBalance - cost;
        emit RewardRedeemed(msg.sender, reward);
    }
}

