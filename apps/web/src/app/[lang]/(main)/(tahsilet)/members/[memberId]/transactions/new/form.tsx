"use client";

import type {TahsilEt_Transactions_CreateTransactionDto} from "@repo/saas/TAHSILETService";
import {$TahsilEt_Transactions_CreateTransactionDto} from "@repo/saas/TAHSILETService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useEffect, useState, useTransition} from "react";
import {postTransactionApi} from "@repo/actions/tahsilet/TahsiletService/post-actions";
import {Button} from "@/components/ui/button";
import type {PosTerminal} from "@repo/actions/tahsilet/FaturaturkaService/actions";
import {getPosList} from "@repo/actions/tahsilet/FaturaturkaService/actions";
import {ping, startPayment} from "@repo/actions/tahsilet/FaturaturkaService/smart-pos";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import PosTerminalSelector from "@/app/[lang]/(main)/(tahsilet)/members/_components/terminal-selector";

export default function Form({
  languageData,
  memberId,
  imToken,
  cmToken,
}: {
  languageData: IdentityServiceResource;
  memberId: string;
  imToken: string;
  cmToken: string;
}) {
  const router = useRouter();
  const [terminals, setTerminals] = useState<PosTerminal[]>([]);
  const [activeTerminal, setActiveTerminal] = useState<PosTerminal | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [disabledMessage, setDisabledMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<TahsilEt_Transactions_CreateTransactionDto>({
    transactionType: "Debit",
    memberId,
    transactionDate: new Date().toISOString(),
  });

  const uiSchema = createUiSchemaWithResource({
    schema: $TahsilEt_Transactions_CreateTransactionDto,
    resources: languageData,
    name: "Form.Transaction",
    extend: {
      credit: {
        dependencies: [
          {
            target: "transactionType",
            type: DependencyType.HIDES,
            when: (transactionType: string) => transactionType === "Debit",
          },
        ],
      },
      debit: {
        dependencies: [
          {
            target: "transactionType",
            type: DependencyType.HIDES,
            when: (transactionType: string) => transactionType === "Credit",
          },
        ],
      },
    },
  });
  useEffect(() => {
    if (formData.documentType !== "CreditCard") setTerminals([]);
    else
      void getPosList({cmToken, imToken}).then((res) => {
        if (res.data) {
          setTerminals(res.data);
        }
      });
  }, [formData]);

  function handleSave() {
    void postTransactionApi({
      requestBody: {
        ...formData,
        memberId,
      },
    }).then((res) => {
      handlePostResponse(res, router, "../transactions");
    });
  }

  return (
    <div className="grid items-center gap-4">
      <SchemaForm<TahsilEt_Transactions_CreateTransactionDto>
        className="flex flex-col gap-4"
        disabled={isPending}
        filter={{
          type: "include",
          sort: true,
          keys: ["transactionType", "transactionDate", "debit", "credit", "documentType"],
        }}
        formData={formData}
        onChange={({formData: editedFormData}) => {
          if (!editedFormData) return;
          setFormData(editedFormData);
        }}
        onSubmit={({formData: submitFormData}) => {
          if (!submitFormData) return;
          setFormData(submitFormData);
        }}
        schema={$TahsilEt_Transactions_CreateTransactionDto}
        useDefaultSubmit={false}
        withScrollArea={false}
        uiSchema={uiSchema}
        // useDependency
      >
        {terminals.length > 0 && (
          <PosTerminalSelector
            disabled={isPending}
            disabledMessage={disabledMessage}
            onSelect={(terminal) => {
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
                      Amount: (formData.transactionType === "Credit" ? formData.credit : formData.debit) || 0,
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
                    handleSave();
                  }
                } catch (error) {
                  setActiveTerminal(null);
                  setErrorMessage("An unexpected error occurred");
                }
              });
            }}
            selectedTerminalId={activeTerminal?.id || null}
            terminals={terminals}
          />
        )}
        {errorMessage ? (
          <div className="text-sm text-rose-500">
            <span>{errorMessage}</span>
          </div>
        ) : null}
      </SchemaForm>
      {formData.documentType !== "CreditCard" && (
        <Button
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              handleSave();
            });
          }}
          type="button">
          {languageData.Save}
        </Button>
      )}
    </div>
  );
}
