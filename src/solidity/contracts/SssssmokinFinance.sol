//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Chain link Oracle
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface IERC20EX is IERC20 {
    function decimals() external view returns (uint8);
}

// 不支援的貨幣
error NotProvideToken();
// 不在有效期限內
error NotInValidityPeriod();
// 沒有任何權限
error NoneBenefits();
// 沒有足夠的庫存
error NotEnoughStock();
// 沒有足夠的額度
error NotEnoughCredit();
// 還款額不足
error RepaymentNotCorrect();

error InvalidTokenAdrress();
error InvalidChainlinkAdrress();

error InvalidPrice();

contract SssssmokinFinance is Ownable {
    event DepositForTokenSuccess(
        uint256 indexed amount,
        address indexed token,
        uint256 indexed exchange
    );

    event DepositForEthSuccess(
        uint256 indexed amount,
        uint256 indexed exchange
    );

    event RepaymentSucess(uint256 pos, uint256 indexed remain);

    // 福利
    struct Benefits {
        // 貸款成數
        uint32 ratio;
        // 年利率
        uint32 apr;
        // 有效期 Timestamp
        uint64 validityTime;
        // 額度
        uint128 credit;
    }

    // 借貸
    struct Loan {
        // 使用利率
        uint32 apr;
        // 借款日期
        uint64 time;
        // 保證金數量
        uint128 margin;
        // 借出數量
        uint256 exchange;
        // 借出貨幣合約地址
        address token;
    }

    // 會員證合約
    IERC1155 public membershipTokenContract;

    // 瞎幣合約
    IERC20 public weeeeToken;

    // 支持的加密貨幣 // ERC20 Token address => Chainlink Token/USD Feed Data Address
    mapping(address => address) private provideTokens;

    // 支持的加密貨幣
    address[] public provideTokensArray;

    // ETH / USD Chainlink
    address private ethPricefeed;

    // 會員福利表
    mapping(uint256 => Benefits) private membershipBenefits;

    // 會員nft編號優先序列表 高到低 金 > 銀 > 銅
    uint256[] public tokenIdOrder;

    // 會員借款資料
    mapping(address => Loan[]) private memberLoaning;

    // fall back function

    fallback() external payable {}

    receive() external payable {}

    constructor(address shrimptoken, address memberToken) {
        setETHChainLink(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        weeeeToken = IERC20(shrimptoken);
        membershipTokenContract = IERC1155(memberToken);
    }

    // 檢查是否支持的貨幣
    modifier checkProvideToken(address token) {
        if (provideTokens[token] == address(0)) {
            revert NotProvideToken();
        }
        _;
    }

    /// region OnlyOwner89p[0--]
    function setETHChainLink(address chainlink) public onlyOwner {
        ethPricefeed = chainlink;
    }

    // 增添支持貨幣
    function setProvideTokens(address token, address chainlink) public {
        address empty = address(0);
        if (token == empty) {
            revert InvalidTokenAdrress();
        }

        if (chainlink == empty) {
            revert InvalidChainlinkAdrress();
        }

        address old = provideTokens[token];
        if (chainlink == old) {
            return;
        }

        provideTokens[token] = chainlink;
        if (old == empty) {
            provideTokensArray.push(token);
        }
    }

    function getAllProvideTokens() public view returns (address[] memory) {
        return provideTokensArray;
    }

    // 移除支持貨幣 盡可能使用這個
    function removeProvideTokens(uint256 pos) public onlyOwner {
        provideTokens[provideTokensArray[pos]] = address(0);
        uint256 last = provideTokensArray.length - 1;
        if (pos < last) {
            provideTokensArray[pos] = provideTokensArray[last];
        }
        provideTokensArray.pop();
    }

    // 移除支持貨幣
    function removeProvideTokens(address token) public onlyOwner {
        provideTokens[token] = address(0);

        for (uint256 i = 0; i < provideTokensArray.length; i++) {
            if (provideTokensArray[i] == token) {
                uint256 last = provideTokensArray.length - 1;
                if (i < last) {
                    provideTokensArray[i] = provideTokensArray[last];
                }
                provideTokensArray.pop();
            }
        }
    }

    function setShrimpToken(address token) public onlyOwner {
        weeeeToken = IERC20(token);
    }

    function setMemberToken(address token) public onlyOwner {
        membershipTokenContract = IERC1155(token);
    }

    //   [copper, silver, golden]
    //    tokenId [0,1,2]
    // 設置會員卡排序 高到低 很少會異動 數量也很少 直接設置整個
    function setTokenIdOrder(uint256[] calldata order) public {
        tokenIdOrder = order;
    }

    function getTokenIdOrder() public view returns (uint256[] memory) {
        return tokenIdOrder;
    }

    // 設置會員福利 考慮到應該很少使用 真的需要單獨設置 再添加
    function setBenefits(uint256 tokenId, Benefits calldata benefits) public {
        membershipBenefits[tokenId] = benefits;
    }

    function setMultiBenefits(
        uint256[] calldata tokenId,
        Benefits[] calldata benefits
    ) public {
        require(tokenId.length == benefits.length, "array length not match");

        for (uint256 i = 0; i < tokenId.length; i++) {
            membershipBenefits[tokenId[i]] = benefits[i];
        }
    }

    // 移除會員福利
    function removeBenefits(uint256 tokenId) public onlyOwner {
        delete membershipBenefits[tokenId];
    }

    /// end of region OnlyOwner

    // 詢問是否支持的貨幣
    function isProvideToken(address token) public view returns (bool) {
        return provideTokens[token] != address(0);
    }

    // 取得全部會員NFT福利
    function getAllBenefits() public view returns (Benefits[] memory) {
        Benefits[] memory benefits = new Benefits[](tokenIdOrder.length);
        for (uint256 i = 0; i < tokenIdOrder.length; i++) {
            benefits[i] = membershipBenefits[tokenIdOrder[i]];
        }
        return benefits;
    }

    function getAllOrderAndBenefits()
        public
        view
        returns (uint256[] memory, Benefits[] memory)
    {
        return (tokenIdOrder, getAllBenefits());
    }

    // 取得指定會員NFT福利
    function getBenefits(uint256 tokenId)
        public
        view
        returns (Benefits memory)
    {
        return membershipBenefits[tokenId];
    }

    function getCredit(uint256 tokenId) public view returns (uint256) {
        return membershipBenefits[tokenId].credit;
    }

    function getUserBenefits(address user)
        public
        view
        returns (Benefits memory)
    {
        address[] memory accounts = new address[](tokenIdOrder.length);
        for (uint256 i = 0; i < accounts.length; i++) {
            accounts[i] = user;
        }

        uint256[] memory balance = membershipTokenContract.balanceOfBatch(
            accounts,
            tokenIdOrder
        );
        for (uint256 j = 0; j < balance.length; j++) {
            if (balance[j] == 0) {
                continue;
            }

            Benefits memory benifest = getBenefits(tokenIdOrder[j]);
            if (
                benifest.validityTime != 0 &&
                benifest.validityTime > block.timestamp
            ) {
                return benifest;
            }
        }

        revert NoneBenefits();
    }

    function getSenderBenefits() public view returns (Benefits memory) {
        return getUserBenefits(_msgSender());
    }

    function getUserMargin(address user) public view returns (uint256) {
        uint256 margin = 0;
        Loan[] memory loanDatas = memberLoaning[user];
        for (uint256 i = 0; i < loanDatas.length; i++) {
            margin += loanDatas[i].margin;
        }
        return margin;
    }

    function getSenderMargin() public view returns (uint256) {
        return getUserMargin(_msgSender());
    }

    function getUserLoaning(address user) public view returns (Loan[] memory) {
        return memberLoaning[user];
    }

    function getSenderLoaning() public view returns (Loan[] memory) {
        return getUserLoaning(_msgSender());
    }

    function deposit(address token, uint256 amount)
        public
        checkProvideToken(token)
    {
        Benefits memory benefits = getSenderBenefits();
        uint256 reqireMargin = getSenderMargin() + amount;
        // credit 可能的值
        // requireMargin 可能的值

        if (benefits.credit < reqireMargin) {
            revert NotEnoughCredit();
        }

        // 數量 乘上允許借貸比例
        uint256 validAmount = (amount * benefits.ratio) / 100;
        // 由預言機取得數值 轉換借貸比例可以取得多少
        uint256 exchange = getTokenExchange(token, validAmount);

        IERC20 tar = IERC20(token);
        uint256 balance = tar.balanceOf(address(this));
        if (balance < exchange) {
            revert NotEnoughStock();
        }

        // 轉瞎幣過來
        weeeeToken.transferFrom(_msgSender(), address(this), amount);

        // 借款轉過去
        tar.transfer(_msgSender(), exchange);

        // 紀錄資料
        memberLoaning[_msgSender()].push(
            Loan(
                benefits.apr,
                uint64(block.timestamp),
                uint128(amount),
                exchange,
                token
            )
        );

        emit DepositForTokenSuccess(amount, token, exchange);
    }

    function depositETH(uint256 amount) public {
        // eth oracle address == 0 不支持 eth
        if (ethPricefeed == address(0)) {
            revert NotProvideToken();
        }

        Benefits memory benefits = getSenderBenefits();
        uint256 reqireMargin = getSenderMargin() + amount;
        if (benefits.credit < reqireMargin) {
            revert NotEnoughCredit();
        }

        //
        // 100000 * 0.5 *
        // ratio : 50
        // 數量 乘上允許借貸比例
        uint256 validAmount = (amount * benefits.ratio) / 100;
        // 由預言機取得數值 轉換借貸比例可以取得多少 wei
        uint256 exchange = getExchangeWei(validAmount);
        address me = address(this);
        if (me.balance < exchange) {
            revert NotEnoughStock();
        }

        // 轉瞎幣過來
        weeeeToken.transferFrom(_msgSender(), address(this), amount);

        // 借款轉過去
        payable(_msgSender()).transfer(exchange);

        // 紀錄資料
        memberLoaning[_msgSender()].push(
            Loan(
                benefits.apr,
                uint64(block.timestamp),
                uint128(amount),
                exchange,
                address(0)
            )
        );

        emit DepositForEthSuccess(amount, exchange);
    }

    // 還款
    function repayment(uint256 pos) public payable {
        Loan[] storage laoning = memberLoaning[_msgSender()];
        require(pos < laoning.length, "position out of range");
        Loan memory tar = laoning[pos];

        // 算利息
        uint256 duration = block.timestamp - tar.time;
        uint256 interest = (tar.margin * duration * tar.apr) / 36500 days;

        // 轉還款回來
        if (tar.token != address(0)) {
            IERC20 token = IERC20(tar.token);
            token.transferFrom(_msgSender(), address(this), tar.exchange);
        } else if (msg.value != tar.exchange) {
            revert RepaymentNotCorrect();
        }

        uint256 remain = 0;
        // 返回扣除利息的瞎幣
        if (tar.margin > interest) {
            remain = tar.margin - interest;
            weeeeToken.transferFrom(address(this), _msgSender(), remain);
        }

        // 清除這筆借單
        uint256 last = laoning.length - 1;
        if (pos < last) {
            laoning[pos] = laoning[last];
        }
        laoning.pop();

        emit RepaymentSucess(pos, remain);
    }

    // price, decimel
    function getTokenFeed(address token)
        public
        view
        checkProvideToken(token)
        returns (int256, uint8)
    {
        return getTokenFeedWithChainlink(provideTokens[token]);
    }

    function getETHFeed() public view returns (int256, uint8) {
        if (ethPricefeed == address(0)) {
            revert NotProvideToken();
        }
        return getTokenFeedWithChainlink(ethPricefeed);
    }

    function getTokenFeedWithChainlink(address aggregator)
        private
        view
        returns (int256, uint8)
    {
        // 由預言機取得數值
        AggregatorV3Interface feed = AggregatorV3Interface(aggregator);
        uint8 decimals = feed.decimals();
        (, int256 price, , , ) = feed.latestRoundData();
        return (price, decimals);
    }

    function getExchangeWei(uint256 amount) public view returns (uint256) {
        // 由預言機取得數值
        AggregatorV3Interface feed = AggregatorV3Interface(ethPricefeed);
        uint8 tarDecimals = feed.decimals();
        (, int256 price, , , ) = feed.latestRoundData();
        if (price < 0) {
            revert InvalidPrice();
        }

        uint256 linkPrice = uint256(price);
        uint256 exchange = (amount * (10**tarDecimals)) / linkPrice;

        return exchange;
    }

    function getTokenExchange(address token, uint256 amount)
        public
        view
        returns (uint256)
    {
        // 由預言機取得數值
        AggregatorV3Interface feed = AggregatorV3Interface(ethPricefeed);
        uint8 feedDecimals = feed.decimals();
        (, int256 price, , , ) = feed.latestRoundData();
        if (price < 0) {
            revert InvalidPrice();
        }

        uint256 linkPrice = uint256(price);
        uint256 exchange = (amount * (10**feedDecimals)) / linkPrice;

        IERC20EX tar = IERC20EX(token);
        uint8 decimal = tar.decimals();
        if (decimal < 18) {
            exchange /= (10**(18 - decimal));
        }

        return exchange;
    }

    /*
    function giveup(uint pos) public {
        Loan[] storage laoning = memberLoaning[_msgSender()];
        require(pos < laoning.length, "position out of range");
        // 清除這筆借單
        uint last = laoning.length - 1;
        if (pos < last) {
            laoning[pos] = laoning[last];
        }
        laoning.pop();
    }
    */
}
