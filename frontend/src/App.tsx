// Components
import Navbar from "./pages/Navbar/Navbar.tsx";
import Footer from "./pages/Footer/Footer.tsx";
import NotFound from "./pages/NotFound.tsx";

// Root Pages
import Home from "./pages/Home/Home.tsx";
import About from "./pages/About/About.tsx";
import Experience from "./pages/Experience/Experience.tsx";
import Contact from "./pages/Contact/Contact.tsx";

// AdminPortal Pages
import Login from "./pages/AdminPortal/Login/Login.tsx";
import Email from "./pages/AdminPortal/Email/Email.tsx";
import Message from "./pages/AdminPortal/Email/Message/Message.tsx";

// Auth + Routers
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { AuthProvider } from "./context/AuthProvider.tsx";
// import ProtectedRoute from "./context/ProtectedRoute.tsx";

const RootPage = () => (
  <>
    <Navbar />
    <Home />
    <About />
    <Experience />
    <Contact />
    <Footer />
  </>
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
