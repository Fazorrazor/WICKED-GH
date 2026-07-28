import Image from 'next/image';
import Link from 'next/link';
import styles from './Showroom.module.css';

const products = [
  {
    id: 1,
    name: 'NOCTURNAL LEATHER JACKET',
    price: '$1,200',
    image: '/images/lookbook_detail.png',
    span: 'large',
  },
  {
    id: 2,
    name: 'CARBON TRENCH',
    price: '$850',
    image: '/images/lookbook_wide.png',
    span: 'wide',
  },
  {
    id: 3,
    name: 'BURGUNDY SILK SHIRT',
    price: '$450',
    image: '/images/lookbook_hero.png',
    span: 'normal',
  }
];

export default function Showroom() {
  return (
    <section id="showroom" className={styles.showroom}>
      <div className={styles.header}>
        <h2 className={styles.title}>FW26 COLLECTION</h2>
        <p className={styles.subtitle}>Available for Pre-order</p>
      </div>

      <div className={styles.bentoGrid}>
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className={`${styles.bentoItem} ${styles[product.span]}`}>
            <div className={styles.imageWrapper}>
              <Image 
                src={product.image} 
                alt={product.name}
                fill
                className={styles.image}
              />
              <div className={styles.overlay}>
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
