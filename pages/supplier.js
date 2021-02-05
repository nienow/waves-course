import styles from "../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import Layout from "../components/layout";
import TextField from "../components/text-field";
import AddItem from "../components/add-item";
import SignUp from "../components/sign-up";

export default function Supplier() {
  const [init, setInit] = useState(false);
  const [account, setAccount] = useState({});
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  useEffect(function() {
    if (!init) {
      setInit(true);
      if (WavesKeeper) {
        WavesKeeper.publicState().then(account => {
          fetch(`https://nodes-testnet.wavesnodes.com/addresses/data/3N5YKzuN38Sxzv4hT44rBHT1vV8SkFwAPr5/supplier:` + account.account.address)
            .then(response => response.json())
            .then(data => {
              setName(data.value);
            }, error => {
              console.log(error);
            });
          setAccount(account.account);
        }).catch(error => {
          setError('Failed to connect');
        });
      } else {
        setError('waves keeper not found');
      }
    }
  });

  function onSignUp() {
    setInit(false);
  }

  function renderContent() {
    if (name) {
      return <div>
        <h3>Signed in as {name}</h3>
        <h1>Add Item</h1>
        <AddItem></AddItem>
      </div>
    } else {
      return <SignUp onSignUp={onSignUp}></SignUp>
    }
  }

  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>Supplier Admin</h1>
        {renderContent()}
      </main>
    </Layout>
  )
}
