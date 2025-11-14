import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import ToolsPage from '@/pages/Tools'
import ToolDetailPage from '@/pages/ToolDetail'
import ArticlesPage from '@/pages/Articles'
import ArticleDetailPage from '@/pages/ArticleDetail'
import AiModelsPage from '@/pages/AiModels'
import AiModelDetailPage from '@/pages/AiModelDetail'
import LoginPage from '@/pages/Login'
import RegisterPage from '@/pages/Register'
import DashboardPage from '@/pages/Dashboard'
import AdminDashboard from '@/pages/AdminDashboard'
import { Button } from '@/components/ui/button'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            AI Tools Monitor
          </Link>
          <Link to="/tools" className="text-sm hover:underline">
            Tools
          </Link>
          <Link to="/articles" className="text-sm hover:underline">
            Articles
          </Link>
          <Link to="/ai-models" className="text-sm hover:underline">
            AI Models
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-sm hover:underline">
              Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="text-sm hover:underline">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.username}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">
          Discover the Best AI Tools for Developers
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your comprehensive platform for AI tools monitoring, comparison, and discovery.
          Stay updated with the latest innovations in artificial intelligence.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/tools">Browse Tools</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <h3 className="text-lg font-semibold mb-2">📊 Comprehensive Catalog</h3>
            <p className="text-sm text-muted-foreground">
              Explore hundreds of AI tools across categories: LLMs, Code Assistants,
              Image Generation, and more.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">⭐ Community Ratings</h3>
            <p className="text-sm text-muted-foreground">
              Read reviews and ratings from developers worldwide to make informed
              decisions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">🔍 Advanced Search</h3>
            <p className="text-sm text-muted-foreground">
              Find exactly what you need with powerful filters and search capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:slug" element={<ToolDetailPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="/ai-models" element={<AiModelsPage />} />
          <Route path="/ai-models/:id" element={<AiModelDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          © 2024 AI Tools Monitor. Built with ❤️ for the AI community.
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
