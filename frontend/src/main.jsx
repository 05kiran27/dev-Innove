import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { FollowProvider } from './context/FollowContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <FollowProvider>
          <SocketContextProvider>
            <App/>
          </SocketContextProvider>
        </FollowProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
