"use client";

import React, { useRef, useMemo } from "react";

interface CodeEditorFallbackProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
}

export function CodeEditorFallback({
  value,
  onChange,
  language = "javascript",
  placeholder = "Write your solution here...",
}: CodeEditorFallbackProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(() => {
    const count = (value || "").split("\n").length;
    return Array.from({ length: Math.max(count, 15) }, (_, i) => i + 1);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);
      // Restore cursor position after inserted spaces
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div className="relative flex h-full w-full bg-slate-950 font-mono text-xs leading-5 select-text overflow-hidden border border-slate-800">
      {/* Line Numbers Column */}
      <div
        ref={lineNumbersRef}
        aria-hidden="true"
        className="shrink-0 select-none bg-slate-950/80 px-3 py-3 text-right text-slate-600 border-r border-slate-800/80 overflow-hidden font-mono text-[11px]"
        style={{ width: "48px" }}
      >
        {lines.map((num) => (
          <div key={num} className="h-5 leading-5 text-slate-600">
            {num}
          </div>
        ))}
      </div>

      {/* Code Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        placeholder={placeholder}
        className="flex-1 h-full w-full resize-none bg-transparent p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono text-xs leading-5 overflow-auto selection:bg-emerald-900/60 selection:text-white"
        style={{
          tabSize: 2,
        }}
      />
    </div>
  );
}
