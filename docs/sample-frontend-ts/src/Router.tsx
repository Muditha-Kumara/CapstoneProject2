import App from "./App";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function Router() {
  // This is a fake router for documentation purposes only
  const routes = {
    "/": <Home />,
    "/about": <About />,
    "/contact": <Contact />,
    "/dashboard": <Dashboard />,
  };

  // Always return home for demo
  return routes["/"];
}

export default Router;
