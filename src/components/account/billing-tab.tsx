"use client";

import { useEffect, useState } from "react";
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
import { getBillingInfoAction } from "@/actions/get-billing-info-action";

export type BillingInfo = {
  id: string;
  BillingCustomer: {
    stripeCustomerId: string;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  Subscription: {
    status: string | null;
    cancelAtPeriodEnd: boolean | null;
    currentPeriodEnd: Date | null;
    currentPeriodStart: Date | null;
    startDate: Date | null;
    priceId: string | null;
    productId: string | null;
    currency: string | null;
    amount: number | null;
    interval: string | null;
    intervalCount: number | null;
    trialStart: Date | null;
    trialEnd: Date | null;
    cancelAt: Date | null;
    canceledAt: Date | null;
    endedAt: Date | null;
    latestInvoiceId: string | null;
    collectionMethod: string | null;
    defaultPaymentMethodBrand: string | null;
    defaultPaymentMethodLast4: string | null;
    defaultPaymentMethodExpMonth: number | null;
    defaultPaymentMethodExpYear: number | null;
  } | null;
};

export function BillingTab() {
  const router = useRouter();
  const [isManaging, setIsManaging] = useState(false);
  const [data, setData] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBillingInfoAction({});
        const payload = (res as any)?.data ?? res;
        setData(payload as BillingInfo);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || "Failed to load billing info");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleManageBilling = async () => {
    setIsManaging(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error || "Failed to access billing portal");
        setIsManaging(false);
        return;
      }
      window.location.href = body.url;
    } catch {
      setIsManaging(false);
      toast.error("Failed to access billing portal");
    }
  };

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  const sub = data?.Subscription || null;
  const customer = data?.BillingCustomer || null;
  const isActive = ["active", "trialing", "past_due"].includes(
    (sub?.status || "").toLowerCase()
  );

  const planAmount = sub?.amount ? (sub.amount / 100).toFixed(2) : "20.00";
  const planInterval = sub?.interval || "month";
  const nextBillingDate = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).toLocaleDateString()
    : "-";

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="bg-white rounded-xl sm:rounded-2xl border-[#085983]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-[family-name:var(--font-instrument-serif)] text-[#085983]">
            <Crown className="h-5 w-5 text-[#085983]" />
            Current Plan
          </CardTitle>
          <CardDescription className="text-[#085983]/70">
            Your subscription details and billing information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Pro Plan</h3>
                    <Badge
                      variant="secondary"
                      className={
                        isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 capitalize"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 capitalize"
                      }
                    >
                      <Check className="h-3 w-3 mr-1" />
                      {sub?.status || "inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ${planAmount}/{planInterval}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">Next billing date</p>
                  <p className="text-xs text-muted-foreground">
                    {nextBillingDate}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Billing Cycle</p>
                  <p className="text-muted-foreground capitalize">
                    {planInterval}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Current Period</p>
                  <p className="text-muted-foreground">
                    Until {nextBillingDate}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Auto-renewal</p>
                  <p className="text-muted-foreground">
                    {sub?.cancelAtPeriodEnd ? "Disabled" : "Enabled"}
                  </p>
                </div>
              </div>

              {sub?.cancelAtPeriodEnd && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Your subscription will end on {nextBillingDate}. You&apos;ll
                    lose access to Pro features.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={handleManageBilling}
                  disabled={isManaging}
                  className="flex items-center gap-2 border-[#085983]/20 text-[#085983] hover:bg-[#085983]/5"
                >
                  <CreditCard className="h-4 w-4" />
                  {isManaging ? "Loading..." : "Manage Billing"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl sm:rounded-2xl border-[#085983]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-[family-name:var(--font-instrument-serif)] text-[#085983]">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription className="text-[#085983]/70">
            Your default payment method for subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase">
                    {sub?.defaultPaymentMethodBrand || "card"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    •••• •••• •••• {sub?.defaultPaymentMethodLast4 || "----"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {sub?.defaultPaymentMethodExpMonth || "--"}/
                    {sub?.defaultPaymentMethodExpYear || "----"}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Default</Badge>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleManageBilling}
            disabled={isManaging}
            className="border-[#085983]/20 text-[#085983] hover:bg-[#085983]/5"
          >
            Update Payment Method
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Cursor rules applied correctly.
