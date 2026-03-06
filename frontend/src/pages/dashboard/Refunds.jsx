import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  RotateCcw,
  Search,
  Check,
  X,
  Clock,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import adminService from "@/services/adminService";

const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: "$0.00"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRefunds();
    fetchStats();
  }, []);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getRefunds();
      setRefunds(response || []);
    } catch (err) {
      console.error('Failed to fetch refunds:', err);
      setError(err.response?.data?.message || 'Failed to load refunds');
      toast.error(err.response?.data?.message || 'Failed to load refunds');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getRefundStats();
      setStats({
        pending: response.pending || 0,
        approved: response.approved || 0,
        rejected: response.rejected || 0,
        totalAmount: `$${response.totalAmount || '0.00'}`
      });
    } catch (err) {
      console.error('Failed to fetch refund stats:', err);
    }
  };
  const filteredRefunds = refunds.filter(
    (r) =>
      r.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await adminService.approveRefund(id, adminNotes || undefined);
      // Update local state
      setRefunds(refunds.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
      await fetchStats(); // Refresh stats
      toast.success("Refund approved successfully");
      setDialogOpen(false);
      setAdminNotes("");
    } catch (err) {
      console.error("Failed to approve refund:", err);
      toast.error(err.response?.data?.message || "Failed to approve refund");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    
    try {
      setActionLoading(true);
      await adminService.rejectRefund(id, rejectionReason);
      // Update local state
      setRefunds(refunds.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
      await fetchStats(); // Refresh stats
      toast.success("Refund rejected");
      setDialogOpen(false);
      setRejectionReason("");
    } catch (err) {
      console.error("Failed to reject refund:", err);
      toast.error(err.response?.data?.message || "Failed to reject refund");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const openRefundDetails = (refund) => {
    setSelectedRefund(refund);
    setDialogOpen(true);
  };

  const statsData = [
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-amber-400" },
    { title: "Approved", value: stats.approved, icon: Check, color: "text-emerald-400" },
    { title: "Rejected", value: stats.rejected, icon: X, color: "text-red-400" },
    { title: "Total Amount", value: stats.totalAmount, icon: DollarSign, color: "text-primary" },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Refund Requests</h1>
          <p className="text-muted-foreground">Review and manage refund requests</p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading refunds...</p>
            </div>
          </div>
        ) : error ? (
          /* Error state */
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={fetchRefunds}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search refunds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Refunds List */}
        <div className="space-y-4">
          {filteredRefunds.map((refund, index) => (
            <motion.div
              key={refund.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <RotateCcw className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-muted-foreground">
                            {refund.id}
                          </span>
                          {getStatusBadge(refund.status)}
                        </div>
                        <h3 className="font-semibold text-foreground">{refund.user}</h3>
                        <p className="text-sm text-muted-foreground">{refund.event}</p>
                        <p className="text-sm text-muted-foreground italic">"{refund.reason}"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">
                          ${refund.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(refund.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {refund.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRefundDetails(refund)}
                          >
                            Review
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredRefunds.length === 0 && (
          <Card variant="elevated" className="p-12 text-center">
            <RotateCcw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No refund requests</h3>
            <p className="text-muted-foreground">There are no refund requests to review</p>
          </Card>
        )}

        {/* Review Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Refund Request</DialogTitle>
            </DialogHeader>
            {selectedRefund && (
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-xl bg-secondary/50 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User:</span>
                    <span className="font-medium text-foreground">{selectedRefund.user}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="text-foreground">{selectedRefund.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event:</span>
                    <span className="text-foreground">{selectedRefund.event}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ticket:</span>
                    <span className="font-mono text-foreground">{selectedRefund.ticketCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-foreground">
                      ${selectedRefund.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Reason for refund:</p>
                      <p className="text-muted-foreground">{selectedRefund.reason}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Admin Notes (Optional for approval, required for rejection)
                  </label>
                  <Textarea
                    value={selectedRefund.status === "pending" && rejectionReason ? rejectionReason : adminNotes}
                    onChange={(e) => {
                      setRejectionReason(e.target.value);
                      setAdminNotes(e.target.value);
                    }}
                    placeholder="Add notes about this refund decision..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleReject(selectedRefund.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </>
                    )}
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleApprove(selectedRefund.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Refunds;
