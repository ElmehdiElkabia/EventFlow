import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Mail,
  Smartphone,
  Save,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    eventUpdates: true,
    marketing: false,
    ticketReminders: true,
  });

  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    timezone: "America/New_York",
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <User className="w-5 h-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">JD</span>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <Input
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Phone</label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Timezone</label>
                      <Input
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button variant="hero" onClick={handleSaveProfile}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Bell className="w-5 h-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive updates via email
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, email: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, push: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Event Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified about event changes
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.eventUpdates}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, eventUpdates: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Marketing</p>
                          <p className="text-sm text-muted-foreground">
                            Receive promotional content
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, marketing: checked })
                        }
                      />
                    </div>
                  </div>

                  <Button variant="hero" onClick={handleSaveNotifications}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Shield className="w-5 h-5 text-primary" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground">Current Password</label>
                    <Input type="password" placeholder="••••••••" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">New Password</label>
                    <Input type="password" placeholder="••••••••" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Confirm New Password
                    </label>
                    <Input type="password" placeholder="••••••••" className="mt-1" />
                  </div>
                  <Button variant="hero" onClick={() => toast.success("Password updated")}>
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>

                  <div className="pt-6 border-t border-border">
                    <h4 className="font-medium text-foreground mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                      <div>
                        <p className="font-medium text-foreground">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Methods
                  </CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 rounded bg-gradient-primary flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>

                  <Button variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>

                  <div className="pt-6 border-t border-border">
                    <h4 className="font-medium text-foreground mb-4">Billing History</h4>
                    <div className="space-y-3">
                      {[
                        { date: "Dec 1, 2024", amount: "$299.00", event: "Tech Summit Ticket" },
                        { date: "Nov 15, 2024", amount: "$150.00", event: "Music Festival" },
                        { date: "Nov 1, 2024", amount: "$45.00", event: "Art Exhibition" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                        >
                          <div>
                            <p className="font-medium text-foreground">{item.event}</p>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                          <span className="font-medium text-foreground">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
