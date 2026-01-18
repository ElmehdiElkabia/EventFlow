import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";

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
import Categories from "./pages/dashboard/Categories";
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
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/tickets" element={<MyTickets />} />
          
          {/* Organizer Dashboard */}
          <Route path="/dashboard/my-events" element={<MyEvents />} />
          <Route path="/dashboard/create-event" element={<CreateEvent />} />
          <Route path="/dashboard/edit-event/:id" element={<EditEvent />} />
          <Route path="/dashboard/checkin" element={<CheckIn />} />
          <Route path="/dashboard/attendees" element={<Attendees />} />
          <Route path="/dashboard/sales" element={<TicketSales />} />
          
          {/* User Dashboard */}
          <Route path="/dashboard/user-tickets" element={<UserTickets />} />
          
          {/* Admin Dashboard */}
          <Route path="/dashboard/events" element={<AdminEvents />} />
          <Route path="/dashboard/users" element={<AdminUsers />} />
          <Route path="/dashboard/categories" element={<Categories />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/transactions" element={<Transactions />} />
          <Route path="/dashboard/refunds" element={<Refunds />} />
          
          {/* Organizer Dashboard */}
          <Route path="/dashboard/announcements" element={<Announcements />} />
          
          {/* User Dashboard */}
          <Route path="/dashboard/upcoming" element={<UpcomingEvents />} />
          <Route path="/dashboard/reviews" element={<MyReviews />} />
          <Route path="/dashboard/notifications" element={<Notifications />} />
          
          {/* Shared */}
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
