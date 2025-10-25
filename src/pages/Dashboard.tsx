import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Mail, DollarSign, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const stats = [
  {
    title: "New Orders",
    value: "24",
    change: "+12%",
    icon: ShoppingCart,
    color: "text-primary",
  },
  {
    title: "Unread Emails",
    value: "8",
    change: "-3",
    icon: Mail,
    color: "text-accent",
  },
  {
    title: "Revenue",
    value: "$12,450",
    change: "+23%",
    icon: DollarSign,
    color: "text-success",
  },
  {
    title: "Growth",
    value: "+18%",
    change: "+5%",
    icon: TrendingUp,
    color: "text-warning",
  },
];

const recentOrders = [
  { id: "1001", customer: "John Doe", amount: "$249.00", status: "New" },
  { id: "1002", customer: "Jane Smith", amount: "$499.00", status: "Processing" },
  { id: "1003", customer: "Bob Johnson", amount: "$149.00", status: "Fulfilled" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Welcome to Order Manager</AlertTitle>
        <AlertDescription>
          Your centralized platform for managing orders, customers, and communications.
          Use keyboard shortcuts to navigate quickly between sections.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-base"
              >
                <div className="flex items-center gap-4">
                  <div className="font-mono text-sm text-muted-foreground">
                    #{order.id}
                  </div>
                  <div>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.amount}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "New"
                      ? "bg-primary/10 text-primary"
                      : order.status === "Processing"
                      ? "bg-warning/10 text-warning"
                      : "bg-success/10 text-success"
                  }`}
                >
                  {order.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
