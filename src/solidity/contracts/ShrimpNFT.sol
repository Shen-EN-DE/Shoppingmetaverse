// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IShrimp is IERC20 {
    function isLevel(address customerAddr)
        external
        returns (uint256 LevelCount);
}

contract ShrimpNFT is ERC1155, Ownable, ERC1155Burnable {
    //NFT種類
    uint256 public constant Copper_Shrimp = 0;
    uint256 public constant Silver_Shrimp = 1;
    uint256 public constant Golden_Shrimp = 2;

    //引入ERC20
    IShrimp public stakingToken;

    //
    constructor(address _stakingToken)
        ERC1155("https://game.example/api/item/{id}.json")
    {
        _mint(msg.sender, Copper_Shrimp, 10**9, "");
        _mint(msg.sender, Silver_Shrimp, 10**9, "");
        _mint(msg.sender, Golden_Shrimp, 10**9, "");
        stakingToken = IShrimp(_stakingToken);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    //使用者主動換取ShrimpNFT
    function GetNFT() public returns (string memory) {
        uint256 ShrimpNFTLevel = stakingToken.isLevel(msg.sender);

        //ShrimpNFTLevel = 1  =>Copper /ShrimpNFTLevel = 2  =>Sliver /ShrimpNFTLevel = 3  =>Golden

        if (ShrimpNFTLevel == 1) {
            _mint(msg.sender, 0, 1, "");
            return "Get Copper_Shrimp";
        } else if (ShrimpNFTLevel == 2) {
            _mint(msg.sender, 1, 1, "");
            return "Get Silver_Shrimp";
        } else if (ShrimpNFTLevel == 3) {
            _mint(msg.sender, 2, 1, "");
            return "Get Golden_Shrimp";
        } else {
            return "Not eligible";
        }
    }

    //查詢使用者擁有之NFT階級
    function InquireUserNFT(address UserAddress)
        public
        view
        returns (string memory)
    {
        uint256 UserNFTId = 3;

        //以擁有最高階級的NFT回傳階級參數

        if (balanceOf(UserAddress, 2) >= 1) {
            UserNFTId = 0;
            return "Golden";
        } else if (balanceOf(UserAddress, 1) >= 1) {
            UserNFTId = 1;
            return "Silver";
        } else if (balanceOf(UserAddress, 0) >= 1) {
            UserNFTId = 2;
            return "Copper";
        } else {
            return "User has no Shrimp NFT";
        }
    }
}
