import { Link } from 'react-router-dom';

function Navigation() {
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
              <Link className="nav-link text-dark" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/calendar">カレンダー</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/receipt-registration">支出</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/receipt-income">収入</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/registration-history">登録履歴</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/income-history">収入履歴</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/graph">収支グラフ</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
