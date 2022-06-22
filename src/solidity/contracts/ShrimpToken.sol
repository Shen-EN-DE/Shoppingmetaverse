// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./OracleEthUsd.sol";

// Chain link Oracle
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "hardhat/console.sol";

error NotProvideToken();
error InvalidPrice();

contract ShrimpToken is ERC20 {
    uint256 constant SECONDS_PER_DAY = 24 * 60 * 60;
    int256 constant OFFSET19700101 = 2440588;

    uint256 public people = 0;

    //用的的mappinglist
    mapping(address => mapping(uint256 => Customer)) public customerList;
    //是否是owner
    address public shrimpOwner;

    address private ethPricefeed; //eth/usd  address

    // 支持的加密貨幣 // ERC20 Token address => Chainlink Token/USD Feed Data Address
    mapping(address => address) private provideTokens;

    enum Level {
        Novice,
        copper,
        silver,
        gold
    }

    struct Customer {
        Level customerLevel;
        uint256 GiveToken;
        uint256 totalGiveToken;
        uint256 thresholdAmount;
    }

    uint256 public thismonth;
    uint256 private initialGiveToken = 0;
    uint256 private ThresholdAmount = 0;
    uint256 public ShrimpBuyToken = 0;

    mapping(address => bool) public isOwner; //是否是管理層
    address[] public owners;

    uint256 public initialSupply = 10**18;
    AggregatorV3Interface internal priceFeed;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    constructor(address[] memory _owners) ERC20("Shrimp", "SPT") {
        _mint(msg.sender, initialSupply); //初始金額
        shrimpOwner = msg.sender; //shrimpOwner 是蝦幣的使用者

        thismonth = _daysToDate(block.timestamp / SECONDS_PER_DAY);

        require(_owners.length > 0, "owners required");
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }
    }

    //給用戶token onlyOwner
    function GiveToken(address customerAddr, uint256 amount) public {
        initialGiveToken = initialGiveToken + amount;
        ThresholdAmount = ThresholdAmount + amount; //判斷level的金額扣款
        transfer(customerAddr, amount);

        customerList[customerAddr][thismonth] = Customer({
            GiveToken: amount,
            customerLevel: customerList[customerAddr][thismonth].customerLevel,
            totalGiveToken: initialGiveToken,
            thresholdAmount: ThresholdAmount
        });
    }

    // function isLevel(address customerAddr) public returns (uint256 LevelCount) {
    //     if (350 > balanceOf(customerAddr) && balanceOf(customerAddr) >= 100) {
    //         return 1;
    //     } else if (
    //         1000 > balanceOf(customerAddr) && balanceOf(customerAddr) >= 350
    //     ) {
    //         return 2;
    //     } else if (balanceOf(customerAddr) >= 1000) {
    //         return 3;
    //     }
    // }

    //判斷customerAddr用戶升級，並取得銅銀金
    function isLevel(address customerAddr) public returns (uint256 LevelCount) {
        require(
            customerList[customerAddr][thismonth].thresholdAmount >= 100,
            "not enough token"
        );

        if (
            350 > customerList[customerAddr][thismonth].thresholdAmount &&
            customerList[customerAddr][thismonth].thresholdAmount >= 100
        ) {
            customerList[customerAddr][thismonth].customerLevel = Level.copper;
            customerList[customerAddr][thismonth].thresholdAmount =
                ThresholdAmount -
                100;
            ThresholdAmount = ThresholdAmount - 100;
            return 1;
        } else if (
            1000 > customerList[customerAddr][thismonth].thresholdAmount &&
            customerList[customerAddr][thismonth].thresholdAmount >= 350
        ) {
            customerList[customerAddr][thismonth].customerLevel = Level.silver;
            customerList[customerAddr][thismonth].thresholdAmount =
                ThresholdAmount -
                350;
            ThresholdAmount = ThresholdAmount - 350;
            return 2;
        } else if (
            customerList[customerAddr][thismonth].thresholdAmount >= 1000
        ) {
            customerList[customerAddr][thismonth].customerLevel = Level.gold;
            customerList[customerAddr][thismonth].thresholdAmount =
                ThresholdAmount -
                1000;
            ThresholdAmount = ThresholdAmount - 1000;
            return 3;
        }
    }

    //buytoken 花多少錢購買
    function BuyToken() public payable {
        require(msg.value > 0, "please send some ETH");
        // // 由預言機取得數值
        // AggregatorV3Interface feed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        // (, int256 price, , , ) = feed.latestRoundData();

        // price = price/100000000;

        uint256 amountTobuy = msg.value;

        uint256 setprice = 2;
        //使用以太幣購買shrimp
        uint256 amount = amountTobuy / uint256(setprice);

        _transfer(shrimpOwner, msg.sender, amount);
        ShrimpBuyToken = ShrimpBuyToken + amount;
    }

    function _daysToDate(uint256 _days) internal pure returns (uint256 month) {
        int256 __days = int256(_days);

        int256 L = __days + 68569 + OFFSET19700101;
        int256 N = (4 * L) / 146097;
        L = L - (146097 * N + 3) / 4;
        int256 _year = (4000 * (L + 1)) / 1461001;
        L = L - (1461 * _year) / 4 + 31;
        int256 _month = (80 * L) / 2447;
        L = _month / 11;
        _month = _month + 2 - 12 * L;

        month = uint256(_month);
    }

    function devMintBronze() public {
        _mint(msg.sender, initialSupply * 100);
    }

    function devMintSilver() public {
        _mint(msg.sender, initialSupply * 350);
    }

    function devMintGolden() public {
        _mint(msg.sender, initialSupply * 1000);
    }
}
