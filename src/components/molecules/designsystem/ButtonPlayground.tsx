"use client";

import React, { useState } from "react";
import { Button, type ButtonVariant, type ButtonAppearance, type ButtonSize, type ButtonShape } from "@/components/atoms/Button";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";
import { IconButton } from "@/components/atoms/IconButton";
import { RadioButton, RadioGroup } from "@/components/atoms/RadioButton";
import { Toggle } from "@/components/atoms/Toggle";
import { RiCheckLine, RiFileCopyLine, RiSettings4Line } from "@remixicon/react";

type ComponentType = "Button" | "TertiaryButton" | "IconButton";

const COMPONENTS: ComponentType[] = ["Button", "TertiaryButton", "IconButton"];
const VARIANTS: ButtonVariant[] = ["brand", "brand-gradient", "neutral", "danger", "warning", "success"];
const APPEARANCES: ButtonAppearance[] = ["filled", "tonal", "outline", "ghost", "inverted"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];
const SHAPES: ButtonShape[] = ["rounded", "pill"];

export default function ButtonPlayground() {
    const [componentType, setComponentType] = useState<ComponentType>("Button");
    const [variant, setVariant] = useState<ButtonVariant>("brand");
    const [appearance, setAppearance] = useState<ButtonAppearance>("filled");
    const [size, setSize] = useState<ButtonSize>("md");
    const [shape, setShape] = useState<ButtonShape>("rounded");
    
    const [isFlat, setIsFlat] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    
    const [hasLeadingIcon, setHasLeadingIcon] = useState(false);
    const [hasTrailingIcon, setHasTrailingIcon] = useState(false);

    const [copied, setCopied] = useState(false);

    const generateCode = () => {
        let code = `<${componentType}`;
        
        if (componentType === "IconButton") {
            code += ` aria-label="Settings"`;
            code += ` icon={<RiSettings4Line size={18} />}`;
        }

        if (variant !== "brand") code += ` variant="${variant}"`;
        if (componentType !== "TertiaryButton" && appearance !== "filled") code += ` appearance="${appearance}"`;
        if (size !== "md") code += ` size="${size}"`;
        if (componentType !== "TertiaryButton" && shape !== "rounded") code += ` shape="${shape}"`;
        
        if (isFlat) code += ` flat`;
        if (isLoading) code += ` loading`;
        if (isDisabled) code += ` disabled`;
        
        if (componentType !== "IconButton") {
            if (hasLeadingIcon) code += ` leadingIcon={<RiSettings4Line size={18} />}`;
            if (hasTrailingIcon) code += ` trailingIcon={<RiSettings4Line size={18} />}`;
        }

        if (componentType === "IconButton") {
            code += ` />`;
        } else {
            code += `>\n  Action\n</${componentType}>`;
        }
        return code;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const codeSnippet = generateCode();

    return (
        <div className="w-full flex flex-col xl:flex-row gap-8 items-start mb-16 p-8 rounded-[24px] bg-[rgba(255,255,255,0.015)] border border-white/5 relative z-10">
            {/* Left: Controls */}
            <div className="flex flex-col w-full xl:w-1/2 gap-8 pr-0 xl:pr-8 border-r-0 xl:border-r border-white/5">
                
                <div>
                    <h3 className="text-[11px] font-mono font-medium text-[var(--color-text-muted)] mb-4 uppercase tracking-[0.15em]">Component</h3>
                    <RadioGroup value={componentType} onChange={(v) => setComponentType(v as ComponentType)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {COMPONENTS.map(c => <RadioButton key={c} value={c} label={c.replace("Button", " Button")} />)}
                    </RadioGroup>
                </div>

                <div>
                    <h3 className="text-[11px] font-mono font-medium text-[var(--color-text-muted)] mb-4 uppercase tracking-[0.15em]">Variants</h3>
                    <RadioGroup value={variant} onChange={(v) => setVariant(v as ButtonVariant)} className="grid grid-cols-2 gap-3">
                        {VARIANTS.map(v => <RadioButton key={v} value={v} label={v} />)}
                    </RadioGroup>
                </div>
                
                {componentType !== "TertiaryButton" && (
                    <div>
                        <h3 className="text-[11px] font-mono font-medium text-[var(--color-text-muted)] mb-4 uppercase tracking-[0.15em]">Appearance</h3>
                        <RadioGroup value={appearance} onChange={(v) => setAppearance(v as ButtonAppearance)} className="grid grid-cols-2 gap-3">
                            {APPEARANCES.map(a => <RadioButton key={a} value={a} label={a} />)}
                        </RadioGroup>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-[11px] font-mono font-medium text-[var(--color-text-muted)] mb-4 uppercase tracking-[0.15em]">Size</h3>
                        <RadioGroup value={size} onChange={(v) => setSize(v as ButtonSize)} className="flex flex-col gap-3">
                            {SIZES.map(s => <RadioButton key={s} value={s} label={s} />)}
                        </RadioGroup>
                    </div>
                    {componentType !== "TertiaryButton" && (
                        <div>
                            <h3 className="text-[11px] font-mono font-medium text-[var(--color-text-muted)] mb-4 uppercase tracking-[0.15em]">Shape</h3>
                            <RadioGroup value={shape} onChange={(v) => setShape(v as ButtonShape)} className="flex flex-col gap-3">
                                {SHAPES.map(s => <RadioButton key={s} value={s} label={s} />)}
                            </RadioGroup>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <Toggle checked={isFlat} onChange={setIsFlat} label="Flat style" />
                    <Toggle checked={isLoading} onChange={setIsLoading} label="Loading state" />
                    <Toggle checked={isDisabled} onChange={setIsDisabled} label="Disabled" />
                    {componentType !== "IconButton" && (
                        <>
                            <Toggle checked={hasLeadingIcon} onChange={setHasLeadingIcon} label="Leading Icon" />
                            <Toggle checked={hasTrailingIcon} onChange={setHasTrailingIcon} label="Trailing Icon" />
                        </>
                    )}
                </div>
            </div>

            {/* Right: Preview & Code */}
            <div className="flex flex-col w-full xl:w-1/2 gap-8 sticky top-24">
                <div className="flex flex-col items-center justify-center p-16 rounded-[16px] bg-[#0a0a0b] border border-white/5 min-h-[280px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative z-10 flex items-center justify-center min-w-[200px]">
                        {componentType === "Button" && (
                            <Button
                                variant={variant}
                                appearance={appearance}
                                size={size}
                                shape={shape}
                                flat={isFlat}
                                loading={isLoading}
                                disabled={isDisabled}
                                leadingIcon={hasLeadingIcon ? <RiSettings4Line size={18} /> : undefined}
                                trailingIcon={hasTrailingIcon ? <RiSettings4Line size={18} /> : undefined}
                            >
                                Action
                            </Button>
                        )}
                        {componentType === "TertiaryButton" && (
                            <TertiaryButton
                                variant={variant}
                                size={size}
                                flat={isFlat}
                                loading={isLoading}
                                disabled={isDisabled}
                                leadingIcon={hasLeadingIcon ? <RiSettings4Line size={18} /> : undefined}
                                trailingIcon={hasTrailingIcon ? <RiSettings4Line size={18} /> : undefined}
                            >
                                Action
                            </TertiaryButton>
                        )}
                        {componentType === "IconButton" && (
                            <IconButton
                                aria-label="Settings"
                                icon={<RiSettings4Line size={18} />}
                                variant={variant}
                                appearance={appearance}
                                size={size}
                                shape={shape}
                                flat={isFlat}
                                loading={isLoading}
                                disabled={isDisabled}
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col relative group">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[11px] font-mono font-medium text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Code snippet</span>
                        <button
                            onClick={handleCopy}
                            className="text-xs flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-white transition-colors cursor-pointer"
                        >
                            {copied ? <RiCheckLine size={14} className="text-[var(--color-success)]" /> : <RiFileCopyLine size={14} />}
                            {copied ? "Copied" : "Copy code"}
                        </button>
                    </div>
                    <div className="relative">
                        <pre className="p-6 rounded-[16px] bg-[#050505] border border-white/5 overflow-x-auto text-[13px] text-zinc-300 font-mono leading-relaxed selection:bg-cyan-500/30 whitespace-pre-wrap shadow-inner">
                            {codeSnippet}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
