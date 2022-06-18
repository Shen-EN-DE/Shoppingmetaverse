// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


import "hardhat/console.sol";


contract ShrimpToken is ERC20{
    
    uint constant SECONDS_PER_DAY = 24 * 60 * 60;
    int constant OFFSET19700101 = 2440588;

    uint public people = 0;
    mapping(address => mapping(uint256 => Customer)) public customerList;
    address public shrimpOwner;

    enum Level{Novice, copper, silver, gold}

    struct Customer{
        Level customerLevel;
        uint256 GiveToken;
        uint256 totalGiveToken;
        uint256 thresholdAmount;
    }
    
    uint256 public thismonth;
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
    

        thismonth = _daysToDate(block.timestamp / SECONDS_PER_DAY);


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

    function isLevel(address customerAddr) public returns(uint LevelCount){
        require(customerList[customerAddr][thismonth].thresholdAmount >= 100, "not enough token");

        if(350 > customerList[customerAddr][thismonth].thresholdAmount && customerList[customerAddr][thismonth].thresholdAmount >= 100){
            customerList[customerAddr][thismonth].customerLevel = Level.copper;
            customerList[customerAddr][thismonth].thresholdAmount = ThresholdAmount - 100;
            ThresholdAmount = ThresholdAmount -100;
            return 1;
        }else if(1000 > customerList[customerAddr][thismonth].thresholdAmount && customerList[customerAddr][thismonth].thresholdAmount >= 350){

            customerList[customerAddr][thismonth].customerLevel = Level.silver;
            customerList[customerAddr][thismonth].thresholdAmount = ThresholdAmount - 350;
            ThresholdAmount = ThresholdAmount - 350;
            return 2;
        }else if(customerList[customerAddr][thismonth].thresholdAmount >= 1000){

            customerList[customerAddr][thismonth].customerLevel = Level.gold;
            customerList[customerAddr][thismonth].thresholdAmount = ThresholdAmount - 1000;
            ThresholdAmount = ThresholdAmount - 1000;
            return 3;
        }
        

        

    }

    function BuyToken(address customerAddr, uint256 amount) public payable{

        require(msg.value > 0, "send ETH to buy some tokens");

        _transfer(shrimpOwner,customerAddr, amount);
        ShrimpBuyToken = ShrimpBuyToken + amount;

    }

    function _daysToDate(uint _days) internal pure returns (uint month) {
        int __days = int(_days);

        int L = __days + 68569 + OFFSET19700101;
        int N = 4 * L / 146097;
        L = L - (146097 * N + 3) / 4;
        int _year = 4000 * (L + 1) / 1461001;
        L = L - 1461 * _year / 4 + 31;
        int _month = 80 * L / 2447;
        L = _month / 11;
        _month = _month + 2 - 12 * L;

        month = uint(_month);
    }

}
