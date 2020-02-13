import React, { useEffect, useState } from "react";
import { PluginPageContext, Asset } from "@burner-wallet/types";
import DomainCard from "./DomainCard";
import DotCryptoPlugin from "../DotCryptoPlugin";

const UD_BASE_API_URL = "https://unstoppabledomains.com";

const DotCryptoPage: React.FC<PluginPageContext> = ({
  BurnerComponents,
  defaultAccount,
  plugin
}) => {
  const { Page } = BurnerComponents;
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState(
    [] as Array<{ label: string; extension: string }>
  );
  const [web3, setWeb3] = useState(null as any);

  useEffect(() => {
    const _web3 = (plugin as DotCryptoPlugin).getWeb3Network("1");
    if (!_web3) {
      setLoading(false);
      return;
    }
    setWeb3(_web3);
    fetch(`${UD_BASE_API_URL}/api/zns-domains/${defaultAccount}`)
      .then(resp => resp.json())
      .then(
        ({ domains }: { domains: { label: string; extension: string }[] }) => {
          const _domains = domains.filter(
            domain => domain.extension === "crypto"
          );
          setLoading(false);
          setDomains(_domains);
        }
      );
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
      {!loading && !web3 && (
        <div
          style={{
            height: "20em",
            justifyContent: "center",
            display: "flex",
            alignItems: "center"
          }}
        >
          Please connect to the mainnet to view/transfer your .crypto domains
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        {domains.map(domain => {
          const name = domain.label + "." + domain.extension;
          return (
            <DomainCard
              key={name}
              domain={name}
              web3={web3}
              defaultAccount={defaultAccount}
            />
          );
        })}
      </div>
    </Page>
  );
};

export default DotCryptoPage;
