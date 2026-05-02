import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { ScrollToTop, RouteProgress } from "@/components/RouteFx";
import { pageVariants } from "@/lib/motion";

import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Privacy from "@/pages/Privacy";
import Shipping from "@/pages/Shipping";
import StorePolicy from "@/pages/StorePolicy";
import CategoryInfo from "@/pages/CategoryInfo";
import NotFound from "@/pages/not-found";

import { AdminAuthProvider, useAdminAuth } from "@/admin/context/AdminAuthContext";
import { SiteSettingsProvider } from "@/lib/SiteSettingsContext";
import { AdminLayout } from "@/admin/components/AdminLayout";
import AdminLogin from "@/admin/pages/AdminLogin";
import AdminProducts from "@/admin/pages/AdminProducts";
import AdminProductForm from "@/admin/pages/AdminProductForm";
import AdminCategories from "@/admin/pages/AdminCategories";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth();
  // While Supabase is restoring the session, don't bounce a valid admin to login.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/admin/login" />;
  return <AdminLayout>{children}</AdminLayout>;
}

function AdminRouter() {
  return (
    <AdminAuthProvider>
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/urunler/yeni">
          <PrivateRoute><AdminProductForm /></PrivateRoute>
        </Route>
        <Route path="/admin/urunler/:id/duzenle">
          <PrivateRoute><AdminProductForm /></PrivateRoute>
        </Route>
        <Route path="/admin/urunler">
          <PrivateRoute><AdminProducts /></PrivateRoute>
        </Route>
        <Route path="/admin/kategoriler">
          <PrivateRoute><AdminCategories /></PrivateRoute>
        </Route>
        <Route path="/admin">
          <Redirect to="/admin/urunler" />
        </Route>
        <Route>
          <Redirect to="/admin/urunler" />
        </Route>
      </Switch>
    </AdminAuthProvider>
  );
}

function AnimatedRoutes() {
  const [location] = useLocation();
  const reduce = useReducedMotion();

  // Use just the pathname (strip query/hash + trailing slashes) as the
  // AnimatePresence key so within-page hash/query updates don't remount.
  const routeKey =
    location.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        variants={reduce
          ? { initial: { opacity: 0 }, enter: { opacity: 1, transition: { duration: 0.12 } }, exit: { opacity: 0, transition: { duration: 0.08 } } }
          : pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="will-change-[opacity,transform]"
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/urunler" component={Catalog} />
          <Route path="/urunler/:kategori" component={Catalog} />
          <Route path="/urun/:slug" component={ProductDetail} />
          <Route path="/kategori/:slug" component={CategoryInfo} />
          <Route path="/hakkimizda" component={About} />
          <Route path="/iletisim" component={Contact} />
          <Route path="/sss" component={FAQ} />
          <Route path="/kvkk" component={Privacy} />
          <Route path="/gizlilik" component={Privacy} />
          <Route path="/teslimat" component={Shipping} />
          <Route path="/magaza-politikasi" component={StorePolicy} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function StoreFront() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <RouteProgress />
      <Header />
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  return isAdmin ? <AdminRouter /> : <StoreFront />;
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SiteSettingsProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </SiteSettingsProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
