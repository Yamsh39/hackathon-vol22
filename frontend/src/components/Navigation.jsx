// App.js の中でリンクを追加
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
        <Link to="/"> Home </Link> |
        <Link to="/about"> About </Link> | 
        <Link to="/receipt-registration"> 支出 </Link> |
        <Link to="/receipt-income"> 収入 </Link> |
        <Link to="/registration-history"> 登録履歴 </Link> | 
        <Link to="/submit-paypay"> PayPay取引履歴アップロード </Link>
    </nav>
  );
}

export default Navigation;