import { useEffect, useRef, useState } from 'react'

// ── Placeholders — swap these in once you have them ───────────────────────
const LINE_URL = 'https://lin.ee/your-line-oa-id'   // TODO: replace with your real LINE OA link
// Live chat (tawk.to, free). Paste "propertyId/widgetId" from tawk.to → Administration → Chat Widget.
// While empty, chat buttons fall back to opening LINE.
const TAWK_ID = ''                                   // TODO: e.g. '64f1c0ffee1234567890abcd/1h9abcdef'
const DEMO_SITE_URL = '#'                            // TODO: replace with the live Mae Sai อบต. site URL

// Seller printed on the quotation (ใบเสนอราคา). Seller is an individual, not a company.
// Address and national ID are deliberately NOT stored here: this file ships in the public
// JS bundle, so the printed quote leaves blank lines to fill in by hand instead.
const SELLER = {
  brand: 'ABT Global',
  name: 'อธิปัตย์ ชำนาญปา',
  phone: '085-107-7620',
  email: 'athipaty@gmail.com',
  validDays: 30,
}

// Single price — no package tiers, simpler for buyers
const PLAN = {
  price: '9,900',
  features: [
    'เว็บไซต์ครบตามเกณฑ์ ITA / OIT / LPA',
    'ดีไซน์ทันสมัย ใช้งานได้ทุกอุปกรณ์',
    'โดเมน .go.th และโฮสติ้ง 1 ปี',
    'ระบบหลังบ้านจัดการเนื้อหาเอง (ข่าว ประกาศ บุคลากร)',
    'เชื่อมต่อระบบ e-GP อัตโนมัติแบบเรียลไทม์',
    'อัปโหลดรูป/PDF ง่าย ไม่ต้องพึ่งนักพัฒนา',
    'ระบบ e-Service แบบฟอร์มออนไลน์',
    'หมวดท่องเที่ยว / สินค้า OTOP',
    'อบรมการใช้งานให้เจ้าหน้าที่',
    'ซัพพอร์ตดูแลระบบตลอดปีผ่าน LINE',
  ],
}

const NAV_LINKS = [
  { href: '#features', label: 'จุดเด่น' },
  { href: '#compare', label: 'เทียบก่อน-หลัง' },
  { href: '#oit', label: 'เกณฑ์ OIT' },
  { href: '#pricing', label: 'ราคา' },
  { href: '#demo', label: 'ตัวอย่างจริง' },
  { href: '#contact', label: 'ติดต่อ' },
]

const COMPLIANCE = ['ITA', 'OIT', 'LPA', 'e-GP']

const FEATURES = [
  { icon: '📱', title: 'ใช้งานได้ทุกอุปกรณ์', desc: 'ออกแบบ responsive จริง ไม่ใช่แค่ย่อขนาด — ใช้งานสะดวกทั้งมือถือและคอมพิวเตอร์' },
  { icon: '📰', title: 'ข่าว ประกาศ จัดการเองได้', desc: 'เจ้าหน้าที่อัปเดตข่าวสาร ประกาศ จัดซื้อจัดจ้างได้เอง ไม่ต้องรอนักพัฒนา' },
  { icon: '📦', title: 'เชื่อมระบบ e-GP อัตโนมัติ', desc: 'ดึงข้อมูลจัดซื้อจัดจ้างจากระบบ e-GP ของกรมบัญชีกลางแบบเรียลไทม์' },
  { icon: '✅', title: 'ครบมาตรฐาน ITA OIT LPA', desc: 'จัดหมวดหมู่ข้อมูลตามเกณฑ์ประเมินคุณธรรมและความโปร่งใสครบทุกข้อ' },
  { icon: '🖼️', title: 'อัปโหลดรูปภาพ/เอกสารง่าย', desc: 'ระบบอัปโหลดรูป PDF ประกาศ งบประมาณ ใช้งานง่ายเหมือนโพสต์เฟซบุ๊ก' },
  { icon: '💬', title: 'ซัพพอร์ตผ่าน LINE', desc: 'มีปัญหาแชทถามได้ทันที ไม่ต้องโทรหรือรอส่งอีเมล' },
]

