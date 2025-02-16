import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import ReceiptForm from './pages/ReceiptsForm';
import IncomeForm from './pages/IncomeForm';
import RegistrationHistory from './pages/RegistrationHistory'
import IncomeHistory from './pages/IncomeHistory';
import Graph from './pages/GraphPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation /> {/* ナビゲーションメニューを表示 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/receipt-registration" element={<ReceiptForm />} />
        <Route path="/receipt-income" element={<IncomeForm />} />
        <Route path="/registration-history" element={<RegistrationHistory />} />
        <Route path="/income-history" element={<IncomeHistory />} />
        <Route path="/graph" element={<Graph />} />
      </Routes>
    </Router>
  );
}

export default App;
