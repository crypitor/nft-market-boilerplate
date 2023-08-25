# NFT-Market-Contracts

This project contains multiple pieces to create a functional (although not production ready) NFT marketplace blockchain

## Requirements

- Node.js at least v16.19.0— [Install Node](https://nodejs.org/en)

## Build & Compile
```bash
mv env.sample.json env.json  
yarn  
yarn add global truffle  
```

## Truffle compile and migrate
```bash
truffle compile  
truffle develop  --log
truffle migrate  
truffle test
```
### Deploy smart contracts
```bash
truffle migrate --network mainnet
```

# Subgraph

## Build
```bash
cd subgraphs
yarn build
```