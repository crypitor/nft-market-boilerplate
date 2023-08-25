import { BigInt, Address } from '@graphprotocol/graph-ts'
import { Transfer } from '../../entities/NFTCore/NFTCore';
import { Account, Order } from '../../entities/schema'
import * as status from '../order/status'

let ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
function buildAccount(id: string): Account {
  let account = Account.load(id);
    if (!account) {
      account = new Account(id);
      account.totalExecuted = 0;
      account.totalOrder = 0;
      account.totalTransacted = 0;
      account.nftBalance = 0;
      account.balance = 0;
    }
    return account as Account;
}

export function buildAccountFromTransferNft(event: Transfer): void {
  if(event.params.to.toHexString() != ADDRESS_ZERO) {
    let to = buildAccount(event.params.to.toHexString());
    to.nftBalance += 1;
    to.save();
  }

  if(event.params.from.toHexString() != ADDRESS_ZERO) {
    let from = buildAccount(event.params.from.toHexString());
    from.nftBalance -= 1;
    from.save();
  }
}

export function buildAccountFromOrder(order: Order): void {
  let seller = buildAccount(order.seller);
  if(order.status == status.OPEN) {
    seller.totalOrder += 1;
    seller.save();
  } else if(order.status == status.EXECUTED) {
    let buyer = buildAccount(order.buyer!);
    buyer.totalTransacted = buyer.totalTransacted + 1;
    buyer.save();

    seller.totalExecuted += 1;
    seller.save();
  } else if(order.status == status.CANCEL) {

  }
}


