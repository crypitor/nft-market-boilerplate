const TokenContract = artifacts.require('MyToken');
const BN = require('bn.js');
contract('TokenContract', (accounts) => {
  let token;

  const owner = accounts[0];
  const recipient = accounts[1];
  const anotherAccount = accounts[2];
  const total = new BN(1000000000000000);

  beforeEach(async () => {
    token = await TokenContract.new('MTK', 'MyToken');
  });

  it('should deploy the token contract', async () => {
    assert.ok(token.address);
  });

  it('should have correct initial supply and balance', async () => {
    const totalSupply = await token.totalSupply();
    const ownerBalance = await token.balanceOf(owner);

    assert.equal(totalSupply, ownerBalance);
  });

  it('should transfer tokens correctly', async () => {
    const amount = 100;
    await token.transfer(recipient, amount, { from: owner });

    const ownerBalance = await token.balanceOf(owner);
    const recipientBalance = await token.balanceOf(recipient);
    console.log(totalSupply);
    assert.equal(ownerBalance, 1000000000000000 - amount);
    assert.equal(recipientBalance, amount);
  });

  it('should not allow transfer of more tokens than the sender owns', async () => {
    const amount = 1000001;

    try {
      await token.transfer(recipient, amount, { from: owner });
      assert.fail('Transfer should have thrown an error');
    } catch (error) {
      assert(error.message.includes('revert'), 'Expected revert error');
    }
  });

  it('should not allow transfer from an empty account', async () => {
    const amount = 100;

    try {
      await token.transfer(anotherAccount, amount, { from: recipient });
      assert.fail('Transfer should have thrown an error');
    } catch (error) {
      assert(error.message.includes('revert'), 'Expected revert error');
    }
  });
});
