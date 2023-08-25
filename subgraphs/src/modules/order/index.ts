import { NFT, Order } from '../../entities/schema'
import { log } from "@graphprotocol/graph-ts"
import { buildCountFromOrder } from "../count";
import { buildAccountFromOrder } from "../account";
import * as status from './status'

// Clean order when transfering inOrder nft
// order in smart contract can not execute because the poster is nolonger owner
// if the poster buyback and some one execute order. the order will become executed
export function cleanOrder(nft: NFT): void {
  if(nft.inOrder == null) {
    return;
  }
  let order = Order.load(nft.inOrder!);
  if(!order) {
      return;
  }
  log.warning("CLEAN ORDER FOR ROCK-ID: %s", [nft.id])
  order.status = status.INVALID;
  order.save();
  buildCountFromOrder(order);
  buildAccountFromOrder(order);
  nft.inOrder = null;
}
