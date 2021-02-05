import homeStyles from "../styles/Home.module.css";
import styles from "../styles/List.module.css";
import React, {useEffect, useState} from "react";
import Layout from "./layout";

export default function List() {
  const [coupons, setCoupons] = useState(null);

  useEffect(function() {
    if (!coupons) {
      fetch(`https://nodes-testnet.wavesnodes.com/addresses/data/3N5YKzuN38Sxzv4hT44rBHT1vV8SkFwAPr5`)
        .then(response => response.json())
        .then(data => {
          const couponData = data.filter(item => item.key.startsWith('item_data:')).map(item => {
            const value = JSON.parse(item.value);
            value.id = item.key.substring(10);
            return value;
          });
          setCoupons(couponData);
        });
    }
  });

  function renderItem(item) {
    return (
      <div className={styles.coupon} key={item.id}>
        <div className={styles.couponInfo}>
          <div className={styles.couponTitle}>{item.title}</div>
          <div>{item.desc}</div>
        </div>
        <div className={styles.couponPrice}>{item.price} waves</div>
        <div className={styles.couponAction}><button className="textButton">Buy</button></div>
      </div>
    )
  }

  return (
    <Layout>
      <main className={homeStyles.main}>
        <div className={homeStyles.title}>List of Coupons</div>
        <div>{coupons?.map(item => renderItem(item))}</div>
      </main>
    </Layout>
  )
}
