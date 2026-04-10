import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoleSelect from './pages/RoleSelect';
import Settings from './pages/Settings';

// Farmer
import DashboardLayout from './components/dashboard/DashboardLayout';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyListings from './pages/farmer/MyListings';
import AddListing from './pages/farmer/AddListing';
import AIPrice from './pages/farmer/AIPrice';
import Training from './pages/farmer/Training';
import DemandForecast from './pages/farmer/DemandForecast';
import BuyerMatching from './pages/farmer/BuyerMatching';

import FarmerMatching from './pages/buyer/FarmerMatching';

// Buyer
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BrowseListings from './pages/buyer/BrowseListings';
import ListingDetails from './pages/buyer/ListingDetails';
import QualityVerification from './pages/buyer/QualityVerification';
import Orders from './pages/buyer/Orders';

// Recruiter
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import RecruiterListings from './pages/recruiter/RecruiterListings';
import Applicants from './pages/recruiter/Applicants';
import Analytics from './pages/recruiter/Analytics';

const noLayoutRoutes = ['/login', '/signup', '/role-select'];
const dashboardPrefixes = ['/farmer', '/buyer', '/recruiter'];

function Layout() {
  const location = useLocation();
  const hideLayout =
    noLayoutRoutes.includes(location.pathname) ||
    dashboardPrefixes.some(p => location.pathname.startsWith(p));

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/role-select" element={<RoleSelect />} />

        {/* Farmer dashboard */}
        <Route path="/farmer" element={<DashboardLayout role="farmer" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="listings" element={<MyListings />} />
          <Route path="add-listing" element={<AddListing />} />
          <Route path="ai-price" element={<AIPrice />} />
          <Route path="training" element={<Training />} />
          <Route path="demand-forecast" element={<DemandForecast />} />
          <Route path="buyer-matching" element={<BuyerMatching />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Buyer dashboard */}
        <Route path="/buyer" element={<DashboardLayout role="buyer" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="browse" element={<BrowseListings />} />
          <Route path="listing/:id" element={<ListingDetails />} />
          <Route path="quality" element={<QualityVerification />} />
          <Route path="farmer-matching" element={<FarmerMatching />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Recruiter dashboard */}
        <Route path="/recruiter" element={<DashboardLayout role="recruiter" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="listings" element={<RecruiterListings />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
