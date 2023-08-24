// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title MetaverseBaseMarket
 * @notice Implements the classifieds board market. The market will be governed
 * by an Native token as currency, and an ERC721 token that represents the
 * ownership of the items being orderd. Only ads for selling items are
 * implemented. The item tokenization is responsibility of the ERC721 contract
 * which should encode any item details.
 */
contract MetaverseBaseMarket {
    using SafeMath for uint256;
    
    event OrderStatusChange(uint256 ad, bytes32 status);

    struct Order {
        uint256 id;
        address seller;
        uint256 item;
        address nftAddress;
        uint256 price;
        uint256 expireAt;
        bytes32 status; // Open, Executed, Cancelled
    }

    IERC20 public integratedERC20;

    mapping(uint256 => Order) public orders;
    // From ERC721 registry assetId to Order (to avoid asset collision)
    mapping (address => mapping(uint256 => uint256)) public orderByAssetId;
    mapping(address => bool) public approvedNfts;

    uint256 orderCounter = 1;
    
    function _beforeOpen(uint256 _item, address _nftAddress, uint256 _price, uint256 _expireAt) internal virtual {
        IERC721 nft = IERC721(_nftAddress);
        require(approvedNfts[_nftAddress], "NFT is not allowed trading on market!");
        require(msg.sender == nft.ownerOf(_item), "Only owner can open order!");
        require(nft.getApproved(_item) == address(this) || nft.isApprovedForAll(msg.sender, address(this)), "Marketplace need authorize from owner!");
        require(_price > 0, "Price must be greater than 0!");
        require(_expireAt > block.timestamp.add(1 minutes), "New Order lifecycle must longer than 1 minute!");
    }

    /**
     * @dev Opens a new order. Puts _item in escrow.
     * @param _item The id for the item to order.
     * @param _price The amount of currency for which to order the item.
     */
    function openOrder(uint256 _item, address _nftAddress, uint256 _price, uint256 _expireAt)
        public
        virtual
        returns(uint256 orderId)
    {
        _beforeOpen(_item, _nftAddress, _price, _expireAt);
        orders[orderCounter] = Order({
            id: orderCounter,
            seller: msg.sender,
            item: _item,
            nftAddress: _nftAddress,
            price: _price,
            expireAt: _expireAt,
            status: "Open"
        });
        orderId = orderCounter;
        orderByAssetId[_nftAddress][_item] = orderId;
        orderCounter += 1;
        emit OrderStatusChange(orderId, "Open");
    }

    function _beforeExecute(Order memory order) internal virtual returns(uint256) {
        require(order.status == "Open", "Order is not Open.");
        require(block.timestamp <= order.expireAt, "Expired Order");
        return order.price;
    }

    /**
     * @dev Executes a order. Must have approved this contract to transfer the
     * amount of currency specified to the seller. Transfers ownership of the
     * item to the filler.
     * @param _order The id of an existing order
     */
    function executeOrder(uint256 _order)
        public
        virtual
    {
        Order storage order = orders[_order];
        uint256 priceAfterFee = _beforeExecute(order);
        orders[_order].status = "Executed";
        integratedERC20.transferFrom(msg.sender, order.seller, priceAfterFee);
        IERC721(order.nftAddress).transferFrom(order.seller, msg.sender, order.item);
        emit OrderStatusChange(_order, "Executed");
    }

    /**
     * @dev Cancels a order by the seller.
     * @param _orderId The order to be cancelled.
     */
    function cancelOrder(uint256 _orderId)
        public
        virtual
    {
        Order storage order = orders[_orderId];
        require(
            msg.sender == order.seller,
            "Order can be cancelled only by seller."
        );
        require(order.status == "Open", "Order is not Open.");
        order.status = "Cancelled";
        emit OrderStatusChange(_orderId, "Cancelled");
    }

    /**
     * @dev delete order in storage to get gas back, increase overall gas
     * when the same asset is put back to the market
     */
    function _deleteOrder(uint256 _orderId) internal {
        Order storage order = orders[_orderId];
        delete orderByAssetId[order.nftAddress][order.item];
        delete orders[_orderId];
        emit OrderStatusChange(_orderId, "Delete");
    }
}