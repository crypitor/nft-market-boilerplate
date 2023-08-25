import { BigInt, Address, log } from "@graphprotocol/graph-ts"
import { NFT, Order, Count, CountLevel } from '../../entities/schema'
import * as status from '../order/status'

export const DEFAULT_ID = 'all'

export function buildCount(): Count {
  let count = Count.load(DEFAULT_ID)

  if (count == null) {
    count = new Count(DEFAULT_ID)
    count.totalNFT = 0
    count.totalOrder = 0
    count.nftInOrder = 0
    count.totalExecuted = 0
    count.nftEvolve = 0
  }

  return count as Count
}

export function buildCountLevel(levelId: i32): CountLevel {
  let countLevel = CountLevel.load(BigInt.fromI32(levelId).toString());

  if (countLevel == null) {
    countLevel = new CountLevel(BigInt.fromI32(levelId).toString());
    countLevel.quantity = 0;
    countLevel.count = DEFAULT_ID;
  }

  return countLevel as CountLevel
}

// increase total nft when new nft was created
export function increaseTotalNFT(): Count {
  let count = buildCount();
  count.totalNFT += 1;
  count.save();
  // increase level 0
  let countLevel = buildCountLevel(0);
  countLevel.quantity += 1;
  countLevel.save()
  return count;
}

export function decreaseTotalNFT(level: i32): Count {
  let count = buildCount();
  count.totalNFT -= 1;
  count.save();
  
  let countLevel = buildCountLevel(level);
  countLevel.quantity -= 1;
  countLevel.save()
  return count;
}

export function increaseEvolveNFT(level: i32): Count {
  let count = buildCount();
  count.nftEvolve += 1;
  count.save();

  let oldLevel = buildCountLevel(level-1);
  oldLevel.quantity -= 1;
  oldLevel.save()

  let newLevel = buildCountLevel(level);
  newLevel.quantity += 1;
  newLevel.save()
  return count;
}

export function buildCountFromOrder(order: Order): Count {
  let count = buildCount();
  if(order.status == status.OPEN) {
    count.totalOrder += 1;
    count.nftInOrder += 1;
  } else if (order.status == status.EXECUTED){
    count.nftInOrder -= 1;
    count.totalExecuted += 1;
  } else {
    count.nftInOrder -= 1;
  }
  count.save();
  return count;
}
