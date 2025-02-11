import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import ReceiptForm from './ReceiptsForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReceiptForm />
  </StrictMode>,
)
