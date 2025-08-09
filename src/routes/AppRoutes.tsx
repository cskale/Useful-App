import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ResourcesPage from "@/pages/Resources";
import App from "@/App";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/resources", element: <ResourcesPage /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
