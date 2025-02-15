import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import ReceiptForm from './pages/ReceiptsForm';
import IncomeForm from './pages/IncomeForm';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation /> {/* ナビゲーションメニューを表示 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/receipt-registration" element={<ReceiptForm />} />
        <Route path="/receipt-income" element={<IncomeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
