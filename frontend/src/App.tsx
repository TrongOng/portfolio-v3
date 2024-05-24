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
import { AuthProvider } from "./context/AuthProvider.tsx";
import ProtectedRoute from "./context/ProtectedRoute.tsx";

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
const LoginPage = () => (
  <>
    <Navbar />
    <Login />
    <Footer />
  </>
);
const EmailPage = () => (
  <>
    <Navbar />
    <Email />
    <Footer />
  </>
);
const MessagePage = () => (
  <>
    <Navbar />
    <Message />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/email",
        element: <Email />,
      },
      {
        path: "/message/:id",
        element: <Message />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
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
