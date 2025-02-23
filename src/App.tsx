import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Routes from './Routes'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes />
      </div>
    </BrowserRouter>
  )
}

export default App
