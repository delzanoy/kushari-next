"use client";

import { useState, type FormEvent } from "react";
import { RiCloseLine, RiUserAddLine } from "@remixicon/react";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { TextInput } from "@/components/atoms/TextInput";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/atoms/Dropdown";
import { MODAL_WIDTH } from "@/components/molecules/modal/Modal";

const ROLES = ["Approver", "Admin", "Viewer"] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface InviteMemberModalProps {
  onClose: () => void;
  onInvite: (email: string, role: string) => void;
}

/** Settings › Members: invite someone by email. Open it inside the shared `Modal`. */
export function InviteMemberModal({ onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("Approver");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setEmailError("Enter the email address of the person you're inviting");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setEmailError("Enter a full email address, like name@company.com");
      return;
    }
    onInvite(value, role);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`flex ${MODAL_WIDTH.small} p-6 flex-col items-start gap-8 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] shadow-[var(--shadow-2xl)]`}
    >
      <div className="flex flex-col items-start gap-2 self-stretch">
        <div className="flex justify-between items-start self-stretch">
          <div className="flex p-2 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.06)]">
            <RiUserAddLine size={24} className="text-[var(--color-text-primary)]" />
          </div>
          <IconButton
            icon={<RiCloseLine />}
            size="sm"
            variant="neutral"
            appearance="ghost"
            onClick={onClose}
            aria-label="Close modal"
          />
        </div>
        <h2 className="text-[var(--color-text-primary)] text-xl font-medium tracking-tight mt-2">
          Invite new member
        </h2>
      </div>

      <div className="flex flex-col items-start gap-6 self-stretch">
        <TextInput
          label="Email address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          state={emailError ? "error" : "default"}
          errorMessage={emailError}
        />

        <div className="w-full">
          <Dropdown label="Role">
            <DropdownTrigger placeholder="Select role" label={role} />
            <DropdownMenu minWidth={372}>
              {ROLES.map((r) => (
                <DropdownItem key={r} selected={role === r} onSelect={() => setRole(r)}>
                  {r}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 self-stretch">
        <Button variant="neutral" appearance="filled" size="sm" flat type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="brand" appearance="filled" size="sm" type="submit">
          Send invite
        </Button>
      </div>
    </form>
  );
}
