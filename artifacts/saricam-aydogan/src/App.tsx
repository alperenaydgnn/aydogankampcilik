import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { ScrollToTop, RouteProgress } from "@/components/RouteFx";
import { SkipLink } from "@/components/SkipLink";
import { pageVariants } from "@/lib/motion";

import Home from "@/pages/Home";
const Catalog = lazy(() => import("@/pages/Catalog"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Shipping = lazy(() => import("@/pages/Shipping"));
const StorePolicy = lazy(() => import("@/pages/StorePolicy"));
const CategoryInfo = lazy(() => import("@/pages/CategoryInfo"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Compare = lazy(() => import("@/pages/Compare"));
const Favorites = lazy(() => import("@/pages/Favorites"));

import { AdminAuthProvider, useAdminAuth } from "@/admin/context/AdminAuthContext";
import { SiteSettingsProvider } from "@/lib/SiteSettingsContext";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { CompareProvider } from "@/lib/compare";
import { I18nProvider } from "@/lib/i18n";
import { BrandLoader } from "@/components/BrandLoader";
import { CompareBar } from "@/components/CompareBar";
import { CartDrawer } from "@/components/CartDrawer";
import { CartToast } from "@/components/CartToast";
import { CheckoutWizard } from "@/components/CheckoutWizard";
import { CallbackFab } from "@/components/CallbackFab";
import { ExitIntentModal } from "@/components/ExitIntentModal";

const AdminLayout = lazy(() => import("@/admin/components/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import("@/admin/pages/AdminLogin"));
const AdminProducts = lazy(() => import("@/admin/pages/AdminProducts"));
const AdminProductForm = lazy(() => import("@/admin/pages/AdminProductForm"));
const AdminCategories = lazy(() => import("@/admin/pages/AdminCategories"));
const AdminSiteSettings = lazy(() => import("@/admin/pages/AdminSiteSettings"));

const queryClient = new QueryClient();

function RouteSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <BrandLoader size={72} />
    </div>
  );
}

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth();
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
      <Suspense fallback={<RouteSpinner />}>
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
          <Route path="/admin/anasayfa">
            <PrivateRoute><AdminSiteSettings /></PrivateRoute>
          </Route>
          <Route path="/admin">
            <Redirect to="/admin/urunler" />
          </Route>
          <Route>
            <Redirect to="/admin/urunler" />
          </Route>
        </Switch>
      </Suspense>
    </AdminAuthProvider>
  );
}

function AnimatedRoutes() {
  const [location] = useLocation();
  const reduce = useReducedMotion();

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
        <Suspense fallback={<RouteSpinner />}>
          <Switch location={location}>
            <Route path="/" component={Home} />
            <Route path="/urunler" component={Catalog} />
            <Route path="/urunler/:kategori" component={Catalog} />
            <Route path="/urun/:slug" component={ProductDetail} />
            <Route path="/karsilastir" component={Compare} />
            <Route path="/favoriler" component={Favorites} />
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
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function StoreFront() {
  return (
    <div className="flex flex-col min-h-screen">
      <SkipLink />
      <ScrollToTop />
      <RouteProgress />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-grow">
        <AnimatedRoutes />
      </main>
      <Footer />
      <WhatsAppFab />
      <CallbackFab />
      <CartDrawer />
      <CheckoutWizard />
      <CartToast />
      <ExitIntentModal />
      <CompareBar />
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
          <I18nProvider>
            <SiteSettingsProvider>
              <CartProvider>
                <WishlistProvider>
                  <CompareProvider>
                    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                      <Router />
                    </WouterRouter>
                  </CompareProvider>
                </WishlistProvider>
              </CartProvider>
            </SiteSettingsProvider>
          </I18nProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
