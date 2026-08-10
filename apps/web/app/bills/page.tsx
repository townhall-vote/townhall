"use client"

import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import Link from "next/link"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { useAction } from "convex/react"
import { makeFunctionReference } from "convex/server"
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Loader2,
  Search,
  Send,
  Sparkles,
} from "lucide-react"

import "../theme.css"
import { LlmMarkdown } from "../../components/llm-markdown"
import { themeFontVariables } from "../fonts"

interface LatestAction {
  actionDate?: string
  text?: string
}

interface BillSummary {
  text?: string
}

interface BillTextFormat {
  type: string
  url: string
}

interface BillListItem {
  congress: number
  type: string
  number: string
  title?: string
  latestAction?: LatestAction
  updateDate?: string
}

interface BillDetail extends BillListItem {
  introducedDate?: string
  sponsors?: unknown[]
  summary?: BillSummary
  text?: {
    version: string
    date: string
    formats: BillTextFormat[]
  }
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

type View = "list" | "detail"

type InterpretBillArgs = {
  billIdentifier: string
  billTitle: string
  billText: string
}

const interpretBillAction = makeFunctionReference<
  "action",
  InterpretBillArgs,
  string
>("interpretBill:interpret")

export default function BillsPage() {
  const runInterpretBill = useAction(interpretBillAction)

  const [bills, setBills] = useState<BillListItem[]>([])
  const [billsLoading, setBillsLoading] = useState(false)
  const [billsError, setBillsError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<View>("list")

  const [billDetail, setBillDetail] = useState<BillDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const [interpretation, setInterpretation] = useState<string | null>(null)
  const [interpreting, setInterpreting] = useState(false)
  const [interpretError, setInterpretError] = useState<string | null>(null)

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatSending, setChatSending] = useState(false)
  const conversationHistory = useRef<{ role: "user" | "assistant"; content: string }[]>([])

  async function loadBills() {
    setBillsLoading(true)
    setBillsError(null)
    try {
      const response = await fetch("/api/bills")
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch bills")
      }
      setBills(data.bills ?? [])
    } catch (error) {
      console.error("Error loading bills:", error)
      setBillsError("Couldn't load bills. Please try again.")
    } finally {
      setBillsLoading(false)
      setHasLoaded(true)
    }
  }

