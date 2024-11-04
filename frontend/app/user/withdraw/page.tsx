"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  CreditCard,
  Building2,
  Wallet,
  Clock,
  AlertCircle,
  ChevronRight,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app, this would come from an API
const mockAccounts = [
  {
    id: "1",
    type: "checking",
    bankName: "Chase",
    lastFour: "4567",
    isPrimary: true,
  },
  {
    id: "2",
    type: "savings",
    bankName: "Bank of America",
    lastFour: "8901",
    isPrimary: false,
  },
  {
    id: "3",
    type: "card",
    bankName: "Citi",
    lastFour: "2345",
    isPrimary: false,
  },
];

const mockTransactions = [
  {
    id: "1",
    date: "2024-03-20",
    amount: 500,
    account: "Chase ****4567",
    status: "completed",
  },
  {
    id: "2",
    date: "2024-03-15",
    amount: 1000,
    account: "Bank of America ****8901",
    status: "processing",
  },
  {
    id: "3",
    date: "2024-03-10",
    amount: 250,
    account: "Citi ****2345",
    status: "completed",
  },
];

const withdrawalSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount greater than 0",
  }),
  account: z.string({
    required_error: "Please select an account",
  }),
});

export default function WithdrawPage() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState(mockAccounts);
  const [balance] = useState(5000); // Mock balance

  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: "",
      account: "",
    },
  });

  const onSubmit = (values: z.infer<typeof withdrawalSchema>) => {
    // Mock withdrawal process
    toast({
      title: "Withdrawal Initiated",
      description: `$${values.amount} will be sent to your selected account.`,
    });
    form.reset();
  };

  const handleSetPrimary = (accountId: string) => {
    setAccounts(
      accounts.map((acc) => ({
        ...acc,
        isPrimary: acc.id === accountId,
      }))
    );
    toast({
      title: "Primary Account Updated",
      description: "Your primary withdrawal account has been updated.",
    });
  };

  const handleRemoveAccount = (accountId: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== accountId));
    toast({
      title: "Account Removed",
      description: "The bank account has been removed successfully.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Balance Card */}
        <Card className="md:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white text-4xl font-bold">
              ${balance.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="md:row-span-2">
          <CardHeader>
            <CardTitle>Make a Withdrawal</CardTitle>
            <CardDescription>
              Transfer money to your linked account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input
                            className="pl-6"
                            placeholder="0.00"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="account"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Withdrawal Account</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.bankName} ****{account.lastFour}
                              {account.isPrimary && " (Primary)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Estimated arrival: 1-3 business days
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Fee: $0.00 for standard transfer
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Withdraw Funds
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Linked Accounts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Linked Accounts</CardTitle>
              <CardDescription>Manage your withdrawal accounts</CardDescription>
            </div>
            <Button variant="outline" className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {account.type === "card" ? (
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      ) : (
                        <Building2 className="h-6 w-6 text-blue-600" />
                      )}
                      <div>
                        <p className="font-medium">
                          {account.bankName}{" "}
                          <span className="text-muted-foreground">
                            ****{account.lastFour}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {account.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {account.isPrimary ? (
                        <Badge variant="secondary">Primary</Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetPrimary(account.id)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Account</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this account? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveAccount(account.id)}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Withdrawals */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Withdrawals</CardTitle>
            <CardDescription>Your withdrawal history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {format(new Date(tx.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>${tx.amount.toLocaleString()}</TableCell>
                    <TableCell>{tx.account}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
