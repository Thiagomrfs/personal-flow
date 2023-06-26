import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from 'react-redux';
import store from './app/store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './app/store'

import "primereact/resources/themes/lara-light-indigo/theme.css";            
import "primereact/resources/primereact.min.css";                      
import 'primeicons/primeicons.css';        
import 'primeflex/primeflex.css'; 

import { router } from './routes';
import { ConfirmDialog } from 'primereact/confirmdialog';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfirmDialog />
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} fallbackElement={<>Carregando...</>} />
        </QueryClientProvider>
      </Provider>
    </PersistGate>
    <script src="https://unpkg.com/primereact/core/core.min.js"></script>
  </React.StrictMode>,
)
