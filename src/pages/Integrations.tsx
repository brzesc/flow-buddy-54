import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Mail, FileText } from "lucide-react";

const integrations = [
  {
    name: "Shopify",
    description: "Sync orders and customers from your Shopify store",
    icon: ShoppingBag,
    status: "connected",
    lastSync: "2 hours ago",
  },
  {
    name: "Email (IMAP)",
    description: "Connect your email to link messages with orders",
    icon: Mail,
    status: "connected",
    lastSync: "5 minutes ago",
  },
  {
    name: "wFirma",
    description: "Generate invoices automatically",
    icon: FileText,
    status: "connected",
    lastSync: "1 hour ago",
  },
];

export default function Integrations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Manage your connected services
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.name} className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <integration.icon className="h-8 w-8 text-primary" />
                <Badge
                  variant="outline"
                  className={
                    integration.status === "connected"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {integration.status}
                </Badge>
              </div>
              <CardTitle>{integration.name}</CardTitle>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Last sync: {integration.lastSync}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Configure
                </Button>
                <Button size="sm" className="flex-1">
                  Sync Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
