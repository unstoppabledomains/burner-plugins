import React, { useEffect, useState } from "react";
import UnstoppableResolution from "@unstoppabledomains/resolution";
import DotCryptoRegistryABI from "../DotCryptoRegistryABI.json";

const DotCryptoRegistryAddress = "0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe";

interface Props {
  domain: string;
  web3: any;
}

const BASE_API_URL = "https://metadata.unstoppabledomains.com/image";

const getTokenId = (domain: string) =>
  new UnstoppableResolution().namehash(domain);

const DomainCard = ({ domain, web3 }: Props) => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    fetch(`${BASE_API_URL}/${domain}`)
      .then(resp => resp.json())
      .then(({ image_data }) => {
        setImage(new Buffer(image_data).toString("base64"));
        setLoading(false);
      });
  }, []);

  const handleTransfer = () => {
    const recipientAddress = window.prompt("Enter recipient address", "");
    if (!recipientAddress) {
      return;
    }
    const dotCryptoRegistry = new web3.eth.Contract(
      DotCryptoRegistryABI,
      DotCryptoRegistryAddress,
      { from: web3.givenProvider.selectedAddress }
    );

    dotCryptoRegistry.methods
      .transferFrom(
        web3.givenProvider.selectedAddress,
        recipientAddress,
        getTokenId(domain)
      )
      .send()
      .then(() => setTransferring(true));
  };

  const handleImgClick = () => {};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "1em",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          height: "200px",
          marginBottom: "1em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {loading || transferring ? (
          transferring ? (
            "Transferring.."
          ) : (
            "Loading..."
          )
        ) : (
          <a
            href={`https://opensea.io/assets/${DotCryptoRegistryAddress}/${BigInt(
              getTokenId(domain)
            ).toString(10)}`}
            target="_blank"
            style={{ height: "100%" }}
          >
            <img
              style={{ height: "100%" }}
              onClick={handleImgClick}
              src={`data:image/svg+xml;base64,${image}`}
            />
          </a>
        )}
      </div>
      <div style={{ textAlign: "center" }}>{domain}</div>
      {!loading && !transferring && (
        <button style={{ marginTop: "1em" }} onClick={handleTransfer}>
          Transfer
        </button>
      )}
    </div>
  );
};

export default DomainCard;
