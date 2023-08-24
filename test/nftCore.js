const NFTCore = artifacts.require('NFTCore');

contract('NFTCore', (accounts) => {
  let nftCore;

  const owner = accounts[0];
  const character = 1;
  const delay = 0;

  beforeEach(async () => {
    nftCore = await NFTCore.new();
  });

  it('should spawn a nft correctly', async () => {
    const setspawner = await nftCore.setSpawner(accounts[0], true);
    const result = await nftCore.spawnNft(character, owner, delay);
    let nftId = undefined;
    // Assert the nft details after spawning
    for (let e of result.logs) {
        // console.log(e);
        if(e.event === "NftSpawned") {
            console.log(e.event)
            nftId = e.args._nftId;
        }
    }
    // const nftId = result.logs[1].args._nftId;
    const nft = await nftCore.getNft(nftId);
    const ownerOfNft = await nftCore.ownerOf(nftId);

    assert.equal(nft.character, character);
    assert.equal(nft.exp, 0);
    assert.equal(nft.level, 0);
    assert.equal(ownerOfNft, owner);
  });
});
