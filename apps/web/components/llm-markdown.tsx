import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import styles from "./llm-markdown.module.css"

interface LlmMarkdownProps {
  children: string
}

export function LlmMarkdown({ children }: LlmMarkdownProps) {
  return (
    <div className={styles.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: linkChildren, ...props }) => {
            const opensInNewTab =
              href?.startsWith("http://") || href?.startsWith("https://")

            return (
              <a
                {...props}
                href={href}
                target={opensInNewTab ? "_blank" : undefined}
                rel={opensInNewTab ? "noreferrer" : undefined}
              >
                {linkChildren}
              </a>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
