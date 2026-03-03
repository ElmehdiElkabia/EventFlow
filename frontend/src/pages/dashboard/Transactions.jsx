import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import adminService from "@/services/adminService";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionsData, statsData] = await Promise.all([
          adminService.getTransactions(),
          adminService.getTransactionStats(),
        ]);
        setTransactions(transactionsData || []);
        setStats(statsData || {});
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        toast.error(err.response?.data?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "refunded":
        return <Badge variant="destructive">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground">Monitor and manage all platform transactions</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    ${Number(stats.totalRevenue || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalTransactions || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    ${Number(stats.avgOrderValue || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        {!loading && (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Table */}
            <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Transaction ID
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        User
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Event
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Method
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <span className="font-mono text-sm text-foreground">
                            {transaction.id}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-foreground">{transaction.user}</p>
                            <p className="text-sm text-muted-foreground">{transaction.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{transaction.event}</td>
                        <td className="py-4 px-6 font-medium text-foreground">
                          {transaction.amount === 0 ? "Free" : `$${transaction.amount.toFixed(2)}`}
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{transaction.method}</td>
                        <td className="py-4 px-6">{getStatusBadge(transaction.status)}</td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {filteredTransactions.length === 0 && !loading && (
          <Card variant="elevated" className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No transactions found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </Card>
        )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
