import styles from './Header.module.css';

export default function Header() {
  const name = process.env.DATAROOM_NAME || 'Kyozo Dataroom';
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.badge}>
          <span className={styles.badgeDot} />
          Confidential
        </span>
        <span className={styles.divider}>•</span>
        <span className={styles.title}>{name}</span>
      </div>
      <div className={styles.right}>
        <a href="/admin/login" className={styles.adminLink}>Admin</a>
      </div>
    </header>
  );
}
