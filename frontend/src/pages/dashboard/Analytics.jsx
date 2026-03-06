import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	BarChart3,
	TrendingUp,
	Users,
	Calendar,
	DollarSign,
	Ticket,
	ArrowUpRight,
	ArrowDownRight,
	Eye,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { toast } from "sonner";
import adminService from "@/services/adminService";

const COLORS = [
	"hsl(var(--primary))",
	"hsl(var(--chart-2))",
	"hsl(var(--chart-3))",
	"hsl(var(--chart-4))",
	"hsl(var(--chart-5))",
	"#8b5cf6", // purple
	"#ec4899", // pink
	"#f59e0b", // amber
	"#10b981", // emerald
	"#3b82f6", // blue
];

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
	const RADIAN = Math.PI / 180;
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	if (percent < 0.05) return null; // Don't show label for very small slices

	return (
		<text
			x={x}
			y={y}
			fill="hsl(var(--foreground))"
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
			className="text-xs font-semibold"
		>
			{`${name} ${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

const Analytics = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [stats, setStats] = useState([]);
	const [revenueData, setRevenueData] = useState([]);
	const [categoryData, setCategoryData] = useState([]);
	const [topEvents, setTopEvents] = useState([]);

	useEffect(() => {
		fetchAnalytics();
	}, []);

	const fetchAnalytics = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await adminService.getAnalytics();

			// Transform stats data
			const statsData = [
				{
					title: "Total Revenue",
					value: response.stats.totalRevenue.value,
					change: response.stats.totalRevenue.change,
					trend: response.stats.totalRevenue.trend,
					icon: DollarSign,
				},
				{
					title: "Total Users",
					value: response.stats.totalUsers.value,
					change: response.stats.totalUsers.change,
					trend: response.stats.totalUsers.trend,
					icon: Users,
				},
				{
					title: "Active Events",
					value: response.stats.activeEvents.value,
					change: response.stats.activeEvents.change,
					trend: response.stats.activeEvents.trend,
					icon: Calendar,
				},
				{
					title: "Tickets Sold",
					value: response.stats.ticketsSold.value,
					change: response.stats.ticketsSold.change,
					trend: response.stats.ticketsSold.trend,
					icon: Ticket,
				},
			];

			// Transform category data with colors
			const categoryWithColors = (response.categoryData || []).map((cat, index) => ({
				...cat,
				color: COLORS[index % COLORS.length],
			}));

			setStats(statsData);
			setRevenueData(response.monthlyRevenue || []);
			setCategoryData(categoryWithColors);
			setTopEvents(response.topEvents || []);
		} catch (err) {
			console.error("Failed to fetch analytics:", err);
			setError(err.response?.data?.message || "Failed to load analytics");
			toast.error(err.response?.data?.message || "Failed to load analytics");
		} finally {
			setLoading(false);
		}
	};
	return (
		<DashboardLayout role="admin">
			{loading ? (
				<div className="flex items-center justify-center h-96">
					<Loader2 className="w-8 h-8 animate-spin text-primary" />
				</div>
			) : error ? (
				<div className="flex flex-col items-center justify-center h-96 space-y-4">
					<AlertCircle className="w-12 h-12 text-destructive" />
					<p className="text-lg font-medium text-destructive">{error}</p>
					<Button onClick={fetchAnalytics} variant="outline">
						Retry
					</Button>
				</div>
			) : (
				<div className="space-y-6">
					{/* Header */}
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-foreground">Analytics</h1>
						<p className="text-muted-foreground">Platform performance and insights</p>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
												className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"
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

					{/* Charts Row */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Revenue Chart */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.4 }}
						>
							<Card variant="elevated">
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="text-foreground">Revenue Overview</CardTitle>
										<Badge variant="outline">Last 12 months</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="h-[300px]">
										<ResponsiveContainer width="100%" height="100%">
											<AreaChart data={revenueData}>
												<defs>
													<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
														<stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
														<stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
													</linearGradient>
												</defs>
												<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
												<XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
												<YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
												<Tooltip
													contentStyle={{
														backgroundColor: "hsl(var(--card))",
														border: "1px solid hsl(var(--border))",
														borderRadius: "8px",
													}}
													labelStyle={{ color: "hsl(var(--foreground))" }}
												/>
												<Area
													type="monotone"
													dataKey="revenue"
													stroke="hsl(var(--primary))"
													fillOpacity={1}
													fill="url(#colorRevenue)"
												/>
											</AreaChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Category Distribution */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.5 }}
						>
							<Card variant="elevated dark">
								<CardHeader>
									<CardTitle className="text-foreground">Events by Category</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-[300px] flex items-center ">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie

													data={categoryData}
													cx="50%"
													cy="50%"
													innerRadius={60}
													outerRadius={100}
													paddingAngle={5}
													dataKey="value"
												>
													{categoryData.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={entry.color} />
													))}
												</Pie>
												<Tooltip

													contentStyle={{
														backgroundColor: "hsl(var(--card))",
														border: "1px solid hsl(var(--border))",
														borderRadius: "8px",
													}}
													itemStyle={{
														color: "#ffffff"
													}}
												/>
											</PieChart>
										</ResponsiveContainer>
										<div className="space-y-2">
											{categoryData.map((category) => (
												<div key={category.name} className="flex items-center gap-2 ">
													<div
														className="w-3 h-3 rounded-full"
														style={{ backgroundColor: category.color }}
													/>
													<span className="text-sm text-muted-foreground">
														{category.name} ({category.value}%)
													</span>
												</div>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* Tickets Chart */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.6 }}
					>
						<Card variant="elevated">
							<CardHeader>
								<CardTitle className="text-foreground">Ticket Sales Trend</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="h-[300px]">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={revenueData}>
											<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
											<XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
											<YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
											<Tooltip
												contentStyle={{
													backgroundColor: "hsl(var(--card))",
													border: "1px solid hsl(var(--border))",
													borderRadius: "8px",
												}}
											/>
											<Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Top Events */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.7 }}
					>
						<Card variant="elevated">
							<CardHeader>
								<CardTitle className="text-foreground">Top Performing Events</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-border">
												<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
													Event
												</th>
												<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
													Tickets Sold
												</th>
												<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
													Revenue
												</th>
												<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
													Actions
												</th>
											</tr>
										</thead>
										<tbody>
											{topEvents.map((event, index) => (
												<tr
													key={index}
													className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
												>
													<td className="py-4 px-4">
														<div className="flex items-center gap-3">
															<div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
																<span className="text-primary font-semibold text-sm">
																	{index + 1}
																</span>
															</div>
															<span className="font-medium text-foreground">{event.name}</span>
														</div>
													</td>
													<td className="py-4 px-4 text-muted-foreground">
														{event.tickets.toLocaleString()}
													</td>
													<td className="py-4 px-4 text-foreground font-medium">
														${event.revenue.toLocaleString()}
													</td>
													<td className="py-4 px-4">
														<button className="text-primary hover:text-primary/80">
															<Eye className="w-4 h-4" />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			)}
		</DashboardLayout>
	);
};

export default Analytics;
