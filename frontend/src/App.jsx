import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation'; // ナビゲーションをインポート
import Home from './pages/Home'; // ホームページをインポート
import About from './pages/About'; // Aboutページをインポート
import ReceiptForm from './pages/ReceiptsForm';

function App() {
  return (
    <Router>
      <Navigation /> {/* ナビゲーションメニューを表示 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/receipt-registration" element={<ReceiptForm />} />
      </Routes>
    </Router>
  );
}

export default App;
