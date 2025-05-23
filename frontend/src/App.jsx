import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import Dashboard from './pages/Dashboard';
import InvoiceDetail from './pages/InvoiceDetail';
import { queryClient } from './utils/http';
import { QueryClientProvider } from '@tanstack/react-query';
import InvoiceForm from './components/forms/InvoiceForm';
import EditInvoiceForm, { Loader as EditInvoiceLoader, Action as EditInvoiceAction } from './components/forms/EditInvoiceForm';

// Layout component that renders the dashboard and any modal routes
const DashboardLayout = () => {
  return (
    <div className="relative">
      <Dashboard />
      <Outlet /> {/* This will render the modal routes */}
    </div>
  )
}

const InvoiceDetailLayout = () => {
  return (
    <div className="relative">
      <InvoiceDetail />
      <Outlet /> {/* This will render the modal routes */}
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: null,
          },
          {
            path: 'status/:status',
            element: null,
          },
          { 
            path: 'invoice/new',
            element: <InvoiceForm isOpen={true} onClose={() => window.history.back()} />
          },
        ]
      },
      { 
        path: 'invoice-detail/:id',
        element: <InvoiceDetailLayout />,
        children: [
          { 
            index: true,
            element: null
          },
          { 
            path: 'edit',
            element: <EditInvoiceForm isOpen={true} onClose={() => window.history.back()} />,
            loader: EditInvoiceLoader,
            action: EditInvoiceAction
          }
        ]
      },
    ]
  },  
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App