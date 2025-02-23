import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Routes from './Routes'
import { PayrollProvider } from '@/contexts/PayrollContext'

function App() {
  return (
    <BrowserRouter>
      <PayrollProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes />
        </div>
      </PayrollProvider>
    </BrowserRouter>
  )
}

export default App
