const HDWalletProvider = require("@truffle/hdwallet-provider");

const testenv = require('./testenv.json');
const mainenv = require('./env.json');
const mumbai = require('./mumbai.json');


module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*",
      gasPrice: 50000000000,
    },
    test: {
      host: "graph-node",
      port: 8545,
      network_id: "1010",
      gasPrice: 5000000000,
      gas: 7000000
    },
    bsc: {
      provider: function () {
        return new HDWalletProvider(mainenv.mnemonic, "https://bsc-dataseed1.binance.org/");
      },
      network_id: '56',
      gasPrice: 6000000000,
    },
    bscTestnet: {
      provider: function () {
        return new HDWalletProvider(testenv.mnemonic, "https://data-seed-prebsc-1-s1.binance.org:8545/");
      },
      network_id: '97',
      gasPrice: 10000000000,
      production: true
    },
    polytest: {
      provider: function () {
        return new HDWalletProvider(mumbai.mnemonic, "https://polygon-mumbai.infura.io/v3/d7aa2a84a44548819617058aa0a3e347");
      },
      network_id: '80001',
      gasPrice: 2000000000,
      production: false
    }
  },

  compilers: {
    solc: {
      version: "0.8.17",
      parser: "solcjs",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  },
  plugins: [
    //truffle run verify Token --network bsc
    'truffle-plugin-verify', 'truffle-security'
  ],
  api_keys: {
    etherscan: mainenv.ETHERSCAN_APIKEY,
    bsc: mainenv.BSCSCAN_APIKEY
  }
};