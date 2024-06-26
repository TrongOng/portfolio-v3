import "./App.css";
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

// Reset Password Pages
import ForgotPassword from "./pages/AdminPortal/Reset/ForgotPassword.tsx";
import ResetPassword from "./pages/AdminPortal/Reset/ResetPassword.tsx";

// Auth + Routers
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.tsx";
import ProtectedRoute from "./context/ProtectedRoute.tsx";

const RootPage = () => (
  <>
    <Home />
    <About />
    <Experience />
    <Contact />
  </>
);
function NavFooterWrapper() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <NavFooterWrapper />,
    children: [
      {
        path: "",
        element: <RootPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <NavFooterWrapper />,
    children: [
      {
        path: "",
        element: <Login />,
      },
    ],
  },
  {
    path: "/forgot-password",
    element: <NavFooterWrapper />,
    children: [
      {
        path: "",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/reset-password",
    element: <NavFooterWrapper />,
    children: [
      {
        path: "",
        element: <ResetPassword />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/email",
        element: <NavFooterWrapper />,
        children: [
          {
            path: "",
            element: <Email />,
          },
          {
            path: "message/:id",
            element: <Message />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NavFooterWrapper />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </>
  );
}

export default App;
