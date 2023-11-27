import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@nomicfoundation/hardhat-ignition";
import "@openzeppelin/hardhat-upgrades";
import 'solidity-coverage';
import "solidity-docgen";
import * as dotenv from "dotenv";

dotenv.config();

const COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY || '';
const ALCHEMY_PROJECT_ID = process.env.ALCHEMY_PROJECT_ID || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const POLYSCAN_API_KEY = process.env.POLYSCAN_API_KEY || '';
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || '';
const MNEMONIC = process.env.MNEMONIC || '';;
const GOERLI_URL = process.env.ETH_HTTPS_ENDPOINT!;
const BSC_TEST_URL = process.env.BSC_HTTPS_ENDPOINT!;
const MATIC_TEST_URL = `https://polygon-mumbai.g.alchemy.com/v2/${POLYSCAN_API_KEY}`;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
    },
    goerli: {
      url: GOERLI_URL,
      allowUnlimitedContractSize: true,
      accounts: { mnemonic: MNEMONIC }
    },
    bscTestnet: {
      url: BSC_TEST_URL || "",
      allowUnlimitedContractSize: true,
      chainId: 97,
      accounts: { mnemonic: MNEMONIC }
    },
    polygonMumbai: {
      url: MATIC_TEST_URL,
      chainId: 80001,
      gasPrice: 20000000000,
      accounts: { mnemonic: MNEMONIC }
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: COIN_MARKET_CAP_API_KEY,
    token: "ETH",
    showTimeSpent: true
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      bscTestnet: BSCSCAN_API_KEY,
      polygonMumbai: POLYSCAN_API_KEY
    },  
  }
};

export default config;