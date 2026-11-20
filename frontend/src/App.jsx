import { BrowserRouter, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GooeyToaster } from 'goey-toast'
import 'goey-toast/styles.css'
import { AuthProvider } from './store/AuthContext'
import { AppRoutes } from './routes/AppRoutes'
import { ErrorBoundary } from './components/ErrorBoundary'

function RouteErrorBoundary({ children }) {
  const location = useLocation()
  return (
    <ErrorBoundary key={location.pathname} resetKey={location.pathname}>
      {children}
    </ErrorBoundary>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <RouteErrorBoundary>
            <AppRoutes />
          </RouteErrorBoundary>
        </BrowserRouter>
        <GooeyToaster
          position="bottom-right"
          duration={3500}
          richColors
          closeButton
          preset="bouncy"
          showProgress
          visibleToasts={5}
          gap={10}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
