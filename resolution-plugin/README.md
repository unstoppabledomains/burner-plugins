# Unstoppable Domains Resolution for Burner Wallet 2

CNS (.crypto) and ENS (.eth) resolution using @unstoppabledomains/resolution library

Domains resolve when entered in the address field on send page

## Use
Include in list of plugins for your Burner Wallet along with your Infura API Key. You can obtain an Infura key here: https://infura.io/register

plugins={[
  new UnstoppableResolutionPlugin(INFURA_KEY)
]}

