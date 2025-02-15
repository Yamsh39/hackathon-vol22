import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import ReceiptForm from './pages/ReceiptsForm';
import IncomeForm from './pages/IncomeForm';
import RegistrationHistory from './pages/RegistrationHistory';

function App() {
  return (
    <Router>
      <Navigation /> {/* ナビゲーションメニューを表示 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/receipt-registration" element={<ReceiptForm />} />
        <Route path="/receipt-income" element={<IncomeForm />} />
        <Route path="/registration-history" element={<RegistrationHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
