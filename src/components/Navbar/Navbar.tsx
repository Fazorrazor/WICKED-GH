"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';
import styles from './Navbar.module.css';
import Cart from '../Cart/Cart';

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.iconButton} aria-label="Menu">
          <Menu size={20} strokeWidth={1.5} />
          <span className={styles.navText}>MENU</span>
        </button>
      </div>
      
      <div className={styles.center}>
        <Link href="/" className={styles.logo}>
          WICKED GH
        </Link>
      </div>

      <div className={styles.right}>
        <button className={styles.iconButton} aria-label="Cart" onClick={() => setIsCartOpen(true)}>
          <span className={styles.navText}>CART (0)</span>
          <ShoppingBag size={20} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
