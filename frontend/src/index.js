import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/contexts/AuthContext';
import { ProfileProvider } from './components/contexts/ProfileContext';
import { ToastProvider } from './components/contexts/ToastContext';
import { CartProvider } from './components/contexts/CartContext';
import { ModalProvider } from './components/contexts/ModalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <ToastProvider>
            <CartProvider>
              <ModalProvider>
                <App />
              </ModalProvider>
            </CartProvider>
          </ToastProvider>
        </ProfileProvider>s
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
