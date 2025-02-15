import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-expand-md bg-white border-bottom shadow-sm fixed-top">
      <div className="container">
        {/* ブランド名 */}
        <Link className="navbar-brand fw-bold text-dark" to="/">家計管理</Link>
        <div className="navbar-nav ms-auto">
          <ul className="navbar-nav d-flex">
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
              <Link className="nav-link text-dark" to="/registration-history">登録履歴</Link> |
        <Link to="/graph"> 収支グラフ </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
