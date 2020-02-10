import { BurnerPluginContext, Plugin } from "@burner-wallet/types";
import DotCryptoPage from "./ui/DotCryptoPage";

export default class DotCryptoPlugin implements Plugin {
  public pluginContext?: BurnerPluginContext;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;
    pluginContext.addButton("apps", ".crypto domains", "/dot-crypto", {
      description: "View and transfer your .crypto domains"
    });
    pluginContext.addPage("/dot-crypto", DotCryptoPage);
  }

  getWeb3Network = (network: string) => {
    if (this.pluginContext) {
      try {
        const web3 = this.pluginContext.getWeb3(network);
        if (
          web3 &&
          web3.givenProvider &&
          web3.givenProvider.networkVersion === network &&
          web3.currentProvider.network === network
        ) {
          return web3;
        }
      } catch (e) {}
    }
    return null;
  };
}
