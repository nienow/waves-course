import styles from './layout.module.css'
import Link from "next/link";
import React from "react";
import Head from "next/head";

export default function Layout({ title, children }) {
  return <div>
    <Head>
      <title>{title || "Waves Coupon Market"}</title>
    </Head>
    <header className={styles.header}>
      <div className={styles.siteTitle}><Link href="/"><a>Waves Coupon Market</a></Link></div>
      <div className={styles.siteLinks}>
      <Link href="/supplier"><a>Supplier Admin</a></Link>
      </div>
    </header>
    <div className={styles.container}>{children}</div>
  </div>
}
