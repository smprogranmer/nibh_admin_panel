import React from 'react'
import { MdMenu, MdNotifications, MdSearch } from 'react-icons/md'
import { useLocation } from 'react-router'
const Header = ({onMenuClick}) => {

  const pageTitles = {
    '/dashboard': { title: 'Dashboard', description: 'Welcome back, Admin' },
    '/products': { title: 'Products', description: 'Manage your abaya collection' },
    '/orders': { title: 'Orders', description: 'Track and manage customer orders' },
    '/customers': { title: 'Customers', description: 'View and manage your customers' },
    '/categories': { title: 'Categories', description: 'Organise your product categories' },
    '/settings': { title: 'Settings', description: 'Configure your store settings' },
  }


  const { pathname } = useLocation()
  const page = pageTitles[pathname] ?? { title: 'Admin', description: '' }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          <MdMenu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-heading text-lg font-semibold text-foreground leading-none">
            {page.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">{page.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground w-52">
          <MdSearch className="h-4 w-4 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none placeholder:text-muted-foreground w-full text-foreground text-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <MdNotifications className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold" />
          <span className="sr-only">Notifications</span>
        </button>

        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
          A
        </div>
      </div>
    </header>
  )
}

export default Header