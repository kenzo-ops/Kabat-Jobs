import React from 'react'

type NavItem = {
  label: string
  href: string
  icon?: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '#overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/80">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
      </svg>
    )
  },
  {
    label: 'Applications',
    href: '#applications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/80">
        <path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" fill="currentColor"/>
      </svg>
    )
  },
  {
    label: 'Saved Jobs',
    href: '#saved',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/80">
        <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z" fill="currentColor"/>
      </svg>
    )
  },
  {
    label: 'Settings',
    href: '#settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/80">
        <path d="M19.14 12.936a7.963 7.963 0 0 0 .06-.936 7.963 7.963 0 0 0-.06-.936l2.033-1.58a.5.5 0 0 0 .117-.638l-1.926-3.333a.5.5 0 0 0-.607-.22l-2.397.964a8.14 8.14 0 0 0-1.618-.936l-.365-2.54A.5.5 0 0 0 13.96 1h-3.92a.5.5 0 0 0-.494.422l-.365 2.54a8.14 8.14 0 0 0-1.618.936l-2.397-.964a.5.5 0 0 0-.607.22L2.634 7.41a.5.5 0 0 0 .117.638l2.033 1.58c-.04.308-.06.62-.06.936s.02.628.06.936l-2.033 1.58a.5.5 0 0 0-.117.638l1.926 3.333a.5.5 0 0 0 .607.22l2.397-.964c.5.375 1.046.686 1.618.936l.365 2.54a.5.5 0 0 0 .494.422h3.92a.5.5 0 0 0 .494-.422l.365-2.54c.572-.25 1.118-.561 1.618-.936l2.397.964a.5.5 0 0 0 .607-.22l1.926-3.333a.5.5 0 0 0-.117-.638l-2.033-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" fill="currentColor"/>
      </svg>
    )
  }
]

type SidebarProps = {
  activeHref?: string
  onNavigate?: (href: string) => void
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ activeHref = '#overview', onNavigate, className = '' }) => {
  return (
    <aside className={`hidden md:flex flex-col w-64 shrink-0 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />

        <div className="relative p-4">
          <div className="px-2 py-2">
            <div className="text-xs uppercase tracking-wider text-white/50">Menu</div>
          </div>
          <nav className="mt-1 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.href === activeHref
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault()
                      onNavigate(item.href)
                    }
                  }}
                  className={
                    `group inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ` +
                    (isActive
                      ? 'bg-white/10 text-white ring-1 ring-inset ring-white/15'
                      : 'text-white/80 hover:text-white hover:bg-white/5')
                  }
                >
                  <span className={`shrink-0 ${isActive ? 'text-white' : 'text-white/70'} group-hover:text-white`}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </a>
              )
            })}
          </nav>

          <div className="mt-4 border-t border-white/10 pt-3">
            <a
              href="#upgrade"
              className="block rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-center text-sm font-semibold text-white hover:from-indigo-400 hover:to-violet-400 transition-colors"
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar


