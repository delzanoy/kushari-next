import React from 'react';
import { Button } from '@/components/atoms/Button';

interface FeatureUnderDevelopmentProps {
    onClose?: () => void;
}

export default function FeatureUnderDevelopment({ onClose }: FeatureUnderDevelopmentProps) {
    return (
        <div className="flex w-[400px] p-4 flex-col items-center gap-6 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] shadow-2xl relative">
            <div className="flex flex-col items-center gap-2">
                <span className="text-[var(--color-text-primary)] text-xl font-medium tracking-tight">
                    Coming Soon
                </span>
                <span className="text-[var(--color-text-muted)] text-center">
                    This feature is currently under development.
                </span>
            </div>
            {onClose && (
                <Button
                    size="md"
                    variant="brand"
                    appearance="filled"
                    onClick={onClose}
                    className="w-full justify-center"
                >
                    Got it
                </Button>
            )}
        </div>
    );
}
