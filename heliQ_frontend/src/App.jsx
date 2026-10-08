import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Panels from "@/pages/Panels";
import Predictions from "@/pages/Predictions";
import Faults from "@/pages/Faults";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="panels" element={<Panels />} />
        <Route path="predictions" element={<Predictions />} />
        <Route path="faults" element={<Faults />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
