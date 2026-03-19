"use client"
import { useState, useMemo } from "react"
import rawData from "../../data/concepts.json"
import ConceptList from "./components/ConceptList"
import ConceptCard from "./components/ConceptCard"

export type Definition = {
  text: string
  quote: string | null
  source: string
  source_url: string
}

export type Concept = {
  term: string
  aliases: string[]
  category: string
  definitions: Definition[]
}

const data = rawData as { concepts: Concept[] }

const TREE: Record<string, string[]> = {
  "נרנח\"י": ["נפש", "רוח", "נשמה", "חיה", "יחידה"],
  "עולמות": ["עולם העשייה", "עולם היצירה", "עולם הבריאה", "עולם האצילות", "אדם קדמון"],
  "מהות האדם": [],
  "שפת הקבלה": [],
  "תהליכי הנפש": [],
  "אחר": [],
}

type View = "menu" | "list" | "concept"

export default function Home() {
  const [view, setView] = useState<View>("menu")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [openConcept, setOpenConcept] = useState<Concept | null>(null)
  const [expandedCats, setExpandedCats] = useState<string[]>([])

  const toggleCat = (cat: string) => {
    setExpandedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setSelectedCategory(cat)
    setSelectedTerm(null)
    setSearch("")
  }

  const filtered = useMemo(() => {
    let list = data.concepts
    if (selectedCategory) {
      const subs = TREE[selectedCategory]
      if (subs && subs.length > 0) {
        list = list.filter(c => subs.includes(c.term) || c.category === selectedCategory)
      } else {
        list = list.filter(c => c.category === selectedCategory)
      }
    }
    if (selectedTerm) {
      list = list.filter(c => c.term === selectedTerm)
    }
    if (search.trim()) {
      const q = search.trim()
      list = list.filter(c =>
        c.term.includes(q) ||
        c.aliases.some(a => a.includes(q)) ||
        c.definitions.some(d => d.text.includes(q) || (d.quote && d.quote.includes(q)))
      )
    }
    return list
  }, [selectedCategory, selectedTerm, search])

  const handleSelectConcept = (c: Concept) => {
    setOpenConcept(c)
    setView("concept")
  }

  const handleSelectCategory = (cat: string) => {
    toggleCat(cat)
    setView("list")
  }

  const handleSelectTerm = (term: string) => {
    setSelectedTerm(term === selectedTerm ? null : term)
    setView("list")
  }

  const handleSearch = (q: string) => {
    setSearch(q)
    setSelectedCategory(null)
    setSelectedTerm(null)
    if (q.trim()) setView("list")
  }

  // ── דסקטופ ──────────────────────────────────────────────
  const Desktop = (
    <div className="hidden md:flex h-screen overflow-hidden">
      <aside className="w-64 flex-shrink-0 border-l border-border bg-parchment overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-black text-ink leading-tight">מילון קבלה</h1>
          <p className="text-xs text-ink-light mt-1">תורת הנפש באר"י</p>
        </div>
        <div className="p-3 border-b border-border">
          <input
            type="text"
            placeholder="חיפוש..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded bg-white/60 text-ink placeholder:text-ink-light/60 focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <nav className="p-2">
          <button
            onClick={() => { setSelectedCategory(null); setSelectedTerm(null); setSearch("") }}
            className={`tree-item w-full text-right px-3 py-2 rounded text-sm ${!selectedCategory && !search ? "active" : ""}`}
          >
            📜 כל המושגים ({data.concepts.length})
          </button>
          {Object.entries(TREE).map(([cat, subs]) => {
            const count = subs.length > 0
              ? data.concepts.filter(c => subs.includes(c.term) || c.category === cat).length
              : data.concepts.filter(c => c.category === cat).length
            const isExpanded = expandedCats.includes(cat)
            return (
              <div key={cat} className="mt-1">
                <button
                  onClick={() => toggleCat(cat)}
                  className={`tree-item w-full text-right px-3 py-2 rounded text-sm font-bold flex items-center justify-between ${selectedCategory === cat && !selectedTerm ? "active" : ""}`}
                >
                  <span>{cat}</span>
                  <span className="flex items-center gap-1">
                    <span className="text-gold-light font-normal text-xs">({count})</span>
                    <span className="text-xs text-ink-light">{isExpanded ? "▾" : "▸"}</span>
                  </span>
                </button>
                {isExpanded && subs.length > 0 && (
                  <div className="mr-3 border-r-2 border-gold-light/40 pr-2 mt-1 space-y-0.5">
                    {subs.map(sub => (
                      <button
                        key={sub}
                        onClick={() => { setSelectedTerm(sub === selectedTerm ? null : sub); setSelectedCategory(cat) }}
                        className={`tree-item w-full text-right px-2 py-1.5 rounded text-sm ${selectedTerm === sub ? "active" : ""}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {openConcept && (
        <div className="w-56 flex-shrink-0 border-l border-border overflow-y-auto bg-parchment/60">
          <div className="sticky top-0 bg-parchment border-b border-border px-3 py-2">
            <p className="text-xs text-ink-light">{filtered.length} מושגים</p>
          </div>
          {filtered.map((c, i) => (
            <button
              key={i}
              onClick={() => setOpenConcept(c)}
              className={`w-full text-right px-3 py-2 text-sm border-b border-border/40 hover:bg-selected transition-colors block truncate ${openConcept.term === c.term ? "bg-selected font-bold text-ink" : "text-ink-light"}`}
            >
              {c.term}
            </button>
          ))}
        </div>
      )}

      {!openConcept && (
        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-parchment/95 backdrop-blur border-b border-border px-6 py-3">
            <p className="text-sm text-ink-light">
              {search ? `תוצאות לחיפוש "${search}"` : selectedTerm || selectedCategory || "כל המושגים"}
              <span className="mr-2 text-gold font-bold">{filtered.length} מושגים</span>
            </p>
          </div>
          {filtered.length === 0
            ? <div className="p-12 text-center text-ink-light">לא נמצאו מושגים</div>
            : <ConceptList concepts={filtered} onSelect={handleSelectConcept} />
          }
        </main>
      )}

      {openConcept && (
        <ConceptCard concept={openConcept} onClose={() => setOpenConcept(null)} />
      )}
    </div>
  )

  // ── מובייל ──────────────────────────────────────────────
  const Mobile = (
    <div className="flex md:hidden flex-col h-screen overflow-hidden">
      {/* כותרת */}
      <header className="flex-shrink-0 bg-parchment border-b border-border px-4 py-3 flex items-center gap-3">
        {view !== "menu" && (
          <button
            onClick={() => {
              if (view === "concept") setView("list")
              else { setView("menu"); setSelectedCategory(null); setSearch("") }
            }}
            className="text-gold text-lg leading-none"
          >
            ◀
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-black text-ink">מילון קבלה</h1>
        </div>
        {view === "list" && (
          <span className="text-xs text-ink-light">{filtered.length} מושגים</span>
        )}
      </header>

      {/* תוכן */}
      <div className="flex-1 overflow-y-auto">

        {/* תפריט ראשי */}
        {view === "menu" && (
          <div>
            <div className="p-3 border-b border-border">
              <input
                type="text"
                placeholder="חיפוש חופשי..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded bg-white/60 text-ink focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <nav className="p-2">
              <button
                onClick={() => { setSelectedCategory(null); setSelectedTerm(null); setSearch(""); setView("list") }}
                className="tree-item w-full text-right px-4 py-3 rounded text-base mb-1"
              >
                📜 כל המושגים ({data.concepts.length})
              </button>
              {Object.entries(TREE).map(([cat, subs]) => {
                const count = subs.length > 0
                  ? data.concepts.filter(c => subs.includes(c.term) || c.category === cat).length
                  : data.concepts.filter(c => c.category === cat).length
                const isExpanded = expandedCats.includes(cat)
                return (
                  <div key={cat} className="mb-1">
                    <button
			onClick={() => { toggleCat(cat); setView("list") }}
                      className="tree-item w-full text-right px-4 py-3 rounded text-base font-bold flex items-center justify-between"
                    >
                      <span>{cat}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-gold-light font-normal text-sm">({count})</span>
                        <span className="text-ink-light">{isExpanded ? "▾" : "▸"}</span>
                      </span>
                    </button>
                    {isExpanded && subs.length > 0 && (
                      <div className="mr-4 border-r-2 border-gold-light/40 pr-3 space-y-0.5">
                        {subs.map(sub => (
                          <button
                            key={sub}
                            onClick={() => handleSelectTerm(sub)}
                            className="tree-item w-full text-right px-3 py-2 rounded text-sm"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        )}

        {/* רשימת מושגים */}
        {view === "list" && (
          <ConceptList concepts={filtered} onSelect={handleSelectConcept} />
        )}

        {/* הגדרות מושג */}
        {view === "concept" && openConcept && (
          <div className="flex flex-col">
            <div className="p-4 border-b border-border bg-parchment">
              <h2 className="text-2xl font-black text-ink">{openConcept.term}</h2>
              <span className="text-xs text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                {openConcept.category}
              </span>
            </div>

            {openConcept.aliases.length > 0 && (
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-xs font-bold text-ink-light mb-1">כינויים נוספים</p>
                <div className="flex flex-wrap gap-1">
                  {openConcept.aliases.map((a, i) => (
                    <span key={i} className="text-xs bg-parchment border border-border px-2 py-0.5 rounded text-ink-light">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 space-y-6">
              {openConcept.definitions.map((def, i) => (
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
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {Desktop}
      {Mobile}
    </>
  )
}
