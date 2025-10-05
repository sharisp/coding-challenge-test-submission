import styles from "./ErrorMsg.module.css";

export default function ErrorMessage({ message }: { message: string|undefined }) {
  return message ? <div className={styles.error}>{message}</div> : null;
}
