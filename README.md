# Unstoppable Domains Plugins for Burner Wallet

This repo is forked from the boilerplate for building a new plugin for the Burner Wallet 2.

## Setup

1. Clone the repo
2. Run `yarn install`. This repo uses Lerna and Yarn Workspaces, so `yarn install` will install
  all dependencies and link modules in the repo
3. To connect to mainnet & most testnets, you'll need to provide an Infura key. Create a file
  named `.env` in the `basic-wallet` folder and set the contents to `REACT_APP_INFURA_KEY=<your key from infura.com>`
4. Run `yarn start-local` to start the wallet while connected to Ganache, or run `yarn start-basic`
  to start the wallet connected to Mainnet & xDai

## Unstoppable Plugin
1. CNS (.crypto) and ENS (.eth) resolution using @unstoppabledomains/resolution library
2. Domains resolve when entered in the address field on send page

## Dot Crypto Plugin
1. Page plugin for viewing and transferring .crypto domains
2. Domain images displayed fetched from https://metadata.unstoppabledomains.com/
