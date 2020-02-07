import { BurnerPluginContext, Plugin } from "@burner-wallet/types";
import UnstoppableResolution from "@unstoppabledomains/resolution";

export default class UnstoppablePlugin implements Plugin {
  private infuraKey: string;

  constructor(infuraKey: string) {
    this.infuraKey = infuraKey;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.onAccountSearch(async (search: string) => {
      let udResolution = new UnstoppableResolution();
      if (udResolution.isSupportedDomain(search)) {
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
