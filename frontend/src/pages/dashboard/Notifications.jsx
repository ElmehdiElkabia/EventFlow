import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Check,
  Trash2,
  Calendar,
  Ticket,
  Megaphone,
  CreditCard,
  Star,
  CheckCheck,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const mockNotifications = [
  {
    id: "1",
    type: "ticket",
    title: "Ticket Purchase Confirmed",
    message: "Your ticket for Tech Innovation Summit has been confirmed. Check your tickets section for the QR code.",
    date: "2024-12-10T14:30:00",
    read: false,
    icon: Ticket,
  },
  {
    id: "2",
    type: "announcement",
    title: "Event Update",
    message: "Electronic Music Festival: The venue doors will now open at 6 PM instead of 7 PM.",
    date: "2024-12-10T10:00:00",
    read: false,
    icon: Megaphone,
  },
  {
    id: "3",
    type: "reminder",
    title: "Event Reminder",
    message: "Don't forget! Startup Pitch Competition starts in 2 days. Don't miss it!",
    date: "2024-12-09T09:00:00",
    read: true,
    icon: Calendar,
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Successful",
    message: "Your payment of $150.00 for Electronic Music Festival was successful.",
    date: "2024-12-08T16:45:00",
    read: true,
    icon: CreditCard,
  },
  {
    id: "5",
    type: "review",
    title: "Review Helpful",
    message: "5 people found your review of Art Exhibition helpful!",
    date: "2024-12-07T12:30:00",
    read: true,
    icon: Star,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const getIconColor = (type) => {
    switch (type) {
      case "ticket":
        return "text-primary";
      case "announcement":
        return "text-amber-400";
      case "reminder":
        return "text-cyan-400";
      case "payment":
        return "text-emerald-400";
      case "review":
        return "text-pink-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" onClick={clearAll} className="text-muted-foreground">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Bell className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-primary mx-auto mb-2 flex items-center justify-center">
                <span className="text-primary-foreground font-bold">{unreadCount}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Ticket className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {notifications.filter((n) => n.type === "ticket").length}
              </p>
              <p className="text-sm text-muted-foreground">Tickets</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Megaphone className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {notifications.filter((n) => n.type === "announcement").length}
              </p>
              <p className="text-sm text-muted-foreground">Announcements</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                variant="elevated"
                className={`transition-all ${
                  !notification.read ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        !notification.read ? "bg-primary/20" : "bg-secondary"
                      }`}
                    >
                      <notification.icon
                        className={`w-5 h-5 ${getIconColor(notification.type)}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4
                            className={`font-medium ${
                              !notification.read ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {getTimeAgo(notification.date)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {notifications.length === 0 && (
          <Card variant="elevated" className="p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
