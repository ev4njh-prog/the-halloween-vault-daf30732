// src/components/streaming-filter-modal.tsx
"use client";

import React from "react";
import { ALL_STREAMING_PROVIDERS, StreamingProviderId } from "@/data/seasonal";
import { useStreaming } from "@/hooks/use-streaming";

interface StreamingFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StreamingFilterModal({ isOpen, onClose }: StreamingFilterModalProps) {
  const { selectedProviders, toggleProvider, selectAll, clearAll } = useStreaming();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-tight text-amber-500">
            Streaming Subscriptions
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-400">
          Select the services you subscribe to. We'll filter the Vault to show titles available on your active platforms.
        </p>

        <div className="flex items-center justify-between my-4 text-xs">
          <button
            onClick={selectAll}
            className="text-amber-400 hover:text-amber-300 font-medium underline"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-slate-500 hover:text-slate-400 font-medium underline"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
          {ALL_STREAMING_PROVIDERS.map((provider) => {
            const isSelected = selectedProviders.includes(provider.id as StreamingProviderId);
            return (
              <button
                key={provider.id}
                onClick={() => toggleProvider(provider.id as StreamingProviderId)}
                className={`flex items-center justify-between p-3 rounded-lg border text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/50 text-amber-300"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
                }`}
              >
                <span>{provider.name}</span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isSelected ? "bg-amber-500 text-slate-950 font-bold" : "border border-slate-600"
                  }`}
                >
                  {isSelected && "✓"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
