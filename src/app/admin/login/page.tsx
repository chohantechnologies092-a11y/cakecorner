import LoginForm from './LoginForm';
import styles from './Login.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | Cake Shop',
  description: 'Login to the Cake Shop admin dashboard.',
};

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Admin Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
