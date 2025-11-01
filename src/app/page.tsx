import { ThemeToggle } from "@/components/ThemeToggle";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <SignInButton />
      <UserButton />
      <ThemeToggle />
    </>
  )
}