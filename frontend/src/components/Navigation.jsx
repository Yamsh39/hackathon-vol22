import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Navigation.module.css';

function Navigation() {
  const location = useLocation();  // 現在のURLパスを取得

  // 現在のページがアクティブなリンクかどうかを判断する関数
  const isActive = (path) => location.pathname === path ? styles.active : '';

  return (
    <nav className={`navbar navbar-expand-md ${styles.customNavbar} border-bottom shadow-sm fixed-top`}>
      <div className="container">
        {/* ブランド名 */}
        <Link className={`navbar-brand fw-bold ${styles.navbarBrand} ${styles.navbarBrandHover}`} to="/">Smart Stack</Link>

        {/* ハンバーガーメニュー（モバイル用） */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ナビゲーションメニュー */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink} ${styles.navLinkHover} ${isActive('/')}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink} ${styles.navLinkHover} ${isActive('/calendar')}`} to="/calendar">カレンダー</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink} ${styles.navLinkHover} ${isActive('/receipt-registration')}`} to="/receipt-registration">支出</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink} ${styles.navLinkHover} ${isActive('/receipt-income')}`} to="/receipt-income">収入</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink} ${styles.navLinkHover} ${isActive('/registration-history')}`} to="/registration-history">登録履歴</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink} ${styles.navLinkHover} ${isActive('/income-history')}`} to="/income-history">収入履歴</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink} ${styles.navLinkHover} ${isActive('/graph')}`} to="/graph">収支グラフ</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
