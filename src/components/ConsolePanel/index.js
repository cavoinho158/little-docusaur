import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * ConsolePanel — terminal-style panel with header bar.
 * @param {object} props
 * @param {React.ReactNode} props.icon   — Lucide icon element (18px, stroke 1.5)
 * @param {string}          props.title  — label shown in header bar
 * @param {React.ReactNode} props.children
 * @param {string}         [props.className]
 */
export default function ConsolePanel({ icon, title, children, className }) {
  return (
    <div className={clsx(styles.panel, className)}>
      <div className={styles.header}>
        <span className={styles.dot} />
        {icon && <span className={styles.headerIcon}>{icon}</span>}
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
