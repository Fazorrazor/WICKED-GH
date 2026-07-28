import { X } from 'lucide-react';
import styles from './Cart.module.css';

export default function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}
      <div className={`${styles.cart} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>YOUR BAG</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} strokeWidth={1} />
          </button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.emptyMessage}>Your bag is currently empty.</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.total}>
            <span>SUBTOTAL</span>
            <span>$0.00</span>
          </div>
          <button className={styles.checkoutBtn} disabled>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </>
  );
}
