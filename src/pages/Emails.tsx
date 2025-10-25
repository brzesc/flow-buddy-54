import { Card } from "@/components/ui/card";

export default function Emails() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emails</h1>
        <p className="text-muted-foreground">
          View and manage customer communications
        </p>
      </div>

      <Card className="shadow-soft p-8">
        <div className="text-center text-muted-foreground">
          Email management coming soon...
        </div>
      </Card>
    </div>
  );
}
