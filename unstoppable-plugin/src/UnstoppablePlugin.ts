import { BurnerPluginContext, Plugin } from "@burner-wallet/types";
import { Asset } from "@burner-wallet/assets";
import UnstoppableResolution from "@unstoppabledomains/resolution";

const getInfuraKeyFromAssets = (assets: Asset[]) => {
  for (const asset of assets) {
    if (asset.id === "eth" && asset.network === "1") {
      const web3 = asset.getWeb3();
      for (const gateway of web3.currentProvider.core.gateways) {
        if (gateway.available) {
          if (gateway.providerStrings && gateway.providerStrings[1]) {
            const re = new RegExp(".*/(.*)");
            return gateway.providerStrings[1].match(re)[1];
          }
        }
      }
    }
  }
  return null;
};

export default class UnstoppablePlugin implements Plugin {
  private infuraKey?: string;

  initializePlugin(pluginContext: BurnerPluginContext) {
    const assets = pluginContext.getAssets();
    this.infuraKey = getInfuraKeyFromAssets(assets);
    pluginContext.onAccountSearch(async (search: string) => {
      let udResolution = new UnstoppableResolution();
      if (udResolution.isSupportedDomain(search)) {
        if (!this.infuraKey) {
          return [
            {
              name: search,
              address: "Please connect to mainnet to resolve this domain"
            }
          ];
        }
        udResolution = new UnstoppableResolution({
          blockchain: {
            ens: { url: `https://mainnet.infura.io/v3/${this.infuraKey}` },
            cns: { url: `https://mainnet.infura.io/v3/${this.infuraKey}` }
          }
        });
        const address = await udResolution.address(search, "ETH");
        if (address) {
          return [{ name: search, address }];
        }
        return [{ name: search, address: "No address set for this domain" }];
      }
      return [];
    });
  }
}
