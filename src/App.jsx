import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Favorites from "./pages/Favorites.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Account from "./pages/Account.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Buy from "./pages/Buy.jsx";
import Properties from "./pages/Properties.jsx";
import PropertyDetails from "./pages/PropertyDetails.jsx";
import Rent from "./pages/Rent.jsx";
import RequestDetails from "./pages/RequestDetails.jsx";
import Settings from "./pages/Settings.jsx";
import Services from "./pages/Services.jsx";

function App() {
  return (
    <Routes>
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="admin/settings" element={<AdminSettings />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetails />} />
        <Route path="request/:id" element={<RequestDetails />} />
        <Route path="buy" element={<Buy />} />
        <Route path="rent" element={<Rent />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="account" element={<Account />} />
        <Route path="settings" element={<Settings />} />
        <Route path="signin" element={<AuthPage mode="signin" />} />
        <Route path="signup" element={<AuthPage mode="signup" />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
