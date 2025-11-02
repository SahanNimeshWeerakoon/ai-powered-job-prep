import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <SignIn 
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                fallbackRedirectUrl="/app"
                forceRedirectUrl="/app"
            />
        </div>
    )
}