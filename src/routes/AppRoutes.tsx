import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ResourcesPage from "@/pages/Resources";
import ChartsDemo from "@/pages/ChartsDemo";
import App from "@/App";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/resources", element: <ResourcesPage /> },
  { path: "/charts", element: <ChartsDemo /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
