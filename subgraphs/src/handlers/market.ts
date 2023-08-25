import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import {
  MetaverseMarket as Market,
  ApproveNFT,
  CancelOrder,
  ExecuteOrder,
  OpenOrder,
  OrderStatusChange,
  OwnershipTransferred
} from "../entities/MetaverseMarket/MetaverseMarket"
import { Order, NFT } from "../entities/schema"
import * as status from '../modules/order/status';
import { buildAccountFromOrder } from "../modules/account";
import { buildCountFromOrder } from "../modules/count";
import { cleanOrder } from "../modules/order";
import { MetaverseMarket as MetaverseMarketAddress, NFTCore as NFTCoreAddress } from "../data/addresses";

let market = Market.bind(Address.fromString(MetaverseMarketAddress));

// (order.seller, order.item, order.nftAddress, order.price, order.expireAt, order.status);
function buildOrder(orderId: BigInt, timestamp: BigInt): Order {
  let order = Order.load(orderId.toString());
  if (order == null) {
    log.info("CREATE NEW ORDER WITH ORDER-ID: {} MARKET {}", [orderId.toString(), MetaverseMarketAddress])
    let trade = market.getOrder(orderId);
    order = new Order(orderId.toString());
    order.orderId = orderId;
    order.seller = trade.value0.toHexString();
    if (trade.value2.toHexString() == NFTCoreAddress) {
      order.nft = trade.value1.toString();
    }
    order.price = trade.value3;
    order.expireAt = trade.value4;
    order.timestamp = timestamp;
    order.updatedAt = timestamp;
  }
  return order;
}

export function handleApproveNFT(event: ApproveNFT): void {
}

export function handleCancelOrder(event: CancelOrder): void {
  log.info("Handle CancelOrder event: seller {} - orderId {}", [event.params.poster.toHexString(), event.params.orderId.toString()])
  let order = buildOrder(event.params.orderId, event.block.timestamp);
  order.status = status.CANCEL;
  order.save();

  let nft = NFT.load(order.nft);
  if (nft) {
    nft.inOrder = null;
    // nft.lastPrice = null;
    nft.updatedAt = event.block.timestamp;
    nft.save();
  }
  buildCountFromOrder(order);
}

export function handleExecuteOrder(event: ExecuteOrder): void {
  log.info("Handle ExecuteOrder event: orderId {} - buyer {}", [event.params.orderId.toString(), event.params.buyer.toHexString()])
  let order = buildOrder(event.params.orderId, event.block.timestamp);
  order.status = status.EXECUTED;
  order.buyer = event.params.buyer.toHexString();
  order.updatedAt = event.block.timestamp;
  order.executeTxn = event.transaction.hash;
  order.save();

  let nft = NFT.load(order.nft);
  if (nft) {
    nft.inOrder = null;
    nft.updatedAt = event.block.timestamp;
    nft.save();
  }

  buildAccountFromOrder(order);
  buildCountFromOrder(order);
}

export function handleOpenOrder(event: OpenOrder): void {
  log.info("Handle OpenOrder event: orderId {} - seller {} - nft {} - price {}",
    [event.params.orderId.toString(), event.params.poster.toHexString(), event.params.itemId.toString(), event.params.price.toString()])
  let order = buildOrder(event.params.orderId, event.block.timestamp);
  order.updatedAt = event.block.timestamp;
  order.status = status.OPEN;
  order.save();

  let nft = NFT.load(order.nft);
  if (nft) {
    cleanOrder(nft);
    // nft is not in any order. new order will be increase
    if(nft.inOrder == null) {
      buildAccountFromOrder(order);
      buildCountFromOrder(order);
    }
    nft.inOrder = order.id;
    nft.lastPrice = order.price;
    nft.updatedAt = event.block.timestamp;
    nft.save();
  }
}

export function handleOrderStatusChange(event: OrderStatusChange): void { }

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }
