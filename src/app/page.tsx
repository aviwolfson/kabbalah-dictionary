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

export default function Home() {
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

  return (
    <div className="flex h-screen overflow-hidden">

      {/* סיידבר */}
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
            onChange={e => {
              setSearch(e.target.value)
              setSelectedCategory(null)
              setSelectedTerm(null)
            }}
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

      {/* רשימה מצומצמת כשמושג פתוח */}
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

      {/* רשימה רגילה כשאין מושג פתוח */}
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
            : <ConceptList concepts={filtered} onSelect={setOpenConcept} />
          }
        </main>
      )}

      {/* פאנל הגדרות */}
      {openConcept && (
        <ConceptCard concept={openConcept} onClose={() => setOpenConcept(null)} />
      )}
    </div>
  )
}
