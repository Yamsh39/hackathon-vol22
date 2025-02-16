import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'; // useState と useEffect をインポート
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import styles from '../styles/Navigation.module.css';

function Navigation() {
  const location = useLocation();
  const [date, setDate] = useState(new Date());
  const [expense, setExpense] = useState({});
  const [monthlySummary, setMonthlySummary] = useState({ incomeTotal: 0, expenseTotal: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態

  // isActive関数を追加
  const isActive = (path) => location.pathname === path ? styles.active : '';

  // 日付フォーマット関数（YYYY-MM-DD）
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // カレンダーの日付変更時の処理
  const onChange = (newDate) => {
    setDate(new Date(newDate));
  };

  // 日ごとの支出データ取得
  const fetchDailyExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/db/daily-summary');
      const dailyData = response.data;
      const expenseData = {};

      dailyData.forEach((data) => {
        const transactionDate = data.day; // YYYY-MM-DD
        if (!expenseData[transactionDate]) expenseData[transactionDate] = 0;
        expenseData[transactionDate] += data.total_expense;
      });

      setExpense(expenseData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // 月ごとの収支データ取得
  const fetchMonthlySummary = async () => {
    try {
      const response = await axios.get('http://localhost:5000/db/monthly-summary');
      const monthlyData = response.data;
      const currentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const summary = monthlyData.find((m) => m.month === currentMonth);

      if (summary) {
        setMonthlySummary({
          incomeTotal: summary.total_income,
          expenseTotal: summary.total_expense,
        });
      } else {
        setMonthlySummary({ incomeTotal: 0, expenseTotal: 0 });
      }
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    }
  };

  useEffect(() => {
    fetchDailyExpenses();
    fetchMonthlySummary();
  }, [date]);

  // 支出がある日を赤くする
  const highlightExpenseDays = ({ date }) => {
    const eventDate = formatDate(date);
    return expense[eventDate] > 0 ? styles.expenseDay : '';
  };

  // 選択した日付の支出を表示
  const renderTransactions = (selectedDate) => {
    const eventDate = formatDate(selectedDate);
    const totalExpense = expense[eventDate] || 0;

    return (
      <div>
        <h3>支出: ¥{totalExpense}</h3>
      </div>
    );
  };

  // モーダルを開閉する関数
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // モーダルの背景をクリックしたときにモーダルを閉じる関数
  const handleModalBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

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

        {/* モーダルを開くボタン */}
        <button className={styles.openModalBtn} onClick={toggleModal}>
          収支カレンダー
        </button>
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <div className={styles.modal} onClick={handleModalBackgroundClick}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeBtn} onClick={toggleModal}>×</span>
            <h2>📅 収支カレンダー</h2>

            <ReactCalendar 
              onChange={onChange} 
              value={date} 
              tileClassName={highlightExpenseDays} 
            />

            <div className="event-details">
              <h3>{formatDate(date)} の支出</h3>
              {renderTransactions(date)}
            </div>

            <div className="monthly-summary">
              <h3>{date.getFullYear()}年 {date.getMonth() + 1}月の収支</h3>
              <p>収入合計: ¥{monthlySummary.incomeTotal}</p>
              <p>支出合計: ¥{monthlySummary.expenseTotal}</p>
              <p>差額: ¥{monthlySummary.incomeTotal - monthlySummary.expenseTotal}</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
