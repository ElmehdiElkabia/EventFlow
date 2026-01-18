import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
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
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockTransactions = [
  {
    id: "TXN001",
    user: "Alice Johnson",
    email: "alice@example.com",
    event: "Tech Innovation Summit",
    amount: 299.0,
    status: "completed",
    date: "2024-12-10T14:30:00",
    method: "Credit Card",
  },
  {
    id: "TXN002",
    user: "Bob Smith",
    email: "bob@example.com",
    event: "Electronic Music Festival",
    amount: 150.0,
    status: "completed",
    date: "2024-12-10T12:15:00",
    method: "PayPal",
  },
  {
    id: "TXN003",
    user: "Carol White",
    email: "carol@example.com",
    event: "Startup Pitch Competition",
    amount: 0.0,
    status: "completed",
    date: "2024-12-09T18:45:00",
    method: "Free",
  },
  {
    id: "TXN004",
    user: "David Brown",
    email: "david@example.com",
    event: "Art Exhibition Opening",
    amount: 45.0,
    status: "pending",
    date: "2024-12-09T10:00:00",
    method: "Credit Card",
  },
  {
    id: "TXN005",
    user: "Eva Martinez",
    email: "eva@example.com",
    event: "Tech Innovation Summit",
    amount: 299.0,
    status: "refunded",
    date: "2024-12-08T16:20:00",
    method: "Credit Card",
  },
];

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Transactions",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: CreditCard,
  },
  {
    title: "Avg. Order Value",
    value: "$36.27",
    change: "+3.1%",
    trend: "up",
    icon: TrendingUp,
  },
];

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = mockTransactions.filter((t) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
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

        {filteredTransactions.length === 0 && (
          <Card variant="elevated" className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No transactions found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
