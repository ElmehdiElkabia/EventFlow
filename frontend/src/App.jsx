import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";
import NotAllowed from "./pages/NotAllowed";
import Categories from "./pages/Categories";
import About from "./pages/About";

// Dashboard pages
import MyEvents from "./pages/dashboard/MyEvents";
import CreateEvent from "./pages/dashboard/CreateEvent";
import EditEvent from "./pages/dashboard/EditEvent";
import CheckIn from "./pages/dashboard/CheckIn";
import Attendees from "./pages/dashboard/Attendees";
import TicketSales from "./pages/dashboard/TicketSales";
import UserTickets from "./pages/dashboard/UserTickets";
import AdminEvents from "./pages/dashboard/AdminEvents";
import AdminUsers from "./pages/dashboard/AdminUsers";
import ManageCategories from "./pages/dashboard/ManageCategories";
import Announcements from "./pages/dashboard/Announcements";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import Transactions from "./pages/dashboard/Transactions";
import Refunds from "./pages/dashboard/Refunds";
import Profile from "./pages/dashboard/Profile";
import UpcomingEvents from "./pages/dashboard/UpcomingEvents";
import MyReviews from "./pages/dashboard/MyReviews";
import Notifications from "./pages/dashboard/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
		  <Route path="/categories" element={<Categories />} />
		  <Route path="/about" element={<About />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/my-tickets" element={<ProtectedRoute allowedRoles={["attendee"]}><MyTickets /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["admin","organizer","attendee"]}><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/tickets" element={<ProtectedRoute allowedRoles={["attendee"]}><MyTickets /></ProtectedRoute>} />
          
          {/* Organizer Dashboard */}
          <Route path="/dashboard/my-events" element={<ProtectedRoute allowedRoles={["organizer"]}><MyEvents /></ProtectedRoute>} />
          <Route path="/dashboard/events/create" element={<ProtectedRoute allowedRoles={["organizer"]}><CreateEvent /></ProtectedRoute>} />
          <Route path="/dashboard/edit-event/:id" element={<ProtectedRoute allowedRoles={["organizer"]}><EditEvent /></ProtectedRoute>} />
          <Route path="/dashboard/events/:id/check-in" element={<ProtectedRoute allowedRoles={["organizer"]}><CheckIn /></ProtectedRoute>} />
          <Route path="/dashboard/events/:id/attendees" element={<ProtectedRoute allowedRoles={["organizer"]}><Attendees /></ProtectedRoute>} />
          <Route path="/dashboard/sales" element={<ProtectedRoute allowedRoles={["organizer"]}><TicketSales /></ProtectedRoute>} />
          
          {/* User Dashboard */}
          <Route path="/dashboard/user-tickets" element={<ProtectedRoute allowedRoles={["attendee"]}><UserTickets /></ProtectedRoute>} />
          
          {/* Admin Dashboard */}
          <Route path="/dashboard/admin/events" element={<ProtectedRoute allowedRoles={["admin"]}><AdminEvents /></ProtectedRoute>} />
          <Route path="/dashboard/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
          <Route path="/dashboard/manage-categories" element={<ProtectedRoute allowedRoles={["admin"]}><ManageCategories /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute allowedRoles={["admin"]}><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard/transactions" element={<ProtectedRoute allowedRoles={["admin"]}><Transactions /></ProtectedRoute>} />
          <Route path="/dashboard/refunds" element={<ProtectedRoute allowedRoles={["admin"]}><Refunds /></ProtectedRoute>} />
          
          {/* Organizer Dashboard */}
          <Route path="/dashboard/announcements" element={<ProtectedRoute allowedRoles={["organizer"]}><Announcements /></ProtectedRoute>} />
          
          {/* User Dashboard */}
          <Route path="/dashboard/upcoming" element={<ProtectedRoute allowedRoles={["attendee"]}><UpcomingEvents /></ProtectedRoute>} />
          <Route path="/dashboard/reviews" element={<ProtectedRoute allowedRoles={["attendee"]}><MyReviews /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute allowedRoles={["attendee"]}><Notifications /></ProtectedRoute>} />
          
          {/* Shared */}
          <Route path="/dashboard/settings" element={<ProtectedRoute allowedRoles={["admin","organizer","attendee"]}><Settings /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute allowedRoles={["admin","organizer","attendee"]}><Profile /></ProtectedRoute>} />

          <Route path="/not-allowed" element={<NotAllowed />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
