import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col p-6">
      <header className="flex items-center justify-end gap-3">
        <Show when="signed-out">
          <SignInButton>
            <button className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Sign up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-sm leading-loose">
        <h1 className="text-5xl font-medium">Townhall.vote</h1>
        <p>Coming Soon</p>
      </div>
    </main>
  )
}