  const filteredBills = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (term.length === 0) return bills
    return bills.filter((bill) => {
      const number = bill.number?.toLowerCase() ?? ""
      const title = (bill.title ?? "").toLowerCase()
      return number.includes(term) || title.includes(term)
    })
  }, [bills, searchTerm])

  async function openBill(bill: BillListItem) {
    setView("detail")
    setBillDetail(null)
    setDetailError(null)
    setInterpretation(null)
    setInterpretError(null)
    setChatMessages([])
    conversationHistory.current = []
    setDetailLoading(true)

    const congress = bill.congress
    const type = bill.type?.toLowerCase()
    const number = bill.number?.replace(/\D/g, "")

    try {
      const response = await fetch(`/api/bill/${congress}/${type}/${number}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch bill details")
      }
      setBillDetail({ ...bill, ...data.bill })
    } catch (error) {
      console.error("Error loading bill details:", error)
      setDetailError("Couldn't load this bill's details. Please try again.")
    } finally {
      setDetailLoading(false)
    }
  }

  function backToList() {
    setView("list")
  }

  async function interpretBill() {
    if (!billDetail) return
    setInterpreting(true)
    setInterpretError(null)
    try {
      const billContent = billDetail.summary?.text || billDetail.title || "No text available"
      const interpretation = await runInterpretBill({
        billIdentifier: `${billDetail.congress}/${billDetail.type.toLowerCase()}/${billDetail.number.replace(/\D/g, "")}`,
        billTitle: billDetail.title || "Untitled Bill",
        billText: billContent,
      })
      setInterpretation(interpretation)
    } catch (error) {
      console.error("Error getting AI interpretation:", error)
      setInterpretError("Couldn't get an AI interpretation. Please try again.")
    } finally {
      setInterpreting(false)
    }
  }

  async function sendChatMessage() {
    const userMessage = chatInput.trim()
    if (!userMessage || !billDetail) return

    setChatSending(true)
    setChatInput("")
    setChatMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: userMessage },
    ])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billTitle: billDetail.title || "Untitled Bill",
          billText: billDetail.summary?.text || billDetail.title || "No text available",
          userQuestion: userMessage,
          conversationHistory: conversationHistory.current,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to process question")
      }

      setChatMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: data.response },
      ])
      conversationHistory.current.push(
        { role: "user", content: userMessage },
        { role: "assistant", content: data.response },
      )
    } catch (error) {
      console.error("Error sending message:", error)
      setChatMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry — I couldn't process that question. Please try again.",
        },
      ])
    } finally {
      setChatSending(false)
    }
  }

  function handleChatKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendChatMessage()
    }
  }

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault()
    if (!hasLoaded) loadBills()
  }

  if (!hasLoaded && !billsLoading && bills.length === 0) {
    // Kick off the initial load once, on first render.
    loadBills()
  }

  return (
    <div className={`th-page th-sans min-h-screen ${themeFontVariables}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--th-rule)] bg-[var(--th-paper)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="th-serif text-xl font-medium tracking-tight text-[var(--th-ink)]">
              Townhall
            </span>
            <span className="th-mono text-xs text-[var(--th-verdigris-text)]">.vote</span>
          </Link>
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton>
                <button className="th-mono rounded-sm px-3 py-2 text-xs tracking-wide text-[var(--th-ink-soft)] uppercase transition-colors hover:text-[var(--th-ink)] focus-visible:ring-2 focus-visible:ring-[var(--th-verdigris-text)] focus-visible:outline-none">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="th-mono rounded-sm bg-[var(--th-verdigris)] px-4 py-2 text-xs tracking-wide text-white uppercase transition-colors hover:bg-[var(--th-verdigris-deep)] focus-visible:ring-2 focus-visible:ring-[var(--th-verdigris-text)] focus-visible:ring-offset-2 focus-visible:outline-none">
                  Get early access
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {view === "list" ? (
          <BillsList
            bills={filteredBills}
            loading={billsLoading}
            error={billsError}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            onSelect={openBill}
            onRefresh={loadBills}
          />
        ) : (
          <BillDetailView
            bill={billDetail}
            loading={detailLoading}
            error={detailError}
            interpretation={interpretation}
            interpreting={interpreting}
            interpretError={interpretError}
            onInterpret={interpretBill}
            onBack={backToList}
            chatMessages={chatMessages}
            chatInput={chatInput}
            chatSending={chatSending}
            onChatInputChange={setChatInput}
            onChatKeyDown={handleChatKeyDown}
            onSendChat={sendChatMessage}
          />
        )}
      </main>
    </div>
  )
}

