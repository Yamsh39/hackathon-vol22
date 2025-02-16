import { Link, useLocation } from 'react-router-dom';
import './Navigation.css'; // 新しいCSSファイルをインポート

function Navigation() {
  const location = useLocation();
  const getLinkClass = (path) => location.pathname === path ? 'nav-link text-dark border-bottom-thick' : 'nav-link text-dark';

  return (
    <nav className="navbar navbar-expand-md bg-white border-bottom shadow-sm fixed-top">
      <div className="container">
        {/* ブランド名 */}
        <Link className="navbar-brand fw-bold text-dark" to="/">家計管理</Link>
        
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
              <Link className={getLinkClass("/")} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/calendar")} to="/calendar">カレンダー</Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/receipt-registration")} to="/receipt-registration">支出</Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/receipt-income")} to="/receipt-income">収入</Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/registration-history")} to="/registration-history">登録履歴</Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/income-history")} to="/income-history">収入履歴</Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/graph")} to="/graph">収支グラフ</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
