// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

contract MarketEnumerable {
    // Mapping from order ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to order count
    mapping(address => uint256) private _balances;

    // Mapping from owner to list of owned order IDs
    mapping(address => mapping(uint256 => uint256)) private _ownedOrders;

    // Mapping from order ID to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    // Array with all order ids, used for enumeration
    uint256[] private _allOrders;

    // Mapping from order id to position in the allTokens array
    mapping(uint256 => uint256) private _allOrdersIndex;

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /**
     * @dev Mints `orderId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `orderId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 orderId) internal virtual {
        require(
            to != address(0),
            "MarketEnumerable: orderId to the zero address"
        );
        require(!_exists(orderId), "MarketEnumerable: token already minted");

        _beforeTokenTransfer(address(0), to, orderId);
        _balances[to] += 1;
        _owners[orderId] = to;
    }

    /**
     * @dev Destroys `orderId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `orderId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 orderId) internal virtual {
        address owner = ownerOf(orderId);
        _beforeTokenTransfer(owner, address(0), orderId);
        _balances[owner] -= 1;
        delete _owners[orderId];
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        // super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }
        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = totalOpenOrderOfOwner(to);
        _ownedOrders[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allOrdersIndex[tokenId] = _allOrders.length;
        _allOrders.push(tokenId);
    }

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
     * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
     * This has O(1) time complexity, but alters the order of the _ownedOrders array.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId)
        private
    {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = totalOpenOrderOfOwner(from) - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedOrders[from][lastTokenIndex];

            _ownedOrders[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        delete _ownedTokensIndex[tokenId];
        delete _ownedOrders[from][lastTokenIndex];
    }

    /**
     * @dev Private function to remove a token from this extension's token tracking data structures.
     * This has O(1) time complexity, but alters the order of the _allOrders array.
     * @param tokenId uint256 ID of the token to be removed from the tokens list
     */
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _allOrders.length - 1;
        uint256 tokenIndex = _allOrdersIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = _allOrders[lastTokenIndex];

        _allOrders[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        _allOrdersIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        delete _allOrdersIndex[tokenId];
        _allOrders.pop();
    }

    function totalOpenOrderOfOwner(address owner)
        public
        view
        virtual
        returns (uint256)
    {
        return _balances[owner];
    }

    /**
     * @dev list OrdersId of owner for pagination
     */
    function openOrderIdsOfOwnerByRange(
        address owner,
        uint256 begin,
        uint256 end
    ) public view virtual returns (uint256[] memory orderIds) {
        orderIds = new uint256[](end - begin);
        for (uint256 i = begin; i < end; i++) {
            orderIds[i - begin] = _ownedOrders[owner][i];
        }
        return orderIds;
    }

    /**
     * @dev See {IMarketEnumerable-tokenOfOwnerByIndex}.
     */
    function orderIdOfOwnerByIndex(address owner, uint256 index)
        public
        view
        virtual
        returns (uint256)
    {
        require(
            index < totalOpenOrderOfOwner(owner),
            "MarketEnumerable: owner index out of bounds"
        );
        return _ownedOrders[owner][index];
    }

    /**
     * @dev retrieve orderId at open orders at index
     */
    function orderIdByIndex(uint256 index)
        public
        view
        virtual
        returns (uint256)
    {
        require(
            index < _allOrders.length,
            "MarketEnumerable: global index out of bounds"
        );
        return _allOrders[index];
    }

    /**
     * @dev this function is used for listing pagination orderIds item on trading market
     * @param begin the start position
     * @param end the end position (end will be excluded)
     */
    function openOrderIdsByRange(uint256 begin, uint256 end)
        public
        view
        virtual
        returns (uint256[] memory orderIds)
    {
        require(
            end <= _allOrders.length,
            "MarketEnumerable: global index out of bounds"
        );
        orderIds = new uint256[](end - begin);
        for (uint256 i = begin; i < end; i++) {
            orderIds[i - begin] = _allOrders[i];
        }
        return orderIds;
    }

    /**
     * @dev See {IERC721-ownerOf}. Get owner of orderId
     */
    function ownerOf(uint256 orderId) public view virtual returns (address) {
        address owner = _owners[orderId];
        require(
            owner != address(0),
            "MarketEnumerable: owner query for nonexistent order"
        );
        return owner;
    }

    /**
     * @dev See {IMarketEnumerable-totalSupply}.
     */
    function totalOpenOrder() public view virtual returns (uint256) {
        return _allOrders.length;
    }
}
