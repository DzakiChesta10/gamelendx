import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { SolanaWalletProvider } from "@/hooks/useSolanaWallet";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Catalog from "./pages/Catalog";
import Rentals from "./pages/Rentals";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SolanaWalletProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/" element={<Catalog />} />
                <Route path="/rentals" element={<Rentals />} />
                <Route path="/history" element={<Placeholder title="Rental History" />} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SolanaWalletProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
