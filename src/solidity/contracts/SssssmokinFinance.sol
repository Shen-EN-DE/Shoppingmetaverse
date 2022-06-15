//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 不支援的貨幣
error NotProvideToken();
// 不在有效期限內
error NotInValidityPeriod();
// 沒有任何權限
error NoneBenifits();
// 沒有足夠的庫存
error NotEnoughStock();
// 沒有足夠的額度
error NotEnoughCredit();
// 還款額不足
error RepaymentNotCorrect();

contract SssssmokinFinance is Ownable {
    event DepositForTokenSuccess(
        uint256 amount,
        address token,
        uint256 exchange
    );

    event DepositForEthSuccess(uint256 indexed amount, uint256 indexed exchange);

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

    // 支持的加密貨幣
    mapping(address => bool) public provideTokens;

    // 支持的加密貨幣
    address[] public provideTokensArray;

    // 會員福利表
    mapping(uint256 => Benefits) membershipBenefits;

    // 會員nft編號優先序列表 高到低 金 > 銀 > 銅
    uint256[] public tokenIdOrder;

    // 會員借款資料
    mapping(address => Loan[]) private memberLoaning;

    // fall back function

    fallback() external payable {}

    receive() external payable {}

    // 檢查是否支持的貨幣
    modifier checkProvideToken(address token) {
        if (provideTokens[token] != true) {
            revert NotProvideToken();
        }
        _;
    }

    /// region OnlyOwner

    // 增添支持貨幣
    function addProvideTokens(address token) public onlyOwner {
        if (provideTokens[token] == true) {
            return;
        }
        provideTokens[token] = true;
        provideTokensArray.push(token);
    }

    // 移除支持貨幣 盡可能使用這個
    function removeProvideTokens(uint256 pos) public onlyOwner {
        provideTokens[provideTokensArray[pos]] = false;
        uint256 last = provideTokensArray.length - 1;
        if (pos < last) {
            provideTokensArray[pos] = provideTokensArray[last];
        }
        provideTokensArray.pop();
    }

    // 移除支持貨幣
    function removeProvideTokens(address token) public onlyOwner {
        provideTokens[token] = false;

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

    // 設置會員卡排序 高到低 很少會異動 數量也很少 直接設置整個
    function setTokenIdOrder(uint256[] calldata order) public {
        tokenIdOrder = order;
    }

    // 設置會員福利 考慮到應該很少使用 真的需要單獨設置 再添加
    function setBenifist(uint256 tokenId, Benefits calldata benifist) public {
        membershipBenefits[tokenId] = benifist;
    }

    // 移除會員福利
    function removeBenifist(uint256 tokenId) public onlyOwner {
        delete membershipBenefits[tokenId];
    }

    /// end of region OnlyOwner

    // 詢問是否支持的貨幣
    function isProvideToken(address token) public view returns (bool) {
        return provideTokens[token];
    }

    // 取得全部會員NFT福利
    function getAllBenifits() public view returns (Benefits[] memory) {
        Benefits[] memory benefits = new Benefits[](tokenIdOrder.length);
        for (uint256 i = 0; i < tokenIdOrder.length; i++) {
            benefits[i] = membershipBenefits[tokenIdOrder[i]];
        }
        return benefits;
    }

    // 取得指定會員NFT福利
    function getBenifits(uint256 tokenId)
        public
        view
        returns (Benefits memory)
    {
        return membershipBenefits[tokenId];
    }

    function getCredit(uint256 tokenId) public view returns (uint256) {
        return membershipBenefits[tokenId].credit;
    }

    function getUserBenifits(address user)
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

            Benefits memory benifest = getBenifits(tokenIdOrder[j]);
            if (
                benifest.validityTime != 0 &&
                benifest.validityTime > block.timestamp
            ) {
                return benifest;
            }
        }

        revert NoneBenifits();
    }

    function getUserBenifits() public view returns (Benefits memory) {
        return getUserBenifits(_msgSender());
    }

    function getMargin(address user) public view returns (uint256) {
        uint256 margin = 0;
        Loan[] memory loanDatas = memberLoaning[user];
        for (uint256 i = 0; i < loanDatas.length; i++) {
            margin += loanDatas[i].margin;
        }
        return margin;
    }

    function getMargin() public view returns (uint256) {
        return getMargin(_msgSender());
    }

    function getUserLoaning(address user) public view returns (Loan[] memory) {
        return memberLoaning[user];
    }

    function getUserLoaning() public view returns (Loan[] memory) {
        return getUserLoaning(_msgSender());
    }

    function deposit(address token, uint256 amount)
        public
        checkProvideToken(token)
    {
        Benefits memory benefits = getUserBenifits();
        uint256 reqireMargin = getMargin() + amount;
        if (benefits.credit < reqireMargin) {
            revert NotEnoughCredit();
        }
        // 要由預言機取得的數值
        uint256 linkPrice = 1 ether / uint256(3000);

        // 數量 乘上抵押率
        uint256 exchange = (amount * benefits.ratio * linkPrice) / 100;
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

    function deposit(uint256 amount) public {
        Benefits memory benefits = getUserBenifits();
        uint256 reqireMargin = getMargin() + amount;
        if (benefits.credit < reqireMargin) {
            revert NotEnoughCredit();
        }
        // 要由預言機取得的數值
        uint256 linkPrice = 1 ether / uint256(3000);

        // 數量 乘上抵押率
        uint256 exchange = (amount * benefits.ratio * linkPrice) / 100;
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