// OIT indicator groups (ITA) — each row: [item, how it gets updated on our site]
// Indicator wording/numbering changes yearly; re-check against the latest ITA manual from ป.ป.ช.
const OIT_GROUPS = [
  {
    title: 'ข้อมูลพื้นฐาน',
    items: [
      ['โครงสร้างหน่วยงาน และข้อมูลผู้บริหาร', 'มีหน้าพร้อม'],
      ['อำนาจหน้าที่ และกฎหมายที่เกี่ยวข้อง', 'มีหน้าพร้อม'],
      ['ข้อมูลการติดต่อ และช่องทางถาม-ตอบ (Q&A)', 'มีหน้าพร้อม'],
      ['ข่าวประชาสัมพันธ์ และ Social Network', 'อัปเดตเอง'],
    ],
  },
  {
    title: 'การบริหารงานและงบประมาณ',
    items: [
      ['แผนดำเนินงาน และรายงานผลการดำเนินงาน', 'อัปโหลดเอง'],
      ['คู่มือ/มาตรฐานการให้บริการ และสถิติการให้บริการ', 'อัปโหลดเอง'],
      ['บริการ E-Service', 'มีระบบให้'],
      ['แผนการใช้จ่ายงบประมาณ และรายงานผลการใช้จ่าย', 'อัปโหลดเอง'],
    ],
  },
  {
    title: 'การจัดซื้อจัดจ้าง',
    items: [
      ['แผนการจัดซื้อจัดจ้าง', 'อัปโหลดเอง'],
      ['ประกาศจัดซื้อจัดจ้าง', 'ดึงจาก e-GP อัตโนมัติ'],
      ['สรุปผลการจัดซื้อจัดจ้างรายเดือน', 'ดึงจาก e-GP อัตโนมัติ'],
      ['รายงานผลการจัดซื้อจัดจ้างประจำปี', 'อัปโหลดเอง'],
    ],
  },
  {
    title: 'การบริหารทรัพยากรบุคคล',
    items: [
      ['นโยบายและหลักเกณฑ์การบริหารทรัพยากรบุคคล', 'อัปโหลดเอง'],
      ['รายงานผลการบริหารทรัพยากรบุคคล', 'อัปโหลดเอง'],
    ],
  },
  {
    title: 'เรื่องร้องเรียนและการมีส่วนร่วม',
    items: [
      ['แนวปฏิบัติและช่องทางแจ้งเรื่องร้องเรียนการทุจริต', 'มีระบบให้'],
      ['ข้อมูลสถิติเรื่องร้องเรียน', 'อัปโหลดเอง'],
      ['การเปิดโอกาสให้ประชาชนมีส่วนร่วม', 'มีหน้าพร้อม'],
    ],
  },
  {
    title: 'การป้องกันการทุจริต',
    items: [
      ['เจตจำนงสุจริตของผู้บริหาร', 'อัปโหลดเอง'],
      ['การประเมินความเสี่ยงการทุจริต และมาตรการป้องกัน', 'อัปโหลดเอง'],
      ['แผนปฏิบัติการป้องกันการทุจริต และรายงานผล', 'อัปโหลดเอง'],
      ['มาตรการส่งเสริมคุณธรรมและความโปร่งใสภายใน', 'อัปโหลดเอง'],
    ],
  },
]

function openChat() {
  if (window.Tawk_API?.maximize) window.Tawk_API.maximize()
  else window.open(LINE_URL, '_blank', 'noreferrer')
}

// Loads the tawk.to widget once; it renders its own floating bubble
function useLiveChat() {
  useEffect(() => {
    if (!TAWK_ID || document.getElementById('tawk-script')) return
    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()
    const s = document.createElement('script')
    s.id = 'tawk-script'
    s.async = true
    s.src = `https://embed.tawk.to/${TAWK_ID}`
    s.charset = 'UTF-8'
    s.setAttribute('crossorigin', '*')
    document.body.appendChild(s)
  }, [])
}

