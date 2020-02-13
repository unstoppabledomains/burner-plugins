import React, { useEffect, useState } from "react";
import UnstoppableResolution from "@unstoppabledomains/resolution";
import DotCryptoRegistryABI from "../DotCryptoRegistryABI.json";

const DotCryptoRegistryAddress = "0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe";

interface Props {
  domain: string;
  defaultAccount: string;
  web3: any;
}

const BASE_API_URL = "https://metadata.unstoppabledomains.com/image";

const getTokenId = (domain: string) =>
  new UnstoppableResolution().namehash(domain);

const DomainCard = ({ domain, web3, defaultAccount }: Props) => {
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

  const handleTransfer = async () => {
    const recipientAddress = window.prompt("Enter recipient address", "");
    if (!recipientAddress) {
      return;
    }
    const dotCryptoRegistry = new web3.eth.Contract(
      DotCryptoRegistryABI,
      DotCryptoRegistryAddress,
      { from: defaultAccount }
    );

    try {
      await dotCryptoRegistry.methods
        .transferFrom(defaultAccount, recipientAddress, getTokenId(domain))
        .send({ gasPrice: "8000000000" }, () => {
          setTransferring(true);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleImgClick = () => {
    window.open(
      `https://opensea.io/assets/${DotCryptoRegistryAddress}/${BigInt(
        getTokenId(domain)
      ).toString(10)}`,
      "_blank"
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "200px",
        padding: "1em"
      }}
    >
      <div
        style={{
          marginBottom: "1em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "167px"
        }}
      >
        {loading || transferring ? (
          transferring ? (
            "Transferring..."
          ) : (
            "Loading..."
          )
        ) : (
          <img
            style={{ width: "100%", height: "100%" }}
            onClick={handleImgClick}
            src={`data:image/svg+xml;base64,${image}`}
          />
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
