
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Hospitals from "./pages/Hospitals";
import HospitalDetails from "./pages/HospitalDetails";
import CreateHospital from "./pages/CreateHospital";
import EditHospital from "./pages/EditHospital";
import QnA from "./pages/QnA";
import NotFound from "./pages/NotFound";
import { HospitalProvider } from "./context/HospitalContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <HospitalProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/hospital/:id" element={<HospitalDetails />} />
              <Route path="/qna" element={<QnA />} />
              <Route path="/create" element={
                <ProtectedRoute requireAdmin={true}>
                  <CreateHospital />
                </ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute requireAdmin={true}>
                  <EditHospital />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HospitalProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
