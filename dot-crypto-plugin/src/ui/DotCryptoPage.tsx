import React, { useEffect, useState } from "react";
import { PluginPageContext, Asset } from "@burner-wallet/types";
import DomainCard from "./DomainCard";

const UD_BASE_API_URL = "https://unstoppabledomains.com";

const getMainnetWeb3 = (assets: Asset[]) => {
  for (const asset of assets) {
    if (asset.id === "eth" && asset.network === "1") {
      const web3 = asset.getWeb3();
      return web3;
    }
  }
  return null;
};

const DotCryptoPage: React.FC<PluginPageContext> = ({
  BurnerComponents,
  defaultAccount,
  assets
}) => {
  const { Page } = BurnerComponents;
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState(
    [] as Array<{ label: string; extension: string }>
  );
  const [web3, setWeb3] = useState(null as any);

  useEffect(() => {
    const _web3 = getMainnetWeb3(assets);
    setWeb3(_web3);
    fetch(
      `${UD_BASE_API_URL}/api/zns-domains/${_web3.givenProvider.selectedAddress}`
    )
      .then(resp => resp.json())
      .then(({ domains }) => {
        const _domains = [];
        for (const domain of domains) {
          if (domain.extension === "crypto") {
            _domains.push(domain);
          }
        }
        setLoading(false);
        setDomains(_domains);
      });
  }, [defaultAccount]);

  return (
    <Page title="Your .crypto domains">
      <div>Account: {defaultAccount}</div>
      {loading && (
        <div
          style={{
            height: "20em",
            justifyContent: "center",
            display: "flex",
            alignItems: "center"
          }}
        >
          Loading...
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between"
        }}
      >
        {domains.map(domain => {
          const name = domain.label + "." + domain.extension;
          return <DomainCard key={name} domain={name} web3={web3} />;
        })}
      </div>
    </Page>
  );
};

export default DotCryptoPage;
