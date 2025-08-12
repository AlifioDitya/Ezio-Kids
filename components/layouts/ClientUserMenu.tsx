// components/layouts/ClientUserMenu.tsx
"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function ClientUserMenu() {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <div className="cursor-pointer text-gray-700 hover:text-red-600 transition font-semibold">
            Sign In
          </div>
        </SignInButton>
      </SignedOut>
    </>
  );
}
