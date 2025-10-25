import { Card } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application preferences
        </p>
      </div>

      <Card className="shadow-soft p-8">
        <div className="text-center text-muted-foreground">
          Settings panel coming soon...
        </div>
      </Card>
    </div>
  );
}
