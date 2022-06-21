# NFT smart contracts

Deployed NFTs at goerli testnet
```
Basic NFT : 0xB40e409Dd0F99F414D5C3c6a968170A6Cde155CF
Random NFT : 0x535479d382EBE54911B2D6AF100BE7a8b22f202a
Dynamic NFT : 0x50314564c7B5E30421da51879E49158949496Ad9
```

Install npm dependencies  
`npm i install`

Compile contracts  
`npx hardhat compile`

Test contracts  
`npx hardhat test`

Deploy contracts at localhost  
`npx hardhat deploy --tags main`

Deploy contracts at goerli testnet  
`npx hardhat deploy --network goerli --tags main`
