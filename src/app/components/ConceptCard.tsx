import { Concept } from "../page"

type Props = { concept: Concept; onClose: () => void }

export default function ConceptCard({ concept, onClose }: Props) {
  return (
    <aside className="flex-1 border-r border-border bg-white/70 overflow-y-auto flex flex-col">
      <div className="sticky top-0 bg-parchment border-b border-border p-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-ink">{concept.term}</h2>
          <span className="text-xs text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 rounded-full mt-1 inline-block">
            {concept.category}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-ink-light hover:text-ink text-xl leading-none mt-1 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {concept.aliases.length > 0 && (
        <div className="px-4 py-3 border-b border-border/50">
          <p className="text-xs font-bold text-ink-light mb-1">כינויים נוספים</p>
          <div className="flex flex-wrap gap-1">
            {concept.aliases.map((a, i) => (
              <span key={i} className="text-xs bg-parchment border border-border px-2 py-0.5 rounded text-ink-light">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 p-4 space-y-6">
        {concept.definitions.map((def, i) => (
          <div key={i} className="pb-6 border-b border-border/50 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gold">הגדרה {i + 1}</span>
              
		<a href={def.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-light hover:text-gold underline underline-offset-2">{def.source} {"↗"}</a>
            </div>
            <p className="text-sm leading-relaxed text-ink">{def.text}</p>
            {def.quote && (
              <blockquote className="mt-3 text-sm leading-relaxed">
                "{def.quote}"
              </blockquote>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