function BillsList({
  bills,
  loading,
  error,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onSelect,
  onRefresh,
}: {
  bills: BillListItem[]
  loading: boolean
  error: string | null
  searchTerm: string
  onSearchChange: (value: string) => void
  onSearchSubmit: (event: FormEvent) => void
  onSelect: (bill: BillListItem) => void
  onRefresh: () => void
}) {
  return (
    <div>
      <p className="th-mono mb-2 text-[0.7rem] tracking-[0.2em] text-[var(--th-gold)] uppercase">
        Sec. 3(a) &middot; Bills
      </p>
      <h1 className="th-serif text-3xl text-[var(--th-ink)] md:text-4xl">
        Search recent legislation
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--th-ink-soft)] md:text-base">
        Browse recently updated bills, or search by number or title. Open one
        to read a plain-language interpretation and ask follow-up questions.
      </p>

      <form onSubmit={onSearchSubmit} className="mt-8 flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--th-ink-faint)]"
            aria-hidden
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by bill number or title…"
            className="th-sans w-full rounded-sm border border-[var(--th-rule-strong)] bg-[var(--th-paper)] py-3 pr-4 pl-10 text-sm text-[var(--th-ink)] placeholder:text-[var(--th-ink-faint)] focus:border-[var(--th-verdigris-text)] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="th-mono rounded-sm border border-[var(--th-rule-strong)] px-4 py-3 text-xs tracking-wide text-[var(--th-ink)] uppercase transition-colors hover:border-[var(--th-ink)] disabled:opacity-50"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </form>

      <div className="th-mono mt-8 mb-3 text-[0.65rem] tracking-widest text-[var(--th-ink-faint)] uppercase">
        {loading
          ? "Loading bills…"
          : `${bills.length} bill${bills.length === 1 ? "" : "s"}`}
      </div>

      {error && (
        <p className="rounded-sm border border-[var(--th-redline)]/30 bg-[var(--th-redline)]/5 p-4 text-sm text-[var(--th-redline)]">
          {error}
        </p>
      )}

      {loading && bills.length === 0 && (
        <div className="flex items-center gap-2 py-12 text-sm text-[var(--th-ink-faint)]">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Fetching the latest bills from Congress.gov…
        </div>
      )}

      {!loading && !error && bills.length === 0 && (
        <p className="py-12 text-sm text-[var(--th-ink-faint)]">
          No bills found. Try a different search, or refresh.
        </p>
      )}

      <ul className="divide-y divide-[var(--th-rule)] border-y border-[var(--th-rule)]">
        {bills.map((bill) => (
          <li key={`${bill.congress}-${bill.type}-${bill.number}`}>
            <button
              onClick={() => onSelect(bill)}
              className="grid w-full grid-cols-1 gap-1 py-5 text-left transition-colors hover:bg-[var(--th-paper-card)]/60 sm:grid-cols-[8rem_1fr_9rem] sm:items-center sm:gap-4 sm:px-2"
            >
              <span className="th-mono text-sm text-[var(--th-verdigris-text)]">
                {bill.type} {bill.number}
              </span>
              <span className="th-serif text-base text-[var(--th-ink)]">
                {bill.title || "No title available"}
              </span>
              <span className="th-mono text-[0.7rem] text-[var(--th-ink-faint)]">
                {bill.latestAction?.actionDate || "Unknown date"}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BillDetailView({
  bill,
  loading,
  error,
  interpretation,
  interpreting,
  interpretError,
  onInterpret,
  onBack,
  chatMessages,
  chatInput,
  chatSending,
  onChatInputChange,
  onChatKeyDown,
  onSendChat,
}: {
  bill: BillDetail | null
  loading: boolean
  error: string | null
  interpretation: string | null
  interpreting: boolean
  interpretError: string | null
  onInterpret: () => void
  onBack: () => void
  chatMessages: ChatMessage[]
  chatInput: string
  chatSending: boolean
  onChatInputChange: (value: string) => void
  onChatKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onSendChat: () => void
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="th-mono mb-8 inline-flex items-center gap-2 text-xs tracking-wide text-[var(--th-ink-soft)] uppercase hover:text-[var(--th-ink)]"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to all bills
      </button>

      {loading && (
        <div className="flex items-center gap-2 py-12 text-sm text-[var(--th-ink-faint)]">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading bill details…
        </div>
      )}

      {error && (
        <p className="rounded-sm border border-[var(--th-redline)]/30 bg-[var(--th-redline)]/5 p-4 text-sm text-[var(--th-redline)]">
          {error}
        </p>
      )}

      {bill && !loading && (
        <>
          <p className="th-mono mb-2 text-[0.7rem] tracking-[0.2em] text-[var(--th-gold)] uppercase">
            {bill.type} {bill.number}
          </p>
          <h1 className="th-serif text-2xl leading-snug text-[var(--th-ink)] md:text-3xl">
            {bill.title || "No title"}
          </h1>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="th-mono text-[0.65rem] tracking-widest text-[var(--th-ink-faint)] uppercase">
                Introduced
              </dt>
              <dd className="mt-1 text-[var(--th-ink-soft)]">
                {bill.introducedDate || "Unknown"}
              </dd>
            </div>
            <div>
              <dt className="th-mono text-[0.65rem] tracking-widest text-[var(--th-ink-faint)] uppercase">
                Latest action
              </dt>
              <dd className="mt-1 text-[var(--th-ink-soft)]">
                {bill.latestAction?.text || "No recent action"}
                {bill.latestAction?.actionDate ? ` (${bill.latestAction.actionDate})` : ""}
              </dd>
            </div>
            <div>
              <dt className="th-mono text-[0.65rem] tracking-widest text-[var(--th-ink-faint)] uppercase">
                Sponsors
              </dt>
              <dd className="mt-1 text-[var(--th-ink-soft)]">
                {bill.sponsors?.length ?? 0} sponsor(s)
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="th-mono mb-2 text-[0.65rem] tracking-widest text-[var(--th-ink-faint)] uppercase">
              Summary
            </p>
            <p className="text-sm leading-relaxed text-[var(--th-ink-soft)]">
              {bill.summary?.text ||
                "No summary available yet. This bill may be too recent to have a summary."}
            </p>
          </div>

          {bill.text?.formats && bill.text.formats.length > 0 && (
            <div className="th-paper-texture mt-6 rounded-sm border border-[var(--th-rule)] bg-[var(--th-paper-card)] p-5">
              <p className="th-mono mb-3 flex items-center gap-2 text-[0.65rem] tracking-widest text-[var(--th-ink-faint)] uppercase">
                <FileText className="size-3.5" aria-hidden />
                Full bill text
              </p>
              <div className="flex flex-wrap gap-2">
                {bill.text.formats.map((format) => (
                  <a
                    key={format.url}
                    href={format.url}
                    target="_blank"
                    rel="noreferrer"
                    className="th-mono inline-flex items-center gap-1.5 rounded-sm bg-[var(--th-verdigris)] px-3 py-2 text-[0.7rem] tracking-wide text-white uppercase transition-colors hover:bg-[var(--th-verdigris-deep)]"
                  >
                    {format.type}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                ))}
              </div>
              <p className="th-mono mt-3 text-[0.65rem] text-[var(--th-ink-faint)]">
                Opens on Congress.gov
              </p>
            </div>
          )}

          {/* AI interpretation */}
          <div className="mt-10 border-t border-[var(--th-rule)] pt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="th-mono text-[0.7rem] tracking-[0.2em] text-[var(--th-ink-faint)] uppercase">
                AI interpretation
              </p>
              {!interpretation && (
                <button
                  onClick={onInterpret}
                  disabled={interpreting}
                  className="th-mono inline-flex items-center gap-2 rounded-sm bg-[var(--th-ink)] px-4 py-2 text-xs tracking-wide text-[var(--th-paper)] uppercase transition-colors hover:bg-[var(--th-verdigris-deep)] disabled:opacity-50"
                >
                  {interpreting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" aria-hidden />
                      Get plain-language interpretation
                    </>
                  )}
                </button>
              )}
            </div>

            {interpretError && (
              <p className="mt-4 rounded-sm border border-[var(--th-redline)]/30 bg-[var(--th-redline)]/5 p-4 text-sm text-[var(--th-redline)]">
                {interpretError}
              </p>
            )}

            {interpretation && (
              <div className="th-paper-texture mt-4 rounded-sm border border-[var(--th-rule)] bg-[var(--th-paper-card)] p-6">
                <p className="th-mono mb-3 text-[0.65rem] tracking-widest text-[var(--th-verdigris-text)] uppercase">
                  In plain language
                </p>
                <div className="text-sm text-[var(--th-ink)]">
                  <LlmMarkdown>{interpretation}</LlmMarkdown>
                </div>
                <p className="th-mono mt-4 text-[0.65rem] text-[var(--th-ink-faint)]">
                  AI-generated from the bill&apos;s summary text &middot; verify against the
                  full bill text above
                </p>
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="mt-10 border-t border-[var(--th-rule)] pt-8">
            <p className="th-mono mb-4 text-[0.7rem] tracking-[0.2em] text-[var(--th-ink-faint)] uppercase">
              Ask a follow-up question
            </p>

            {chatMessages.length > 0 && (
              <div className="mb-4 space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-[85%] rounded-sm bg-[var(--th-ink)] px-4 py-3 text-sm text-[var(--th-paper)]"
                        : "mr-auto max-w-[85%] rounded-sm border border-[var(--th-rule)] bg-[var(--th-paper-card)] px-4 py-3 text-sm text-[var(--th-ink)]"
                    }
                  >
                    {message.role === "assistant" ? (
                      <LlmMarkdown>{message.content}</LlmMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                ))}
                {chatSending && (
                  <div className="mr-auto flex max-w-[85%] items-center gap-2 rounded-sm border border-[var(--th-rule)] bg-[var(--th-paper-card)] px-4 py-3 text-sm text-[var(--th-ink-faint)]">
                    <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    Thinking…
                  </div>
                )}
              </div>
            )}

            <div className="flex items-end gap-3">
              <textarea
                value={chatInput}
                onChange={(event) => onChatInputChange(event.target.value)}
                onKeyDown={onChatKeyDown}
                placeholder="Ask anything about this bill…"
                rows={2}
                className="th-sans flex-1 resize-none rounded-sm border border-[var(--th-rule-strong)] bg-[var(--th-paper)] px-4 py-3 text-sm text-[var(--th-ink)] placeholder:text-[var(--th-ink-faint)] focus:border-[var(--th-verdigris-text)] focus:outline-none"
              />
              <button
                onClick={onSendChat}
                disabled={chatSending || !chatInput.trim()}
                className="th-mono inline-flex items-center gap-2 rounded-sm bg-[var(--th-verdigris)] px-4 py-3 text-xs tracking-wide text-white uppercase transition-colors hover:bg-[var(--th-verdigris-deep)] disabled:opacity-50"
              >
                <Send className="size-3.5" aria-hidden />
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
