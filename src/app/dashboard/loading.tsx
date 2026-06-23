import styles from "./layout.module.css";

export default function DashboardLoading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Loading data...</p>
      <style key="loading-styles">{`
        .${styles.loadingContainer} {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 60vh;
          width: 100%;
          color: #64748b;
        }
        .${styles.spinner} {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(16, 185, 129, 0.2);
          border-radius: 50%;
          border-top-color: #10b981;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
