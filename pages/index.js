import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useState} from 'react';

export default function Home() {
  const [textValue, setTextValue] = useState('Test Data');
  const [signature, setSignature] = useState('');
  const [account, setAccount] = useState({});

  function connect() {
    if (WavesKeeper) {
      WavesKeeper.publicState().then(account => {
        console.log(account);
        setAccount(account.account)
      }).catch(error => {
        alert('failed to connect to wallet');
      });
    } else {
      alert('waves keeper not found');
    }
  }

  function sign() {
    WavesKeeper.auth({data: textValue}).then(auth => {
      setSignature(auth.signature);
    }).catch(error => {
      alert('failed to sign');
    });
  }

  function changeInput(event) {
    setTextValue(event.target.value);
  }

  function renderContent() {
    if (account.address) {
      return (
        <div>
          <div className={styles.accountInfo}>
            <div>{account.address}</div>
            <div>{account.balance.available / 100000000} waves</div>
            <div>{account.network} network</div>
          </div>
          <input type="text" value={textValue} onChange={changeInput}/>
          <button className={styles.signButton} onClick={sign}>Sign Data</button>
          <div className={styles.signatureOutput}>{signature}</div>
        </div>
      );
    } else {
      return <div>
        <button className="flatButton" onClick={connect}>Connect Wallet</button>
      </div>;
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Test Waves</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Waves Test</h1>
        {renderContent()}
      </main>
    </div>
  )
}
