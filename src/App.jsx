import { useEffect, useRef, useState } from 'react'

// ── Placeholders — swap these in once you have them ───────────────────────
const LINE_URL = 'https://lin.ee/your-line-oa-id'   // TODO: replace with your real LINE OA link
const DEMO_SITE_URL = '#'                            // TODO: replace with the live Mae Sai อบต. site URL

// TODO: confirm real pricing before launch — placeholders based on competitor research (8,900-9,000฿ flat)
const PACKAGES = [
  {
    name: 'Basic',
    price: '6,900',
    tagline: 'ครบตามเกณฑ์ ผ่านมาตรฐาน',
    features: [
      'เว็บไซต์ครบตามเกณฑ์ ITA / OIT / LPA',
      'ดีไซน์เทมเพลตมาตรฐาน',
      'ระบบจัดการเนื้อหาเบื้องต้น (ข่าว/ประกาศ)',
      'โดเมน .go.th และโฮสติ้ง 1 ปี',
    ],
    highlight: false,
  },
  {
    name: 'Standard',
    price: '9,900',
    tagline: 'ตัวเลือกยอดนิยม',
    features: [
      'ทุกอย่างใน Basic',
      'เชื่อมต่อระบบ e-GP อัตโนมัติแบบเรียลไทม์',
      'อัปโหลดรูป/PDF ง่าย ไม่ต้องพึ่งช่าง',
      'หมวดท่องเที่ยว / สินค้า OTOP',
      'ซัพพอร์ตผ่าน LINE',
    ],
    highlight: true,
  },
  {
    name: 'Premium',
    price: '15,900',
    tagline: 'ออกแบบเฉพาะหน่วยงาน',
    features: [
      'ทุกอย่างใน Standard',
      'ออกแบบธีม/สีเฉพาะหน่วยงาน',
      'ระบบ e-Service แบบฟอร์มออนไลน์',
      'รองรับหลายภาษา (ไทย/อังกฤษ)',
      'ซัพพอร์ตด่วนพิเศษผ่าน LINE',
    ],
    highlight: false,
  },
]

const NAV_LINKS = [
  { href: '#features', label: 'จุดเด่น' },
  { href: '#compare', label: 'เทียบก่อน-หลัง' },
  { href: '#pricing', label: 'ราคา' },
  { href: '#demo', label: 'ตัวอย่างจริง' },
  { href: '#contact', label: 'ติดต่อ' },
]

const COMPLIANCE = ['ITA', 'OIT', 'LPA', 'e-GP']

const FEATURES = [
  { icon: '📱', title: 'ใช้งานได้ทุกอุปกรณ์', desc: 'ออกแบบ responsive จริง ไม่ใช่แค่ย่อขนาด — ใช้งานสะดวกทั้งมือถือและคอมพิวเตอร์' },
  { icon: '📰', title: 'ข่าว ประกาศ จัดการเองได้', desc: 'เจ้าหน้าที่อัปเดตข่าวสาร ประกาศ จัดซื้อจัดจ้างได้เอง ไม่ต้องรอเรียกช่าง' },
  { icon: '📦', title: 'เชื่อมระบบ e-GP อัตโนมัติ', desc: 'ดึงข้อมูลจัดซื้อจัดจ้างจากระบบ e-GP ของกรมบัญชีกลางแบบเรียลไทม์' },
  { icon: '✅', title: 'ครบมาตรฐาน ITA OIT LPA', desc: 'จัดหมวดหมู่ข้อมูลตามเกณฑ์ประเมินคุณธรรมและความโปร่งใสครบทุกข้อ' },
  { icon: '🖼️', title: 'อัปโหลดรูปภาพ/เอกสารง่าย', desc: 'ระบบอัปโหลดรูป PDF ประกาศ งบประมาณ ใช้งานง่ายเหมือนโพสต์เฟซบุ๊ก' },
  { icon: '💬', title: 'ซัพพอร์ตผ่าน LINE', desc: 'มีปัญหาแชทถามได้ทันที ไม่ต้องโทรหรือรอส่งอีเมล' },
]

const INCLUDED = [
  'เว็บไซต์พร้อมโดเมน .go.th และพื้นที่โฮสติ้ง',
  'ระบบหลังบ้านจัดการเนื้อหาเอง (ข่าว ประกาศ บุคลากร)',
  'หน้าเว็บครบตามเกณฑ์ ITA / OIT / LPA',
  'เชื่อมต่อระบบ e-GP อัตโนมัติ',
  'อบรมการใช้งานให้เจ้าหน้าที่',
  'ซัพพอร์ตดูแลระบบตลอดปีผ่าน LINE',
]

function LineIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 5.69 2 10.25c0 4.02 3.44 7.4 8.08 8.06.48.1.6.36.53.75l-.32 1.9c-.1.56.35 1 .86.75l3.63-2.08c.34-.19.68-.16 1.02-.13.4.03.8.05 1.2.05 5.52 0 10-3.69 10-8.25S17.52 2 12 2zm-3.65 10.45H6.9V8.3a.4.4 0 0 1 .4-.4h.65a.4.4 0 0 1 .4.4v3.2h1.95c.22 0 .4.18.4.4v.55a.4.4 0 0 1-.4.4zm2.2-.4a.4.4 0 0 1-.4.4h-.65a.4.4 0 0 1-.4-.4V8.3a.4.4 0 0 1 .4-.4h.65a.4.4 0 0 1 .4.4zm5.1 0a.4.4 0 0 1-.4.4h-.6a.4.4 0 0 1-.33-.17l-1.85-2.5v2.27a.4.4 0 0 1-.4.4h-.65a.4.4 0 0 1-.4-.4V8.3a.4.4 0 0 1 .4-.4h.63c.13 0 .25.06.33.17l1.82 2.47V8.3a.4.4 0 0 1 .4-.4h.65a.4.4 0 0 1 .4.4zm3.35-3.35a.4.4 0 0 1-.4.4h-1.95v.75h1.95c.22 0 .4.18.4.4v.55a.4.4 0 0 1-.4.4h-1.95v.75h1.95a.4.4 0 0 1 .4.4v.55a.4.4 0 0 1-.4.4h-3a.4.4 0 0 1-.4-.4V8.3a.4.4 0 0 1 .4-.4h3a.4.4 0 0 1 .4.4z"/>
    </svg>
  )
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
        io.unobserve(el)
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal-section ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="#top" className="font-extrabold text-lg text-primary tracking-tight">ABT Global</a>
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{l.label}</a>
          ))}
        </nav>
        <a href={LINE_URL} target="_blank" rel="noreferrer" className="hidden md:inline-flex btn-line !px-4 !py-2">
          <LineIcon className="w-4 h-4" /> แชทผ่าน LINE
        </a>
        <button className="md:hidden text-gray-600" onClick={() => setOpen(o => !o)} aria-label="เมนู">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-100 px-5 py-3 flex flex-col gap-3 bg-white">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600">{l.label}</a>
          ))}
          <a href={LINE_URL} target="_blank" rel="noreferrer" className="btn-line justify-center">
            <LineIcon className="w-4 h-4" /> แชทผ่าน LINE
          </a>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="bg-gradient-to-b from-blue-50 to-white">
      <div className="section text-center pt-14 sm:pt-20">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {COMPLIANCE.map(c => <span key={c} className="badge">✅ มาตรฐาน {c}</span>)}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight max-w-3xl mx-auto">
          เว็บไซต์ อบต. / เทศบาล<br />
          <span className="text-primary">ที่ทันสมัยและใช้งานจริง</span>
        </h1>
        <p className="mt-5 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          รองรับมาตรฐาน ITA OIT LPA e-GP ครบถ้วน ออกแบบใหม่ ใช้งานง่ายทั้งฝั่งประชาชนและเจ้าหน้าที่
          — ดูตัวอย่างเว็บไซต์จริงที่ใช้งานอยู่ด้านล่าง
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#demo" className="btn-primary">👀 ดูตัวอย่างเว็บไซต์จริง</a>
          <a href={LINE_URL} target="_blank" rel="noreferrer" className="btn-line">
            <LineIcon className="w-4 h-4" /> แชทสอบถามผ่าน LINE
          </a>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="section">
      <Reveal>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900">จุดเด่นของเว็บไซต์</h2>
        <p className="text-center text-gray-500 mt-2 mb-10">ทุกอย่างที่หน่วยงานท้องถิ่นต้องการ ในที่เดียว</p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map(f => (
          <Reveal key={f.title}>
            <div className="h-full bg-white border border-gray-100 rounded-2xl p-6 text-center sm:text-left shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// Pure-CSS mockups — no real screenshots needed, just illustrate old vs. new visually
function OldMockup() {
  return (
    <div className="rounded-xl border border-gray-300 bg-gray-50 overflow-hidden">
      <div className="h-7 bg-gray-200 flex items-center gap-1.5 px-2">
        <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
        <span className="ml-2 text-[10px] text-gray-500 font-mono">home.php?view=12</span>
      </div>
      <div className="p-3">
        <div className="h-10 bg-blue-900 mb-2 flex items-center px-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
          <div className="ml-2 w-32 h-2.5 bg-gray-300" />
        </div>
        <div className="grid grid-cols-4 gap-1">
          <div className="col-span-1 space-y-1">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-2 bg-gray-300" />)}
          </div>
          <div className="col-span-3 border border-gray-300 p-1.5">
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-gray-300 h-12 bg-white" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewMockup() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-lg">
      <div className="h-7 bg-white flex items-center gap-1.5 px-2 border-b border-gray-100">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-[10px] text-gray-400 font-mono">abt-maesai.go.th</span>
      </div>
      <div className="p-3">
        <div className="h-12 rounded-lg bg-gradient-to-r from-primary to-secondary mb-3 flex items-center px-3">
          <div className="w-8 h-8 bg-white/30 rounded-full" />
          <div className="ml-2 w-28 h-2.5 bg-white/50 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-blue-50 h-14 shadow-sm" />
          ))}
        </div>
        <div className="mt-2 h-2 w-2/3 bg-gray-100 rounded-full" />
        <div className="mt-1.5 h-2 w-1/2 bg-gray-100 rounded-full" />
      </div>
    </div>
  )
}

