import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useState} from 'react';
import dynamic from 'next/dynamic'

const ConnectComponent = dynamic(() => import('../components/connect'), {
  ssr: false
})

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Test Waves</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Waves Test</h1>
        <ConnectComponent/>
      </main>
    </div>
  )
}
