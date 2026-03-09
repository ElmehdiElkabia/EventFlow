import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Save,
  Loader2,
  AlertCircle,
  CreditCard,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from "@/services/userService";
import { authService } from "@/services/authService";
import billingService from "@/services/billingService";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    eventUpdates: true,
    marketing: false,
    ticketReminders: true,
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [billingSummary, setBillingSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [billingAddress, setBillingAddress] = useState({
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
  });
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'visa',
    last_four: '',
    cardholder_name: '',
    expiry_month: '',
    expiry_year: '',
    brand: 'visa',
  });

  useEffect(() => {
    fetchProfile();
    fetchBillingData();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.me();
      setProfile(response.data || {});
    } catch (err) {
      console.error('Request failed');
      const errorMsg = err.response?.data?.message || 'Failed to load profile';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await authService.updateProfile({ name: profile.name, email: profile.email });
      // Update local user data
      if (response.data) {
        setProfile(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error('Request failed');
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      // For now, just save to localStorage since there's no backend endpoint for all roles
      localStorage.setItem('notification_settings', JSON.stringify(notifications));
      toast.success("Notification preferences saved");
    } catch (err) {
      console.error('Request failed');
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      // Validate passwords match
      if (passwordData.new_password !== passwordData.new_password_confirmation) {
        toast.error("New passwords do not match");
        return;
      }

      if (passwordData.new_password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }

      setSaving(true);
      await authService.updatePassword(passwordData);
      toast.success("Password updated successfully");
      
      // Clear password fields
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err) {
      console.error('Request failed');
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const fetchBillingData = async () => {
    try {
      setLoadingBilling(true);
      const [methodsRes, summaryRes, transactionsRes, addressRes] = await Promise.all([
        billingService.getPaymentMethods(),
        billingService.getBillingSummary(),
        billingService.getTransactions(1, 5),
        billingService.getBillingAddress().catch(() => ({ data: null })),
      ]);

      setPaymentMethods(methodsRes.data || []);
      setBillingSummary(summaryRes.data || null);
      setTransactions(transactionsRes.data || []);
      if (addressRes.data) {
        setBillingAddress(addressRes.data);
      }
    } catch (err) {
      console.error('Request failed');
    } finally {
      setLoadingBilling(false);
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return;

    try {
      await billingService.deletePaymentMethod(id);
      toast.success('Payment method removed');
      fetchBillingData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove payment method');
    }
  };

  const handleSetDefaultPaymentMethod = async (id) => {
    try {
      await billingService.setDefaultPaymentMethod(id);
      toast.success('Default payment method updated');
      fetchBillingData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update default payment method');
    }
  };

  const handleUpdateBillingAddress = async () => {
    try {
      setSaving(true);
      await billingService.updateBillingAddress(billingAddress);
      toast.success('Billing address updated successfully');
    } catch (err) {
      console.error('Request failed');
      toast.error(err.response?.data?.message || 'Failed to update billing address');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      // Validate inputs
      if (!newPaymentMethod.last_four || newPaymentMethod.last_four.length !== 4) {
        toast.error('Please enter the last 4 digits of your card');
        return;
      }
      if (!newPaymentMethod.cardholder_name) {
        toast.error('Please enter the cardholder name');
        return;
      }
      if (!newPaymentMethod.expiry_month || !newPaymentMethod.expiry_year) {
        toast.error('Please enter expiry date');
        return;
      }

      setSaving(true);
      await billingService.addPaymentMethod(newPaymentMethod);
      toast.success('Payment method added successfully');
      
      // Reset form and close modal
      setNewPaymentMethod({
        type: 'visa',
        last_four: '',
        cardholder_name: '',
        expiry_month: '',
        expiry_year: '',
        brand: 'visa',
      });
      setShowAddPaymentModal(false);
      
      // Refresh payment methods
      fetchBillingData();
    } catch (err) {
      console.error('Request failed');
      toast.error(err.response?.data?.message || 'Failed to add payment method');
    } finally {
      setSaving(false);
    }
  };

  const handleViewReceipt = async (transactionId) => {
    try {
      const response = await billingService.downloadReceipt(transactionId);
      // In a real app, this would download a PDF
      console.log('Receipt data:', response.data);
      toast.success('Receipt downloaded');
    } catch (err) {
      toast.error('Failed to download receipt');
    }
  };
    

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
                        value={profile.name || ''}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <Input
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button variant="hero" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
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

                  <Button variant="hero" onClick={handleSaveNotifications} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </>
                    )}
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
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="mt-1"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">New Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="mt-1"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be at least 8 characters
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Confirm New Password
                    </label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="mt-1"
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                    />
                  </div>
                  <Button 
                    variant="hero" 
                    onClick={handleUpdatePassword}
                    disabled={saving || !passwordData.current_password || !passwordData.new_password}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>

                  <div className="pt-6 border-t border-border">
                    <h4 className="font-medium text-foreground mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                      <div>
                        <p className="font-medium text-foreground">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security (Coming soon)
                        </p>
                      </div>
                      <Button variant="outline" disabled>Enable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              {/* Payment Methods */}
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
                    <CardDescription>Manage your payment options and cards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingBilling ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : paymentMethods.length > 0 ? (
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <div 
                            key={method.id}
                            className={`p-4 rounded-xl bg-secondary/50 flex items-center justify-between ${method.is_default ? 'border border-primary/20' : ''}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-8 rounded flex items-center justify-center ${
                                method.brand === 'visa' ? 'bg-gradient-primary' :
                                method.brand === 'mastercard' ? 'bg-gradient-to-br from-blue-500 to-purple-500' :
                                method.brand === 'amex' ? 'bg-gradient-to-br from-green-500 to-teal-500' :
                                'bg-gradient-to-br from-gray-500 to-gray-600'
                              }`}>
                                <CreditCard className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground capitalize">
                                    {method.brand} •••• {method.last_four}
                                  </p>
                                  {method.is_default && (
                                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-xs text-primary font-medium">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Expires {method.expiry_month}/{method.expiry_year}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!method.is_default && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleSetDefaultPaymentMethod(method.id)}
                                >
                                  Set Default
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeletePaymentMethod(method.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground">No payment methods added yet</p>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowAddPaymentModal(true)}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add New Payment Method
                    </Button>

                    {/* Add Payment Method Modal */}
                    {showAddPaymentModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md mx-4">
                          <CardHeader>
                            <CardTitle>Add Payment Method</CardTitle>
                            <CardDescription>Enter your card details</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-foreground">Card Type</label>
                              <select 
                                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background"
                                value={newPaymentMethod.type}
                                onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, type: e.target.value, brand: e.target.value })}
                              >
                                <option value="visa">Visa</option>
                                <option value="mastercard">Mastercard</option>
                                <option value="amex">American Express</option>
                                <option value="discover">Discover</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">Cardholder Name</label>
                              <Input 
                                value={newPaymentMethod.cardholder_name}
                                onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardholder_name: e.target.value })}
                                placeholder="John Doe"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">Last 4 Digits</label>
                              <Input 
                                value={newPaymentMethod.last_four}
                                onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, last_four: e.target.value.slice(0, 4) })}
                                placeholder="4242"
                                maxLength={4}
                                className="mt-1"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-foreground">Expiry Month</label>
                                <Input 
                                  value={newPaymentMethod.expiry_month}
                                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiry_month: e.target.value.slice(0, 2) })}
                                  placeholder="12"
                                  maxLength={2}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-foreground">Expiry Year</label>
                                <Input 
                                  value={newPaymentMethod.expiry_year}
                                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiry_year: e.target.value.slice(0, 4) })}
                                  placeholder="2025"
                                  maxLength={4}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => {
                                  setShowAddPaymentModal(false);
                                  setNewPaymentMethod({
                                    type: 'visa',
                                    last_four: '',
                                    cardholder_name: '',
                                    expiry_month: '',
                                    expiry_year: '',
                                    brand: 'visa',
                                  });
                                }}
                                disabled={saving}
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="hero" 
                                className="flex-1"
                                onClick={handleAddPaymentMethod}
                                disabled={saving}
                              >
                                {saving ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Adding
                                  </>
                                ) : (
                                  'Add Card'
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Billing Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Globe className="w-5 h-5 text-primary" />
                      Billing Summary
                    </CardTitle>
                    <CardDescription>Your spending overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {billingSummary ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                          <p className="text-sm text-muted-foreground mb-1">This Month</p>
                          <p className="text-2xl font-bold text-foreground">
                            ${billingSummary.current_month?.total?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {billingSummary.current_month?.count || 0} transactions
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                          <p className="text-sm text-muted-foreground mb-1">Last Month</p>
                          <p className="text-2xl font-bold text-foreground">
                            ${billingSummary.last_month?.total?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {billingSummary.last_month?.count || 0} transactions
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                          <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                          <p className="text-2xl font-bold text-foreground">
                            ${billingSummary.lifetime?.total?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {billingSummary.lifetime?.count || 0} transactions
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Transaction History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card variant="elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          Transaction History
                        </CardTitle>
                        <CardDescription>All your ticket purchases and payments</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        Download All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {transactions.length > 0 ? (
                      <div className="space-y-3">
                        {transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-foreground">
                                  {transaction.event?.title || 'Event'}
                                </p>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.status === 'completed' 
                                    ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                                    : transaction.status === 'refunded'
                                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                    : transaction.status === 'pending'
                                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                    : 'bg-red-500/20 text-red-600 dark:text-red-400'
                                }`}>
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span>•</span>
                                <span className="capitalize">{transaction.payment_method}</span>
                                <span>•</span>
                                <span className="text-xs">{transaction.transaction_id}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-semibold text-foreground">
                                ${Number(transaction.amount).toFixed(2)}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewReceipt(transaction.id)}
                              >
                                View Receipt
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground">No transactions yet</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" size="sm" onClick={() => fetchBillingData()}>
                        Load More Transactions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Billing Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Mail className="w-5 h-5 text-primary" />
                      Billing Address
                    </CardTitle>
                    <CardDescription>Update your billing information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Street Address</label>
                        <Input 
                          value={billingAddress.street_address} 
                          onChange={(e) => setBillingAddress({ ...billingAddress, street_address: e.target.value })}
                          className="mt-1" 
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">City</label>
                        <Input 
                          value={billingAddress.city} 
                          onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                          className="mt-1" 
                          placeholder="San Francisco"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">State/Province</label>
                        <Input 
                          value={billingAddress.state} 
                          onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                          className="mt-1" 
                          placeholder="California"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">ZIP/Postal Code</label>
                        <Input 
                          value={billingAddress.zip_code} 
                          onChange={(e) => setBillingAddress({ ...billingAddress, zip_code: e.target.value })}
                          className="mt-1" 
                          placeholder="94102"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-foreground">Country</label>
                        <Input 
                          value={billingAddress.country} 
                          onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                          className="mt-1" 
                          placeholder="United States"
                        />
                      </div>
                    </div>
                    <Button 
                      variant="hero" 
                      onClick={handleUpdateBillingAddress}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Billing Address
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
