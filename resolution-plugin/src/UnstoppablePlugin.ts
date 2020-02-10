import { BurnerPluginContext, Plugin } from "@burner-wallet/types";
import UnstoppableResolution from "@unstoppabledomains/resolution";

const UD_BASE_API_URL = "https://unstoppabledomains.com";

const getReverseResolution = (address: string) => {
  return fetch(`${UD_BASE_API_URL}/api/zns-domains/${address}`)
    .then(resp => resp.json())
    .then(
      ({ domains }: { domains: { label: string; extension: string }[] }) => {
        const _domains = domains.filter(
          domain => domain.extension === "crypto"
        );
        return _domains[0]
          ? _domains[0].label + "." + _domains[0].extension
          : null;
      }
    )
    .catch(() => null);
};
export default class UnstoppablePlugin implements Plugin {
  private infuraKey: string;
  private resolutionCache: { [name: string]: string | null };
  private reverseCache: { [address: string]: string | null };

  constructor(infuraKey: string) {
    this.resolutionCache = {};
    this.reverseCache = {};
    this.infuraKey = infuraKey;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.onAccountSearch(async (search: string) => {
      const cached = this.resolutionCache[search];
      if (cached !== undefined) {
        return cached ? [{ name: search, address: cached }] : [];
      }
      let udResolution = new UnstoppableResolution();
      if (udResolution.isSupportedDomain(search)) {
        udResolution = new UnstoppableResolution({
          blockchain: {
            ens: { url: `https://mainnet.infura.io/v3/${this.infuraKey}` },
            cns: { url: `https://mainnet.infura.io/v3/${this.infuraKey}` }
          }
        });
        const address = await udResolution.address(search, "ETH");
        this.resolutionCache[search] = address;
        return address ? [{ name: search, address }] : [];
      }
      this.resolutionCache[search] = null;
      return [];
    });
    pluginContext.addAddressToNameResolver(async (address: string) => {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return null;
      }
      if (this.reverseCache[address] !== undefined) {
        return this.reverseCache[address];
      }
      const reverseResolution = await getReverseResolution(address);
      this.reverseCache[address] = reverseResolution;
      return reverseResolution;
    });
  }
}
