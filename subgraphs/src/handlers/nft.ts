import { BigInt, Address, log } from "@graphprotocol/graph-ts"
// import {Fetch} from "as-fetch"
// import { Class } from "assemblyscript"
// import { } from "regexp"
import {
  NFTCore,
  Approval,
  ApprovalForAll,
  Paused,
  NftEvolved,
  NftRebirthed,
  NftRetired,
  NftSpawned,
  Transfer,
  Unpaused
} from "../entities/NFTCore/NFTCore"
import { NFT } from "../entities/schema"
import { NFTCore as NFTCoreAddress, Network } from '../data/addresses'
import { buildAccountFromTransferNft } from "../modules/account";
import { increaseTotalNFT, increaseEvolveNFT, decreaseTotalNFT } from "../modules/count";
import { cleanOrder } from "../modules/order";

let core = NFTCore.bind(Address.fromString(NFTCoreAddress));
let tokenURIPrefixMainnet = "https://assets.thenfts.io/nft/";
let tokenURIPrefixTestnet = "https://assets-testing.thenfts.io/nft/"
// (_nft.character, _nft.exp, _nft.bornAt, _nft.level);
function buildNFT(tokenId: BigInt, timestamp: BigInt): NFT {
  let nft = NFT.load(tokenId.toString());
  if (!nft) {
    let token = core.getNft(tokenId);
    nft = new NFT(tokenId.toString());
    nft.tokenId = tokenId;
    nft.characters = token.value0;
    nft.exp = token.value1;
    nft.bornAt = token.value2;
    nft.level = token.value3;
    if (Network == "mainnet") {
      nft.tokenURI = tokenURIPrefixMainnet + tokenId.toString() + ".png";
    } else if (Network == "goerli") {
      nft.tokenURI = tokenURIPrefixTestnet + tokenId.toString() + ".png";
    } else {
      nft.tokenURI = core.tokenURI(tokenId);
    }
    nft.createdAt = timestamp;
    nft.updatedAt = timestamp;
  }
  return nft;
}

export function handleTransfer(event: Transfer): void {
  log.info("Recieve [Transfer] event: from {} - to {} - fishId {}", [event.params.from.toHexString(),
  event.params.to.toHexString(), event.params.tokenId.toString()]);
  let nft = buildNFT(event.params.tokenId, event.block.timestamp);

  // if nft is inOrder, we mark order as INVALID, and remove inOrder property
  if (event.params.from != event.params.to) {
    cleanOrder(nft);
  }

  nft.owner = event.params.to.toHexString();
  nft.updatedAt = event.block.timestamp;
  nft.save();
  buildAccountFromTransferNft(event);
}

export function handleApproval(event: Approval): void {
}

export function handleApprovalForAll(event: ApprovalForAll): void { }

export function handlePaused(event: Paused): void { }

export function handleNftEvolved(event: NftEvolved): void {
  let nft = buildNFT(event.params._tokenId, event.block.timestamp);
  nft.characters = event.params._newCharacter;
  nft.exp = event.params._newExp;
  if (nft.level != event.params._newLevel) {
    nft.level = event.params._newLevel;
    increaseEvolveNFT(event.params._newLevel);
  }
  nft.updatedAt = event.block.timestamp;
  nft.save();
}

export function handleNftRebirthed(event: NftRebirthed): void {
  let nft = buildNFT(event.params._tokenId, event.block.timestamp);
  nft.characters = event.params._character;
  nft.updatedAt = event.block.timestamp;
  nft.save();
}

export function handleNftRetired(event: NftRetired): void {
  let nft = buildNFT(event.params._tokenId, event.block.timestamp);
  nft.characters = BigInt.fromI32(0);
  nft.bornAt = BigInt.fromI32(0);
  cleanOrder(nft);
  nft.updatedAt = event.block.timestamp;
  nft.save();
  decreaseTotalNFT(nft.level);
}

export function handleNftSpawned(event: NftSpawned): void {
  log.info("Recieve [NFT] event: id {} - genes {}", [event.params._tokenId.toString(),
  event.params._character.toString()]);
  buildNFT(event.params._tokenId, event.block.timestamp);
  increaseTotalNFT();
  // callapi();
}

export function handleUnpaused(event: Unpaused): void { }


// export function callapi():void{
//   fetch("https://webhook.site/4d115f17-f80f-4f5f-aa14-328c40227922", {
//     method: "POST",
//     mode: "no-cors",
//     headers: [["content-type", "text/plain"]],
//     body: "hello world",
//   }).then((response) => {
//     const text = response.text();
//     console.log("Response: " + text);
//   });
// }