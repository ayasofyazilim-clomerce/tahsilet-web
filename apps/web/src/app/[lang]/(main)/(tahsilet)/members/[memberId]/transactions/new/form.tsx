"use client";

import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {cn} from "@/lib/utils";
import type {PosTerminal} from "@repo/actions/tahsilet/FaturaturkaService/actions";
import {getPosList} from "@repo/actions/tahsilet/FaturaturkaService/actions";
import {ping, startPayment} from "@repo/actions/tahsilet/FaturaturkaService/smart-pos";
import {postTransactionApi} from "@repo/actions/tahsilet/TahsiletService/post-actions";
import {zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {handlePostResponse} from "@repo/utils/api";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {useEffect, useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import PosTerminalSelector from "@/app/[lang]/(main)/(tahsilet)/members/_components/terminal-selector";

// Zod schema based on your DTO
const transactionFormSchema = z
  .object({
    memberId: z.string().uuid("Invalid UUID format"),
    transactionType: z.enum(["Credit", "Debit"]),
    transactionDate: z.date({
      required_error: "Transaction date is required",
    }),
    debit: z.number().nullable().optional(),
    credit: z.number().nullable().optional(),
    documentType: z.enum(["Invoice", "Check", "PromissoryNote", "CreditCard", "Cash"]).optional(),
  })
  .refine(
    (data) => {
      // Conditional validation: Credit type requires credit field, Debit type requires debit field
      if (data.transactionType === "Credit" && (!data.credit || data.credit <= 0)) {
        return false;
      }
      if (data.transactionType === "Debit" && (!data.debit || data.debit <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Credit transactions require a credit amount, Debit transactions require a debit amount",
      path: ["credit"], // This will show the error on the credit field, you might want to handle this differently
    },
  );

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export function TransactionForm({memberId, imToken, cmToken}: {memberId: string; imToken: string; cmToken: string}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [terminals, setTerminals] = useState<PosTerminal[]>([]);
  const [activeTerminal, setActiveTerminal] = useState<PosTerminal | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [disabledMessage, setDisabledMessage] = useState<string>("");
  const [formData, setFormData] = useState<TransactionFormValues>({
    memberId,
    transactionType: "Credit",
    transactionDate: new Date(),
    debit: null,
    credit: null,
  });
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: formData,
  });

  const transactionType = form.watch("transactionType");
  const documentType = form.watch("documentType");
  const creditAmount = form.watch("credit") || 0;
  const debitAmount = form.watch("debit") || 0;

  function onSubmit(data: TransactionFormValues) {
    startTransition(() => {
      const submitData = {
        ...data,
        transactionDate: data.transactionDate.toISOString() || new Date().toISOString(),
      };
      void postTransactionApi({
        requestBody: {
          ...submitData,
        },
      }).then((res) => {
        handlePostResponse(res, router, "../transactions");
      });
    });
  }

  function onChange(data: TransactionFormValues) {
    setFormData(data);
  }

  // Handle form submission wrapper to avoid eslint error
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void form.handleSubmit(onSubmit)(e);
  };

  // Handle form change wrapper to avoid eslint error
  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    void form.handleSubmit(onChange)(e);
  };

  useEffect(() => {
    if (documentType !== "CreditCard") setTerminals([]);
    else
      void getPosList({cmToken, imToken}).then((res) => {
        if (res.data) {
          setTerminals(res.data);
        }
      });
  }, [documentType, cmToken, imToken]);

  const handleTerminalSelect = (terminal: PosTerminal) => {
    setActiveTerminal(terminal); // Set immediately to show selection
    setDisabledMessage(`Connecting to ${terminal.name}...`);
    startTransition(async () => {
      try {
        setErrorMessage(null);

        const TransactionHandle = {
          Fingerprint: terminal.sourceFingerPrint,
          SerialNumber: terminal.sourceFingerPrint,
          TransactionSequence: null,
        };

        // Ping phase
        const pingResponse = await ping({
          Url: terminal.httpsUrl,
          TransactionHandle: {
            ...TransactionHandle,
            TransactionDate: new Date().toISOString(),
          },
        });

        if (pingResponse.HasError || pingResponse.HasAbondon) {
          setActiveTerminal(null); // Clear selection on error
          setErrorMessage(pingResponse.Message || "Failed to connect to terminal");
          return;
        }

        // Payment phase
        setDisabledMessage(`Processing payment on ${terminal.name}...`);

        const paymentResponse = await startPayment({
          Url: terminal.httpsUrl,
          Payment: {
            Amount: transactionType === "Credit" ? creditAmount : debitAmount,
            installmentCount: 1,
            minInstallmentCount: 1,
            maxInstallmentCount: 1,
            IsPfInstallmentEnabled: false,
            CurrencyCode: "TRY",
            AdditionalInfo: {
              print: true,
              receiptImage: true,
              customerReceiptImageEnabled: true,
              merchantReceiptImageEnabled: false,
              receiptWidth: "58mm",
              headUnmaskLength: 4,
              tailUnmaskLength: 4,
            },
          },
          TransactionHandle: {
            ...TransactionHandle,
            TransactionSequence: pingResponse.TransactionHandle.TransactionSequence,
            TransactionDate: new Date().toISOString(),
          },
        });

        if (paymentResponse.HasError || paymentResponse.HasAbondon) {
          setActiveTerminal(null); // Clear selection on error
          setErrorMessage(paymentResponse.Message || "Failed to process payment");
        } else {
          // Success - clear selection and show success state
          setActiveTerminal(null);
          setErrorMessage(null);
          onSubmit({
            ...formData,
            documentType: "CreditCard",
          });
        }
      } catch (error) {
        setActiveTerminal(null);
        setErrorMessage("An unexpected error occurred");
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onChange={handleChange} onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          disabled={isPending}
          name="transactionType"
          render={({field}) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Credit">Credit</SelectItem>
                  <SelectItem value="Debit">Debit</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          disabled={isPending}
          name="transactionDate"
          render={({field}) => (
            <FormItem className="flex flex-col">
              <FormLabel>Transaction Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button className={cn("w-full pl-3 text-left font-normal")} variant="outline">
                      {format(field.value, "PPP")}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    mode="single"
                    onSelect={field.onChange}
                    selected={field.value}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional Credit Field - Show only when transactionType is Credit */}
        {transactionType === "Credit" && (
          <FormField
            control={form.control}
            disabled={isPending}
            name="credit"
            render={({field}) => (
              <FormItem>
                <FormLabel>Credit Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter credit amount"
                    step="0.01"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value ? parseFloat(e.target.value) : null);
                    }}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Conditional Debit Field - Show only when transactionType is Debit */}
        {transactionType === "Debit" && (
          <FormField
            control={form.control}
            disabled={isPending}
            name="debit"
            render={({field}) => (
              <FormItem>
                <FormLabel>Debit Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter debit amount"
                    step="0.01"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value ? parseFloat(e.target.value) : null);
                    }}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          disabled={isPending}
          name="documentType"
          render={({field}) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="PromissoryNote">Promissory Note</SelectItem>
                  <SelectItem value="CreditCard">Credit Card</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {documentType === "CreditCard" && (
          <div>
            {terminals.length > 0 && (
              <PosTerminalSelector
                disabled={isPending}
                disabledMessage={disabledMessage}
                onSelect={handleTerminalSelect}
                selectedTerminalId={activeTerminal?.id || null}
                terminals={terminals}
              />
            )}
            {errorMessage ? (
              <div className="text-sm text-rose-500">
                <span>{errorMessage}</span>
              </div>
            ) : null}
          </div>
        )}
        {documentType !== "CreditCard" && (
          <Button disabled={isPending} type="submit">
            Submit Transaction
          </Button>
        )}
      </form>
    </Form>
  );
}
