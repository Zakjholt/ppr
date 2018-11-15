import styles from './styles.scss';
import Header from '../Header';

export default ({children}) => (
  <div className={styles.container}>
    <Header />
    {children}
  </div>
);
