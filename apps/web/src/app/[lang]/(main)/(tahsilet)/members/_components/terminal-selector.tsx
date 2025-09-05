"use client";

import type {PosTerminal} from "@repo/actions/tahsilet/FaturaturkaService/actions";
import {useCallback} from "react";

interface PosTerminalSelectorProps {
  terminals: PosTerminal[];
  onSelect: (terminal: PosTerminal) => void;
  disabled?: boolean;
  disabledMessage?: string;
  selectedTerminalId?: number | null;
}

export default function PosTerminalSelector({
  terminals,
  onSelect,
  disabled = false,
  disabledMessage = "Selection is currently disabled",
  selectedTerminalId = null,
}: PosTerminalSelectorProps) {
  const handleTerminalSelect = useCallback(
    (terminal: PosTerminal) => {
      if (disabled) return;
      onSelect(terminal);
    },
    [disabled, onSelect],
  );

  const isTerminalDisabled = useCallback(
    (terminal: PosTerminal): boolean => {
      return disabled || (selectedTerminalId !== null && selectedTerminalId !== terminal.id);
    },
    [disabled, selectedTerminalId],
  );

  const getCardClassName = useCallback(
    (terminal: PosTerminal): string => {
      const isSelected = selectedTerminalId === terminal.id;
      const isDisabled = isTerminalDisabled(terminal);

      let className = "border rounded-lg p-4 transition-all duration-200 relative overflow-hidden ";

      if (isSelected) {
        className += "border-blue-500 bg-blue-50 shadow-md ";
      } else if (isDisabled) {
        className += "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed ";
      } else {
        className += "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm cursor-pointer ";
      }

      return className;
    },
    [selectedTerminalId, isTerminalDisabled],
  );

  if (terminals.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <Header
        activeTerminals={terminals.filter((t) => t.isActive).length}
        disabled={disabled}
        disabledMessage={disabledMessage}
        totalTerminals={terminals.length}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {terminals.map((terminal) => (
          <TerminalCard
            className={getCardClassName(terminal)}
            disabledMessage={disabledMessage}
            isDisabled={isTerminalDisabled(terminal)}
            isSelected={selectedTerminalId === terminal.id}
            key={terminal.id}
            onClick={() => {
              handleTerminalSelect(terminal);
            }}
            terminal={terminal}
          />
        ))}
      </div>
    </div>
  );
}

interface HeaderProps {
  disabled: boolean;
  disabledMessage: string;
  totalTerminals: number;
  activeTerminals: number;
}

function Header({disabled, disabledMessage, totalTerminals, activeTerminals}: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Select POS Terminal</h2>
        {disabled ? (
          <p className="mt-1 flex items-center space-x-2 text-sm text-blue-600">
            <LoadingSpinner size="sm" />
            <span>{disabledMessage}</span>
          </p>
        ) : null}
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-500">Total: {totalTerminals}</div>
        <div className="text-xs text-green-600">Active: {activeTerminals}</div>
      </div>
    </div>
  );
}

interface TerminalCardProps {
  terminal: PosTerminal;
  isSelected: boolean;
  isDisabled: boolean;
  className: string;
  onClick: () => void;
  disabledMessage: string;
}

function TerminalCard({terminal, isSelected, isDisabled, className, onClick, disabledMessage}: TerminalCardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      title={isDisabled ? disabledMessage : `Click to select ${terminal.name}`}>
      <div className="mb-3 flex items-start justify-between">
        <h3 className="truncate pr-2 text-lg font-semibold text-gray-900">{terminal.name}</h3>
        <div className="flex flex-shrink-0 items-center space-x-2">
          <StatusBadge isActive={terminal.isActive} />
          {isSelected ? <span className="text-sm font-medium text-blue-600">✓ Selected</span> : null}
        </div>
      </div>

      <div className="mb-3 space-y-2 text-sm text-gray-600">
        <TerminalInfo label="Application" value={terminal.applicationName} />
        <TerminalInfo label="Source" value={terminal.sourceReference} />
        <div className="pt-1 text-xs text-gray-500">
          Updated:{" "}
          {new Date(terminal.updatedOn).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Processing Overlay for Selected Terminal */}
      {isSelected && isDisabled ? <ProcessingOverlay /> : null}
    </div>
  );
}

function TerminalInfo({label, value}: {label: string; value: string}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}:</span>
      <span className="ml-2 truncate font-medium">{value}</span>
    </div>
  );
}

function StatusBadge({isActive}: {isActive: boolean}) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${
        isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
      }`}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function LoadingSpinner({size = "md"}: {size?: "sm" | "md" | "lg"}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`} />;
}

function ProcessingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-blue-50 bg-opacity-95 opacity-70 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-blue-700">Processing...</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Select POS Terminal</h2>
        <div className="text-sm text-gray-500">Total: 0</div>
      </div>
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl text-gray-400">📱</div>
        <p className="text-lg text-gray-500">No terminals available</p>
        <p className="mt-2 text-sm text-gray-400">Check your connection or contact support</p>
      </div>
    </div>
  );
}
