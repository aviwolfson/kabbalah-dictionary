import { Concept } from "../page"

type Props = {
  concepts: Concept[]
  onSelect: (c: Concept) => void
  compact?: boolean
  selected?: Concept | null
}

export default function ConceptList({ concepts, onSelect, compact, selected }: Props) {
  if (compact) {
    return (
      <div className="w-48 flex-shrink-0 overflow-y-auto border-l border-border">
        {concepts.map((c, i) => (
          <button
            key={i}
            onClick={() => onSelect(c)}
            className={`w-full text-right px-3 py-2 text-sm border-b border-border/50 hover:bg-selected transition-colors truncate block ${selected?.term === c.term ? "bg-selected font-bold text-ink" : "text-ink-light"}`}
          >
            {c.term}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 grid grid-cols-1 gap-3">
      {concepts.map((c, i) => (
        <button
          key={i}
          onClick={() => onSelect(c)}
          className="text-right w-full border border-border rounded-lg p-4 bg-white/40 hover:bg-white/80 hover:border-gold-light transition-all group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-ink group-hover:text-gold transition-colors">
                {c.term}
              </h2>
              {c.aliases.length > 0 && (
                <p className="text-xs text-ink-light mt-0.5 leading-relaxed">
                  {c.aliases.slice(0, 4).join(" · ")}
                  {c.aliases.length > 4 && " ···"}
                </p>
              )}
              <p className="text-sm text-ink mt-2 leading-relaxed line-clamp-2">
                {c.definitions[0]?.text}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-xs bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full">
                {c.category}
              </span>
              <span className="text-xs text-ink-light">
                {c.definitions.length} הגדרות
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