function Compare() {
  return (
    <section id="compare" className="bg-gray-50">
      <div className="section">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900">เทียบให้เห็นชัด</h2>
          <p className="text-center text-gray-500 mt-2 mb-10">เว็บไซต์หน่วยงานท้องถิ่นทั่วไป เทียบกับเว็บไซต์ที่เราออกแบบ</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-6 items-start">
          <Reveal>
            <p className="text-center font-semibold text-gray-400 mb-3">เว็บไซต์แบบเดิม</p>
            <OldMockup />
          </Reveal>
          <Reveal>
            <p className="text-center font-semibold text-primary mb-3">เว็บไซต์ของเรา</p>
            <NewMockup />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Included() {
  return (
    <section className="section">
      <Reveal className="grid sm:grid-cols-2 gap-8 items-center">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">แพ็กเกจรวมอะไรบ้าง</h2>
          <p className="text-gray-500 mb-6">ครบจบในราคาเดียว ไม่มีค่าใช้จ่ายแอบแฝง</p>
          <a href="#pricing" className="btn-primary">ดูราคา</a>
        </div>
        <ul className="space-y-3 w-fit max-w-full mx-auto sm:mx-0 text-left">
          {INCLUDED.map(item => (
            <li key={item} className="flex items-start gap-2.5 text-gray-700">
              <span className="text-primary font-bold mt-0.5">✓</span>
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="bg-gray-50">
      <div className="section text-center">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">เลือกแพ็กเกจที่ใช่</h2>
          <p className="text-gray-500 mt-2 mb-10">ไม่มีค่าใช้จ่ายซ่อนเร้น เลือกได้ตามงบและความต้องการ</p>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto text-center sm:text-left">
          {PACKAGES.map(pkg => (
            <Reveal key={pkg.name} className="h-full">
              <div className={`h-full flex flex-col bg-white rounded-2xl border p-7 relative ${
                pkg.highlight ? 'border-primary shadow-xl sm:scale-105' : 'border-gray-100 shadow-sm'
              }`}>
                {pkg.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    ⭐ {pkg.tagline}
                  </span>
                )}
                <p className="text-sm font-bold text-primary mb-1">{pkg.name}</p>
                {!pkg.highlight && <p className="text-xs text-gray-400 mb-1">{pkg.tagline}</p>}
                <p className={`text-3xl font-extrabold text-gray-900 ${pkg.highlight ? 'mt-3' : 'mt-2'}`}>
                  ฿{pkg.price}<span className="text-sm font-medium text-gray-400"> / ปี</span>
                </p>
                <ul className="mt-5 space-y-2.5 flex-1 w-fit max-w-full mx-auto sm:mx-0 text-left">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-primary font-bold mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={LINE_URL} target="_blank" rel="noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 mt-6 ${pkg.highlight ? 'btn-line' : 'btn-ghost'}`}>
                  {pkg.highlight && <LineIcon className="w-4 h-4" />} สอบถามผ่าน LINE
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Demo() {
  return (
    <section id="demo" className="section text-center">
      <Reveal>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">ดูตัวอย่างเว็บไซต์จริง</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-lg mx-auto">
          ไม่ใช่แค่ตัวอย่าง แต่เป็นเว็บไซต์ที่หน่วยงานท้องถิ่นใช้งานจริงอยู่ในขณะนี้
        </p>
        <a href={DEMO_SITE_URL} target="_blank" rel="noreferrer" className="btn-primary">
          🔗 เปิดดูเว็บไซต์ อบต. ตัวอย่าง
        </a>
      </Reveal>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="bg-gradient-to-r from-primary to-secondary">
      <div className="section text-center">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
          <p className="text-blue-100 mt-2 mb-8">ทักแชทมาคุยรายละเอียดกับเราได้เลย ตอบไว ไม่ต้องรอนาน</p>
          <a href={LINE_URL} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform">
            <LineIcon className="w-5 h-5 text-line" /> แชทผ่าน LINE ตอนนี้
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm">
      <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} ABT Global — รับทำเว็บไซต์หน่วยงานท้องถิ่น</p>
        <a href={LINE_URL} target="_blank" rel="noreferrer" className="text-line font-semibold flex items-center gap-1.5">
          <LineIcon className="w-4 h-4" /> ติดต่อผ่าน LINE
        </a>
      </div>
    </footer>
  )
}

function FloatingLineButton() {
  return (
    <a
      href={LINE_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="แชทผ่าน LINE"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-line shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
    >
      <LineIcon className="w-7 h-7 text-white" />
    </a>
  )
}

export default function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Compare />
      <Included />
      <Pricing />
      <Demo />
      <Contact />
      <Footer />
      <FloatingLineButton />
    </div>
  )
}
