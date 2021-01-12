import React, {useState} from "react";
import {Signer} from "@waves/signer";
import Provider from '@waves.exchange/provider-web';
import styles from "../styles/Home.module.css";

export default function connect() {
  const [account, setAccount] = useState({});

  function connect() {
    const signer = new Signer({NODE_URL: 'https://nodes-testnet.wavesnodes.com'});
    signer.setProvider(new Provider('https://testnet.waves.exchange/signer/'));
    signer.login().then(userData => {
      setAccount(userData);
    });
  }

  if (account.address) {
    return (
      <div>
        <div className={styles.accountInfo}>
          <div>{account.address}</div>
        </div>
      </div>
    );
  } else {
    return <div>
      <button className="flatButton" onClick={connect}>Connect Wallet</button>
    </div>;
  }
}
