import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  LayoutDashboard,
  Ticket,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  BarChart3,
  FolderOpen,
  CreditCard,
  MessageSquare,
  QrCode,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = {
  admin: [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: Users, label: "Users", path: "/dashboard/users" },
    { icon: Calendar, label: "Events", path: "/dashboard/events" },
    { icon: FolderOpen, label: "Categories", path: "/dashboard/manage-categories" },
    { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
    { icon: CreditCard, label: "Transactions", path: "/dashboard/transactions" },
    { icon: MessageSquare, label: "Refunds", path: "/dashboard/refunds" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ],
  organizer: [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: Calendar, label: "My Events", path: "/dashboard/my-events" },
    { icon: Plus, label: "Create Event", path: "/dashboard/create-event" },
    { icon: Ticket, label: "Ticket Sales", path: "/dashboard/sales" },
    { icon: Users, label: "Attendees", path: "/dashboard/attendees" },
    { icon: QrCode, label: "Check-in", path: "/dashboard/checkin" },
    { icon: MessageSquare, label: "Announcements", path: "/dashboard/announcements" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ],
  user: [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: Ticket, label: "My Tickets", path: "/dashboard/tickets" },
    { icon: Calendar, label: "Upcoming Events", path: "/dashboard/upcoming" },
    { icon: MessageSquare, label: "My Reviews", path: "/dashboard/reviews" },
    { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ],
};

const DashboardLayout = ({ children, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const items = menuItems[role];

  return (
    <div className="min-h-screen bg-background dark">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">EventFlow</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">John Doe</p>
                <p className="text-sm text-muted-foreground capitalize">{role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" asChild>
              <Link to="/login">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 h-10 pl-10 pr-4 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-secondary">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>

              {/* Quick Actions */}
              {role === "organizer" && (
                <Button variant="hero" size="sm" asChild>
                  <Link to="/dashboard/create-event">
                    <Plus className="w-4 h-4 mr-1" />
                    New Event
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
