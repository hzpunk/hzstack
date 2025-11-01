import React from 'react';
import styles from './Icon.module.scss';

export const Icon = () => {
  return (
    <div className={styles.case}>
     
        <div className={styles.left}>
            <div className={styles.up}></div>
            <div className={styles.up}></div>
        </div>
        <div className={styles.right}>
            <div className={styles.down}></div>
            <div className={styles.down}></div>
        </div>
    </div>
  );
};
