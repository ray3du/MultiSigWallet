 //SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract MultiSig{
    address private owner;
    mapping (address => uint8) private owners;
    address[] private ownerArray;
    mapping (address => RequestWithdraw) private _withdraw;

    uint8 public maxNumberOfWithdrawConfirmations;

    struct RequestWithdraw{
        uint8 numberOfConfirmations;
        uint amount; 
    }

    modifier isOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier isValidUser(){
        require(msg.sender == owner || owners[msg.sender] == 1);
        _;
    }

    event Deposit(address, uint);
    event Withdraw(address, uint);
    event AddOwner(uint);

    function getMaxNumberOfWithdrawConfirmations() 
        public 
        view 
        returns(uint8)
    {
        return maxNumberOfWithdrawConfirmations;
    }

    function setMaxNumberOfWithdrawConfirmations(uint8 _num) public isOwner {
        maxNumberOfWithdrawConfirmations = _num;
    }

    function checkMultiSigWallet() public view returns(address){
        return owner;
    }
    
    function createMultiSigWallet() public {
        owner = msg.sender;
    }

    function getBalance () public view returns(uint){
        return address(this).balance;
    }

    function addOwner(address[] memory _owners) 
        public
        isOwner
    {
        require(_owners.length > 0);
        for (uint8 index = 0; index < _owners.length; index++) {
            owners[_owners[index]] = 1;
            ownerArray.push(_owners[index]);
        }
        emit AddOwner(_owners.length);
    }

    function getOwners() public view returns(address[] memory){
        return ownerArray;
    }

    function deposit() public payable isValidUser{
        require(msg.value != 0);
        emit Deposit(msg.sender, getBalance());
    }

    function withdraw(uint amount) public payable isValidUser{
        require(address(this).balance > amount);
        if(msg.sender != owner){
            require(checkRequestConfirm() >= maxNumberOfWithdrawConfirmations);
        }
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, getBalance());
    }

    function checkRequestConfirm() public view returns(uint8){
        return _withdraw[msg.sender].numberOfConfirmations;
    }

    function setRequestWithdrawConfirm() public {
        _withdraw[msg.sender].numberOfConfirmations += 1;
    }
}