function LineLink({ className = '' }) {
  return (
    <a href={LINE_URL} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 text-sm font-semibold ${className}`}>
      <LineIcon className="w-4 h-4" /> หรือทักผ่าน LINE
    </a>
  )
}

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
        <button onClick={openChat} className="hidden md:inline-flex btn-primary !px-4 !py-2">💬 แชทกับเรา</button>
        <button className="md:hidden text-gray-600" onClick={() => setOpen(o => !o)} aria-label="เมนู">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-100 px-5 py-3 flex flex-col gap-3 bg-white">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600">{l.label}</a>
          ))}
          <button onClick={() => { setOpen(false); openChat() }} className="btn-primary">💬 แชทกับเรา</button>
          <LineLink className="justify-center text-line" />
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
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-[1.5] sm:leading-[1.4] max-w-3xl mx-auto">
          เว็บไซต์ อบต. / เทศบาล<br />
          <span className="text-primary">ที่ทันสมัยและใช้งานจริง</span>
        </h1>
        <p className="mt-5 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          รองรับมาตรฐาน ITA OIT LPA e-GP ครบถ้วน ออกแบบใหม่ ใช้งานง่ายทั้งฝั่งประชาชนและเจ้าหน้าที่
          — ดูตัวอย่างเว็บไซต์จริงที่ใช้งานอยู่ด้านล่าง
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={openChat} className="btn-primary">💬 แชทสอบถามเลย</button>
          <a href="#demo" className="btn-ghost">👀 ดูตัวอย่างเว็บไซต์จริง</a>
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
function BrowserBar({ url, modern }) {
  return (
    <div className={`h-7 flex items-center gap-1.5 px-2 ${modern ? 'bg-white border-b border-gray-100' : 'bg-gray-200'}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${modern ? 'bg-red-400' : 'bg-gray-400'}`} />
      <span className={`w-2.5 h-2.5 rounded-full ${modern ? 'bg-yellow-400' : 'bg-gray-400'}`} />
      <span className={`w-2.5 h-2.5 rounded-full ${modern ? 'bg-green-400' : 'bg-gray-400'}`} />
      <span className={`ml-2 text-[10px] font-mono truncate ${modern ? 'text-gray-400' : 'text-gray-500'}`}>{url}</span>
    </div>
  )
}

function OldMockup() {
  const menu = ['หน้าแรก', 'ประวัติความเป็นมา', 'วิสัยทัศน์/พันธกิจ', 'โครงสร้างองค์กร', 'คณะผู้บริหาร', 'สภา อบต.', 'กองคลัง', 'กองช่าง', 'ข้อบัญญัติ', 'แผนพัฒนา', 'ดาวน์โหลดเอกสาร', 'กระดานสนทนา', 'ลิงก์หน่วยงาน']
  const news = ['ประกาศสอบราคาจ้างก่อสร้างถนน คสล. หมู่ที่ 3', 'ประกาศรับสมัครบุคคลเพื่อสรรหาเป็นพนักงานจ้าง', 'กำหนดการประชุมสภาสมัยสามัญ สมัยที่ 3', 'ประกาศผู้ชนะการเสนอราคา โครงการซ่อมแซมฝาย', 'แจ้งกำหนดการชำระภาษีป้าย ประจำปี']
  return (
    <div className="rounded-xl border border-gray-300 bg-gray-50 overflow-hidden" style={{ fontFamily: 'Tahoma, "Times New Roman", serif' }}>
      <BrowserBar url="www.tambon-example.go.th/home.php?view=12" />
      <div className="bg-white">
        <div className="h-12 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 flex items-center px-2 gap-2 border-b-4 border-yellow-500">
          <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white shrink-0" />
          <div className="leading-tight">
            <p className="text-[10px] font-bold text-yellow-300">องค์การบริหารส่วนตำบลตัวอย่าง</p>
            <p className="text-[7px] text-white">Example Subdistrict Administrative Organization</p>
          </div>
        </div>
        <div className="bg-red-700 text-yellow-200 text-[7px] px-2 py-0.5 whitespace-nowrap overflow-hidden">
          ★★ ยินดีต้อนรับเข้าสู่เว็บไซต์ องค์การบริหารส่วนตำบลตัวอย่าง ★★ ขอเชิญชวนประชาชนชำระภาษี ★★
        </div>
        <div className="grid grid-cols-[30%_1fr] gap-1 p-1 text-[7px]">
          <div className="space-y-px">
            {menu.map(m => <div key={m} className="bg-blue-800 text-white px-1 py-[1px] truncate">» {m}</div>)}
            <div className="mt-1 border border-gray-300 text-center p-0.5 text-gray-600">
              ผู้เข้าชม<br /><span className="font-mono bg-black text-green-400 px-0.5">0012874</span>
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="bg-orange-500 text-white font-bold px-1 py-0.5">ข่าวประชาสัมพันธ์</div>
            {news.map((n, i) => (
              <div key={n} className="px-1 py-[2px] border-b border-dotted border-gray-300 text-blue-700 underline truncate">
                • {n} {i < 2 && <span className="text-red-600 font-bold no-underline">new!</span>}
              </div>
            ))}
            <div className="grid grid-cols-3 gap-0.5 p-1">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-7 bg-gray-300 border border-gray-400" />)}
            </div>
            <p className="text-right text-blue-700 underline px-1 pb-0.5">อ่านทั้งหมด &gt;&gt;</p>
          </div>
        </div>
        <div className="bg-blue-900 text-white text-[6px] text-center py-0.5">Best view with IE 1024×768</div>
      </div>
    </div>
  )
}

function NewMockup() {
  const services = [['📢', 'ข่าวสาร'], ['📦', 'จัดซื้อจัดจ้าง'], ['📝', 'E-Service'], ['🛡️', 'ร้องเรียน'], ['✅', 'ITA'], ['📞', 'ติดต่อ']]
  const news = [['15 ก.ย.', 'โครงการปรับปรุงถนน หมู่ 3'], ['10 ก.ย.', 'ประชุมสภาสมัยสามัญ'], ['2 ก.ย.', 'กิจกรรมวันแม่ 2569']]
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-lg">
      <BrowserBar url="abt-maesai.go.th" modern />
      <div className="p-3 text-left">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary" />
            <p className="text-[11px] font-bold text-gray-900">อบต.แม่สาย</p>
          </div>
          <div className="flex gap-0.5"><span className="w-3 h-0.5 bg-gray-400" /><span className="w-3 h-0.5 bg-gray-400" /></div>
        </div>
        <div className="rounded-lg bg-gradient-to-r from-primary to-secondary p-3 mb-2.5">
          <p className="text-white text-[12px] font-bold">ยินดีต้อนรับสู่ อบต.แม่สาย</p>
          <p className="text-blue-100 text-[9px]">บริการประชาชนออนไลน์ ครบ จบ ในที่เดียว</p>
          <span className="inline-block mt-1.5 bg-white text-primary text-[8px] font-bold px-2 py-0.5 rounded-full">ยื่นคำร้องออนไลน์</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          {services.map(([icon, label]) => (
            <div key={label} className="rounded-lg bg-blue-50 py-1.5 text-center">
              <div className="text-sm leading-none">{icon}</div>
              <p className="text-[8px] font-semibold text-gray-700 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-bold text-gray-900 mb-1">ข่าวล่าสุด</p>
        <div className="space-y-1">
          {news.map(([d, t]) => (
            <div key={t} className="flex items-center gap-1.5 rounded-md border border-gray-100 p-1">
              <div className="w-8 h-6 rounded bg-gradient-to-br from-blue-100 to-blue-200 shrink-0" />
              <div className="min-w-0">
                <p className="text-[8px] font-semibold text-gray-800 truncate">{t}</p>
                <p className="text-[7px] text-gray-400">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const COMPARE_POINTS = [
  ['ตัวหนังสือเล็ก ต้องซูมอ่านบนมือถือ', 'ปรับขนาดอัตโนมัติ อ่านง่ายทุกจอ'],
  ['เมนูยาวเหยียด หาข้อมูลไม่เจอ', 'ปุ่มบริการหลักเห็นทันทีหน้าแรก'],
  ['ข่าวเป็นลิงก์ยาว ไม่มีรูป ไม่มีวันที่', 'ข่าวเป็นการ์ด มีรูปและวันที่ชัดเจน'],
  ['ต้องติดต่อสำนักงานเพื่อยื่นเรื่อง', 'ยื่นคำร้อง/ร้องเรียนออนไลน์ได้'],
]

function Compare() {
  return (
    <section id="compare" className="bg-gray-50">
      <div className="section">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900">เทียบให้เห็นชัด</h2>
          <p className="text-center text-gray-500 mt-2 mb-10">เว็บไซต์หน่วยงานท้องถิ่นทั่วไป เทียบกับเว็บไซต์ที่เราออกแบบ</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-8 items-start">
          <Reveal>
            <p className="text-center font-semibold text-gray-400 mb-3">เว็บไซต์แบบเดิม</p>
            <OldMockup />
            <ul className="mt-4 space-y-2">
              {COMPARE_POINTS.map(([bad]) => (
                <li key={bad} className="flex items-start justify-center sm:justify-start gap-2 text-sm text-gray-500">
                  <span className="text-red-400 font-bold">✕</span><span>{bad}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <p className="text-center font-semibold text-primary mb-3">เว็บไซต์ของเรา</p>
            <NewMockup />
            <ul className="mt-4 space-y-2">
              {COMPARE_POINTS.map(([, good]) => (
                <li key={good} className="flex items-start justify-center sm:justify-start gap-2 text-sm text-gray-700">
                  <span className="text-primary font-bold">✓</span><span>{good}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function OitTable() {
  const badge = how =>
    how.includes('e-GP') ? 'bg-green-50 text-green-700'
      : how.startsWith('มี') ? 'bg-blue-50 text-primary'
      : 'bg-gray-100 text-gray-600'
  return (
    <section id="oit" className="section">
      <Reveal>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900">ตรวจได้ทุกข้อ ตามเกณฑ์ OIT</h2>
        <p className="text-center text-gray-500 mt-2 mb-10 max-w-2xl mx-auto">
          ทุกหัวข้อในแบบตรวจการเปิดเผยข้อมูลสาธารณะ (OIT) มีหน้ารองรับบนเว็บไซต์ พร้อมบอกว่าอัปเดตอย่างไร
        </p>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-5">
        {OIT_GROUPS.map(g => (
          <Reveal key={g.title}>
            <div className="h-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-center sm:text-left">{g.title}</h3>
              <ul className="divide-y divide-gray-100">
                {g.items.map(([item, how]) => (
                  <li key={item} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                    <span className="flex items-start gap-2 text-gray-700">
                      <span className="text-primary font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </span>
                    <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge(how)}`}>{how}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-6">
        หัวข้ออ้างอิงตามคู่มือการประเมิน ITA ของสำนักงาน ป.ป.ช.
      </p>
    </section>
  )
}

const THAI_DIGITS = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
const THAI_PLACES = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน']

// Whole baht only (package prices have no satang); supports values below 1,000,000
function bahtText(n) {
  if (n === 0) return 'ศูนย์บาทถ้วน'
  const digits = String(n).split('').reverse()
  let out = ''
  digits.forEach((d, i) => {
    const v = Number(d)
    if (v === 0) return
    let word = THAI_DIGITS[v]
    if (i === 0 && v === 1 && digits.length > 1) word = 'เอ็ด'
    if (i === 1 && v === 1) word = ''
    if (i === 1 && v === 2) word = 'ยี่'
    out = word + THAI_PLACES[i] + out
  })
  return out + 'บาทถ้วน'
}

const thaiDate = d => d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })

function QuoteDocument({ quote }) {
  if (!quote) return null
  const amount = Number(PLAN.price.replace(/,/g, ''))
  const today = new Date()
  const no = `QT-${today.toISOString().slice(0, 10).replace(/-/g, '')}`
  return (
    <div className="hidden print:block text-[13px] text-black p-8">
      <div className="flex justify-between items-start border-b pb-4 mb-4">
        <div>
          <p className="text-xl font-bold">{SELLER.brand}</p>
          <p>โดย {SELLER.name}</p>
          <p>ที่อยู่ ......................................................................</p>
          <p>เลขประจำตัวผู้เสียภาษี ..........................................</p>
          <p>โทร {SELLER.phone} · {SELLER.email}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">ใบเสนอราคา</p>
          <p>เลขที่ {no}</p>
          <p>วันที่ {thaiDate(today)}</p>
        </div>
      </div>
      <p className="mb-1"><b>เรียน</b> {quote.org.startsWith('เทศบาล') ? `นายกเทศมนตรี${quote.org.slice(6)}` : `นายก${quote.org}`}</p>
      <p className="mb-4"><b>เรื่อง</b> เสนอราคาจัดทำเว็บไซต์หน่วยงาน</p>
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-10">ลำดับ</th>
            <th className="border p-2 text-left">รายการ</th>
            <th className="border p-2 w-16">จำนวน</th>
            <th className="border p-2 w-28 text-right">จำนวนเงิน (บาท)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 text-center align-top">1</td>
            <td className="border p-2">
              <p className="font-semibold">จัดทำเว็บไซต์หน่วยงาน (ระยะเวลา 1 ปี)</p>
              <ul className="list-disc pl-5 mt-1">
                {PLAN.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </td>
            <td className="border p-2 text-center align-top">1 ระบบ</td>
            <td className="border p-2 text-right align-top">{PLAN.price}.00</td>
          </tr>
          <tr>
            <td colSpan={3} className="border p-2 text-right font-bold">รวมเป็นเงินทั้งสิ้น ({bahtText(amount)})</td>
            <td className="border p-2 text-right font-bold">{PLAN.price}.00</td>
          </tr>
        </tbody>
      </table>
      <p>ผู้เสนอราคาไม่ได้จดทะเบียนภาษีมูลค่าเพิ่ม</p>
      <p>ใบเสนอราคานี้มีผลถึงวันที่ {thaiDate(new Date(today.getTime() + SELLER.validDays * 864e5))}</p>
      <div className="mt-16 ml-auto w-64 text-center">
        <p>ลงชื่อ ..........................................</p>
        <p className="mt-1">({SELLER.name})</p>
        <p>ผู้เสนอราคา</p>
      </div>
    </div>
  )
}

function QuoteForm({ onPrint }) {
  const [org, setOrg] = useState('')
  const submit = e => {
    e.preventDefault()
    const name = org.trim()
    // Formal letters spell out the abbreviation
    const full = name.replace(/^อบต\.?\s*/, 'องค์การบริหารส่วนตำบล')
    onPrint({ org: /^(องค์การ|เทศบาล)/.test(full) ? full : `องค์การบริหารส่วนตำบล${full}` })
  }
  return (
    <Reveal>
      <form onSubmit={submit}
        className="mt-12 max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
        <p className="font-bold text-gray-900">📄 ดาวน์โหลดใบเสนอราคา</p>
        <p className="text-sm text-gray-500 mt-1 mb-4">ใส่ชื่อหน่วยงาน แล้วบันทึกเป็น PDF ใช้ประกอบการจัดซื้อได้ทันที</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input required value={org} onChange={e => setOrg(e.target.value)} placeholder="ชื่อหน่วยงาน เช่น อบต.แม่สาย"
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-primary" />
          <button type="submit" className="btn-primary">ดาวน์โหลด PDF</button>
        </div>
      </form>
    </Reveal>
  )
}

function Pricing({ onPrint }) {
  return (
    <section id="pricing" className="bg-gray-50">
      <div className="section text-center">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">ราคาเดียว ครบทุกอย่าง</h2>
          <p className="text-gray-500 mt-2 mb-10">ไม่ต้องเลือกแพ็กเกจ ไม่มีค่าใช้จ่ายแอบแฝง</p>
        </Reveal>
        <Reveal>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-primary shadow-xl p-7 sm:p-10 grid sm:grid-cols-[2fr_3fr] gap-8 items-center">
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-primary">เว็บไซต์ อบต. / เทศบาล</p>
              <p className="text-5xl font-extrabold text-gray-900 mt-2">
                ฿{PLAN.price}<span className="text-base font-medium text-gray-400"> / ปี</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">ผู้เสนอราคาไม่ได้จดทะเบียนภาษีมูลค่าเพิ่ม</p>
              <button onClick={openChat} className="btn-primary w-full mt-6">💬 แชทสอบถามเลย</button>
              <LineLink className="mt-3 text-line" />
            </div>
            <ul className="space-y-2.5">
              {PLAN.features.map(f => (
                <li key={f} className="flex items-start justify-center sm:justify-start gap-2 text-sm text-gray-700">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <QuoteForm onPrint={onPrint} />
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
          <div className="flex flex-col items-center gap-4">
            <button onClick={openChat}
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform">
              💬 แชทกับเราตอนนี้
            </button>
            <LineLink className="text-white" />
          </div>
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
  const [quote, setQuote] = useState(null)
  useLiveChat()

  // Render the quotation first, then open the print dialog (user saves as PDF)
  useEffect(() => {
    if (!quote) return
    const done = () => setQuote(null)
    window.addEventListener('afterprint', done, { once: true })
    window.print()
    return () => window.removeEventListener('afterprint', done)
  }, [quote])

  return (
    <>
      <div className="print:hidden">
        <Navbar />
        <Hero />
        <Features />
        <Compare />
        <OitTable />
        <Pricing onPrint={setQuote} />
        <Demo />
        <Contact />
        <Footer />
        {!TAWK_ID && <FloatingLineButton />}
      </div>
      <QuoteDocument quote={quote} />
    </>
  )
}
