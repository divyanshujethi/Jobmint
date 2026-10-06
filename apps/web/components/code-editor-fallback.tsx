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
    return Array.from({ length: Math.max(count, 18) }, (_, i) => i + 1);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    // 1. Tab Key -> 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
      return;
    }

    // 2. Enter Key -> Auto Indent
    if (e.key === "Enter") {
      e.preventDefault();
      const lineBeforeCursor = value.substring(0, start).split("\n").pop() || "";
      const matchIndent = lineBeforeCursor.match(/^\s*/);
      let indent = matchIndent ? matchIndent[0] : "";
      
      // If line ends with opening brace/parenthesis, increase indent by 2 spaces
      const trimmed = lineBeforeCursor.trim();
      const addsExtraIndent = trimmed.endsWith("{") || trimmed.endsWith("(") || trimmed.endsWith("[");
      if (addsExtraIndent) {
        indent += "  ";
      }

      const newValue = value.substring(0, start) + "\n" + indent + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 1 + indent.length;
      });
      return;
    }

    // 3. Auto-close brackets & quotes
    const PAIRS: Record<string, string> = {
      "(": ")",
      "{": "}",
      "[": "]",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    if (PAIRS[e.key]) {
      e.preventDefault();
      const closeChar = PAIRS[e.key];
      const selectedText = value.substring(start, end);
      const newValue = value.substring(0, start) + e.key + selectedText + closeChar + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        target.selectionStart = start + 1;
        target.selectionEnd = start + 1 + selectedText.length;
      });
      return;
    }

    // 4. Backspace -> Delete matching pair
    if (e.key === "Backspace" && start === end && start > 0) {
      const prevChar = value[start - 1];
      const nextChar = value[start];
      if (
        (prevChar === "(" && nextChar === ")") ||
        (prevChar === "{" && nextChar === "}") ||
        (prevChar === "[" && nextChar === "]") ||
        (prevChar === '"' && nextChar === '"') ||
        (prevChar === "'" && nextChar === "'") ||
        (prevChar === "`" && nextChar === "`")
      ) {
        e.preventDefault();
        const newValue = value.substring(0, start - 1) + value.substring(start + 1);
        onChange(newValue);
        requestAnimationFrame(() => {
          target.selectionStart = target.selectionEnd = start - 1;
        });
        return;
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div className="relative flex h-full w-full bg-[#181818] font-mono text-[13px] leading-5 select-text overflow-hidden border border-neutral-800 rounded-none shadow-inner">
      {/* Line Numbers Column */}
      <div
        ref={lineNumbersRef}
        aria-hidden="true"
        className="shrink-0 select-none bg-[#141414] px-2.5 py-3 text-right text-neutral-600 border-r border-neutral-800/80 overflow-hidden font-mono text-[11px]"
        style={{ width: "44px" }}
      >
        {lines.map((num) => (
          <div key={num} className="h-5 leading-5 text-neutral-600 hover:text-neutral-400 transition-colors">
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
        className="flex-1 h-full w-full resize-none bg-transparent p-3 text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden font-mono text-[13px] leading-5 overflow-auto selection:bg-amber-500/30 selection:text-white"
        style={{
          tabSize: 2,
        }}
      />
    </div>
  );
}
