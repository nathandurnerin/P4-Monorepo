// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

// Import the main app component
import App from "./App";
import Home from "./pages/Home";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Category from "./pages/Category";
import Voyages from "./pages/Voyages";
import Link from "./pages/Link";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Architecture from "./pages/Architecture";
import StreetArt from "./pages/StreetArt";
import Portrait from "./pages/Portrait";
import Paysage from "./pages/Paysage";
import NoirBlanc from "./pages/NoirBlanc";
import SceneVie from "./pages/SceneVie";
import Account from "./pages/Account";
import Page404 from "./pages/Page404";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/a-propos",
        element: <About />,
      },

      {
        path: "/Compte",
        element: (
            <Account />
        ),
      },
      {
        path: "/admin",
        element: (
            <Admin />
        ),
      },
      {
        path: "/Categories",
        element: <Category />,
      },
      {
        path: "/Carnet-de-Voyages",
        element: <Voyages />,
      },
      {
        path: "/Liens",
        element: <Link />,
      },
      {
        path: "/Contact",
        element: <Contact />,
      },
      {
        path: "/Panier",
        element: <Shop />,
      },
      {
        path: "/Architecture",
        element: <Architecture />
      },
      {
        path: "/Street-Art",
        element: <StreetArt />,
      },
      {
        path: "/Portrait",
        element: <Portrait />
      },
      {
        path: "/Paysages",
        element: <Paysage />,
      },
      {
        path: "Noir-&-Blanc",
        element: <NoirBlanc />,
      },
      {
        path: "Scène-de-vie",
        element: <SceneVie />,
      },
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
]);

/* ************************************************************************* */

// Find the root element in the HTML document
const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

// Render the app inside the root element
createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
