// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary/blob/master/contracts/BokkyPooBahsDateTimeLibrary.sol";


import "hardhat/console.sol";


contract ShrimpToken is ERC20{
    
    uint public people = 0;
    mapping(address => mapping(uint256 => Customer)) public customerList;
    address public shrimpOwner;

    enum Level{Novice, Intermediate, Advanced}

    struct Customer{
        Level customerLevel;
        uint256 GiveToken;
        uint256 totalGiveToken;
        uint256 thresholdAmount;
    }
    
    uint256 public thismonth = BokkyPooBahsDateTimeLibrary.getMonth(block.timestamp);
    uint256 private initialGiveToken = 0;
    uint256 private ThresholdAmount = 0;
    uint256 public ShrimpBuyToken =0;
    

    mapping(address => bool) public isOwner; //是否是管理層
    address[] public owners;

    uint public initialSupply = 10**18;


    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    

    constructor(address[] memory _owners) ERC20("Shrimp","SPT"){

        _mint(msg.sender, initialSupply); //初始金額
        shrimpOwner = msg.sender; //shrimpOwner 是蝦幣的使用者
    


        require(_owners.length > 0, "owners required");
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

    }

    function GiveToken(address customerAddr, uint256 amount) public onlyOwner(){
        

        initialGiveToken = initialGiveToken +amount;
        ThresholdAmount = ThresholdAmount + amount; //判斷level的金額扣款
        transfer(customerAddr, amount);


        customerList[customerAddr][thismonth] = Customer({
            GiveToken: amount,
            customerLevel: customerList[customerAddr][thismonth].customerLevel,
            totalGiveToken: initialGiveToken,
            thresholdAmount: ThresholdAmount
        });



    }

    function isLevel(address customerAddr) public{
        require(customerList[customerAddr][thismonth].thresholdAmount >=10000, "not enough token");
        if(20000 > customerList[customerAddr][thismonth].thresholdAmount && customerList[customerAddr][thismonth].thresholdAmount >= 10000){
            require(customerList[customerAddr][thismonth].customerLevel != Level.Intermediate ,"you are already Intermediate");
            customerList[customerAddr][thismonth].customerLevel = Level.Intermediate;
            customerList[customerAddr][thismonth].thresholdAmount = ThresholdAmount - 10000;
            ThresholdAmount = ThresholdAmount -10000;
        }else if(customerList[customerAddr][thismonth].thresholdAmount >= 20000){
            require(customerList[customerAddr][thismonth].customerLevel != Level.Advanced ,"you are already Advanced");

            customerList[customerAddr][thismonth].customerLevel = Level.Advanced;
            customerList[customerAddr][thismonth].thresholdAmount = ThresholdAmount - 20000;
            ThresholdAmount = ThresholdAmount -20000;
        }
        

        

    }

    function BuyToken(address customerAddr, uint256 amount) public payable{

        require(msg.value > 0, "send ETH to buy some tokens");

        _transfer(shrimpOwner,customerAddr, amount);
        ShrimpBuyToken = ShrimpBuyToken + amount;

    }



}
