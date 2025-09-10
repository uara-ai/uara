"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  AlertCircle,
  Check,
  Crown,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function BillingTab() {
  const router = useRouter();
  const [isManaging, setIsManaging] = useState(false);

  // Mock subscription data - in real app, this would come from your billing provider
  const subscription = {
    status: "active",
    plan: "Pro",
    amount: 29,
    currency: "USD",
    billingCycle: "monthly",
    currentPeriodEnd: "2024-02-15",
    nextBillingDate: "2024-02-15",
    cancelAtPeriodEnd: false,
  };

  const paymentMethod = {
    type: "card",
    last4: "4242",
    brand: "visa",
    expiryMonth: 12,
    expiryYear: 2025,
  };

  const handleManageBilling = async () => {
    setIsManaging(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to access billing portal");
        setIsManaging(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setIsManaging(false);
      toast.error("Failed to access billing portal");
    }
  };

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  const recentInvoices = [
    {
      id: "inv_001",
      date: "2024-01-15",
      amount: 29,
      status: "paid",
      downloadUrl: "#",
    },
    {
      id: "inv_002",
      date: "2023-12-15",
      amount: 29,
      status: "paid",
      downloadUrl: "#",
    },
    {
      id: "inv_003",
      date: "2023-11-15",
      amount: 29,
      status: "paid",
      downloadUrl: "#",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your subscription details and billing information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {subscription.plan} Plan
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                >
                  <Check className="h-3 w-3 mr-1" />
                  {subscription.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                ${subscription.amount}/{subscription.billingCycle}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Next billing date</p>
              <p className="text-sm text-muted-foreground">
                {new Date(subscription.nextBillingDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Billing Cycle</p>
              <p className="text-muted-foreground capitalize">
                {subscription.billingCycle}
              </p>
            </div>
            <div>
              <p className="font-medium">Current Period</p>
              <p className="text-muted-foreground">
                Until{" "}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-medium">Auto-renewal</p>
              <p className="text-muted-foreground">
                {subscription.cancelAtPeriodEnd ? "Disabled" : "Enabled"}
              </p>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Your subscription will end on{" "}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                You&apos;ll lose access to Pro features.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleUpgrade} className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Upgrade Plan
            </Button>
            <Button
              variant="outline"
              onClick={handleManageBilling}
              disabled={isManaging}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              {isManaging ? "Loading..." : "Manage Billing"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>
            Your default payment method for subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase">
                  {paymentMethod.brand}
                </span>
              </div>
              <div>
                <p className="font-medium">
                  •••• •••• •••• {paymentMethod.last4}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                </p>
              </div>
            </div>
            <Badge variant="secondary">Default</Badge>
          </div>

          <Button variant="outline" size="sm">
            Update Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            Download your invoices and view payment history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">${invoice.amount}.00</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      invoice.status === "paid" ? "secondary" : "destructive"
                    }
                    className={
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : ""
                    }
                  >
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button variant="outline" size="sm">
              View All Invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage & Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>
            Track your usage against plan limits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">AI Chat Messages</span>
              <span className="text-sm text-muted-foreground">Unlimited</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Health Data Storage</span>
              <span className="text-sm text-muted-foreground">Unlimited</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Lab Report Analysis</span>
              <span className="text-sm text-muted-foreground">Unlimited</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Wearable Integrations</span>
              <span className="text-sm text-muted-foreground">5 devices</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Cursor rules applied correctly.
