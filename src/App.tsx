
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/Overview";
import Containers from "./pages/Containers";
import ContainerDetail from "./pages/ContainerDetail";
import Images from "./pages/Images";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="containers" element={<Containers />} />
          <Route path="containers/:id" element={<ContainerDetail />} />
          <Route path="images" element={<Images />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
