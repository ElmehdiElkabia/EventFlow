import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Users,
  UserCog,
  Shield,
  MoreVertical,
  Mail,
  Ban,
  UserCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import adminService from "@/services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const [suspendModal, setSuspendModal] = useState({ open: false, user: null });
  const [activateModal, setActivateModal] = useState({ open: false, user: null });
  const [suspensionReason, setSuspensionReason] = useState("");
  const [emailModal, setEmailModal] = useState({ open: false, user: null });
  const [emailData, setEmailData] = useState({ subject: "", message: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getUsers();
      // Map backend data to frontend format
      const mappedUsers = (data || []).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role === 'attendee' ? 'user' : user.role, // Map attendee to user for display
        status: user.status || 'active', // Use real status from backend
        eventsCreated: 0, // Backend doesn't provide this
        ticketsPurchased: 0, // Backend doesn't provide this
        joinedAt: user.created_at, // Map created_at to joinedAt
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.response?.data?.message || "Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    organizers: users.filter((u) => u.role === "organizer").length,
    users: users.filter((u) => u.role === "user").length,
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionLoading(true);
      // Map frontend role to backend role (user → attendee)
      const backendRole = newRole === 'user' ? 'attendee' : newRole;
      await adminService.updateUserRole(userId, backendRole);
      // Update local state
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success("User role updated successfully!");
    } catch (err) {
      console.error("Failed to update user role:", err);
      toast.error(err.response?.data?.message || "Failed to update user role");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setSuspendModal({ open: true, user });
  };

  const confirmSuspendUser = async () => {
    if (!suspendModal.user) return;

    try {
      setActionLoading(true);
      await adminService.suspendUser(suspendModal.user.id, suspensionReason || undefined);
      // Update local state
      setUsers(users.map((u) => (u.id === suspendModal.user.id ? { ...u, status: 'suspended' } : u)));
      toast.success(`User ${suspendModal.user.name} has been suspended`);
      setSuspendModal({ open: false, user: null });
      setSuspensionReason("");
    } catch (err) {
      console.error("Failed to suspend user:", err);
      toast.error(err.response?.data?.message || "Failed to suspend user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setActivateModal({ open: true, user });
  };

  const confirmActivateUser = async () => {
    if (!activateModal.user) return;

    try {
      setActionLoading(true);
      await adminService.activateUser(activateModal.user.id);
      // Update local state
      setUsers(users.map((u) => (u.id === activateModal.user.id ? { ...u, status: 'active' } : u)));
      toast.success(`User ${activateModal.user.name} has been activated`);
      setActivateModal({ open: false, user: null });
    } catch (err) {
      console.error("Failed to activate user:", err);
      toast.error(err.response?.data?.message || "Failed to activate user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setEmailModal({ open: true, user });
  };

  const confirmSendEmail = async () => {
    if (!emailModal.user) return;

    if (!emailData.subject.trim()) {
      toast.error("Please enter an email subject");
      return;
    }

    if (!emailData.message.trim()) {
      toast.error("Please enter an email message");
      return;
    }

    try {
      setActionLoading(true);
      await adminService.sendEmailToUser(emailModal.user.id, emailData);
      toast.success(`Email sent to ${emailModal.user.name}`);
      setEmailModal({ open: false, user: null });
      setEmailData({ subject: "", message: "" });
    } catch (err) {
      console.error("Failed to send email:", err);
      toast.error(err.response?.data?.message || "Failed to send email");
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">Admin</Badge>;
      case "organizer":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Organizer</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manage Users</h1>
          <p className="text-muted-foreground">View and manage platform users</p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          </div>
        ) : error ? (
          /* Error state */
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={fetchUsers}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
                    <p className="text-sm text-muted-foreground">Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <UserCog className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.organizers}</p>
                    <p className="text-sm text-muted-foreground">Organizers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.users}</p>
                    <p className="text-sm text-muted-foreground">Regular Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Events Created</TableHead>
                      <TableHead>Tickets</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-semibold">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "active" ? "success" : "destructive"}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.eventsCreated}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.ticketsPurchased}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={actionLoading}>
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleSendEmail(user.id)}
                                disabled={actionLoading}
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user.id, "organizer")}
                                disabled={actionLoading}
                              >
                                <UserCog className="w-4 h-4 mr-2" />
                                Make Organizer
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => user.status === "active" ? handleSuspendUser(user.id) : handleActivateUser(user.id)}
                                disabled={actionLoading}
                              >
                                {user.status === "active" ? (
                                  <>
                                    <Ban className="w-4 h-4 mr-2" />
                                    Suspend User
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Activate User
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
          </>
        )}

        {/* Suspend User Modal */}
        <Dialog open={suspendModal.open} onOpenChange={(open) => {
          if (!open) {
            setSuspendModal({ open: false, user: null });
            setSuspensionReason("");
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-destructive" />
                Suspend User
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to suspend <strong>{suspendModal.user?.name}</strong>? 
                They will be immediately logged out and unable to access the platform.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-2">
              <label htmlFor="suspension-reason" className="text-sm font-medium">
                Reason (Optional)
              </label>
              <Textarea
                id="suspension-reason"
                placeholder="Enter the reason for suspension..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                The user will receive an email with this reason.
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSuspendModal({ open: false, user: null });
                  setSuspensionReason("");
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmSuspendUser}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Suspending...
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Suspend User
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Activate User Modal */}
        <Dialog open={activateModal.open} onOpenChange={(open) => {
          if (!open) {
            setActivateModal({ open: false, user: null });
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-500" />
                Activate User
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to activate <strong>{activateModal.user?.name}</strong>? 
                They will regain full access to the platform.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActivateModal({ open: false, user: null })}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmActivateUser}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Activating...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Activate User
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Email Modal */}
        <Dialog open={emailModal.open} onOpenChange={(open) => {
          if (!open) {
            setEmailModal({ open: false, user: null });
            setEmailData({ subject: "", message: "" });
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Send Email to {emailModal.user?.name}
              </DialogTitle>
              <DialogDescription>
                Send a direct email to <strong>{emailModal.user?.email}</strong>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email-subject" className="text-sm font-medium">
                  Subject *
                </label>
                <Input
                  id="email-subject"
                  placeholder="Enter email subject..."
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email-message" className="text-sm font-medium">
                  Message *
                </label>
                <Textarea
                  id="email-message"
                  placeholder="Enter your message..."
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  📧 This email will be sent from the EventFlow platform to the user's registered email address.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setEmailModal({ open: false, user: null });
                  setEmailData({ subject: "", message: "" });
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSendEmail}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
