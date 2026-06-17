'use client';

import { useActionState } from 'react';
import { authenticate } from './actions';
import styles from './Login.module.css';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.button} aria-disabled={pending} type="submit" disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </button>
  );
}

export default function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <form action={dispatch}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="email">Email</label>
        <input 
          className={styles.input} 
          id="email" 
          type="email" 
          name="email" 
          placeholder="admin@cakeshop.com" 
          required 
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="password">Password</label>
        <input 
          className={styles.input} 
          id="password" 
          type="password" 
          name="password" 
          placeholder="Enter password" 
          required 
          minLength={6} 
        />
      </div>

      <SubmitButton />

      {errorMessage && (
        <p className={styles.error}>{errorMessage}</p>
      )}
    </form>
  );
}
