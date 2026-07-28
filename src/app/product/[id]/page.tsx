import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

// Mock data (we will replace this with Supabase in a future step, but building the UI first)
const products = {
  '1': {
    name: 'NOCTURNAL LEATHER JACKET',
    price: '$1,200',
    description: 'A masterpiece of dark tailoring. Crafted from full-grain calfskin leather with oxidized slate hardware. The silhouette is deliberately oversized with dropped shoulders and elongated sleeves. Fully lined in silk twill.',
    details: ['100% Calfskin Leather', '100% Silk Lining', 'Oxidized Hardware', 'Made in Italy'],
    images: ['/images/lookbook_detail.png', '/images/lookbook_hero.png']
  }
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products[id as keyof typeof products] || products['1']; // fallback for demo

  return (
    <div className={styles.container}>
      <Link href="/#showroom" className={styles.backButton}>
        <ArrowLeft size={20} strokeWidth={1} />
        <span>BACK TO COLLECTION</span>
      </Link>

      <div className={styles.grid}>
        <div className={styles.gallery}>
          {product.images.map((img, idx) => (
            <div key={idx} className={styles.imageWrapper}>
              <Image 
                src={img} 
                alt={`${product.name} detail ${idx + 1}`} 
                fill
                className={styles.image}
              />
            </div>
          ))}
        </div>

        <div className={styles.info}>
          <div className={styles.stickyContent}>
            <div className={styles.header}>
              <h1 className={styles.title}>{product.name}</h1>
              <p className={styles.price}>{product.price}</p>
            </div>

            <p className={styles.description}>{product.description}</p>
            
            <ul className={styles.detailsList}>
              {product.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>

            <button className={styles.preOrderBtn}>
              PRE-ORDER NOW
            </button>
            <p className={styles.shippingInfo}>Ships strictly upon FW26 drop (approx 8-12 weeks).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
