import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminShell } from './components/AdminShell';
import { AppShell } from './components/AppShell';
import { AdminRoute, GuestRoute, ProtectedRoute } from './components/RouteGuards';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { HomePage } from './pages/HomePage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ForbiddenPage, NotFoundPage } from './pages/StatusPages';
import { UploadPage } from './pages/UploadPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminDocumentsPage } from './pages/admin/AdminDocumentsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="/forbidden" element={<ForbiddenPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/documents/:id" element={<DocumentDetailPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/saved" element={<LibraryPage mode="saved" />} />
                <Route path="/my-documents" element={<LibraryPage mode="mine" />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminShell />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="documents" element={<AdminDocumentsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
