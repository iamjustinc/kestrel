export type DemoUser = {
    firstName: string
    lastName: string
    email: string
  }
  
  const STORAGE_KEY = 'kestrel_demo_user'
  
  export function saveDemoUser(user: DemoUser) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }
  
  export function getDemoUser(): DemoUser | null {
    if (typeof window === 'undefined') return null
  
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
  
    try {
      return JSON.parse(raw) as DemoUser
    } catch {
      return null
    }
  }
  
  export function clearDemoUser() {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(STORAGE_KEY)
  }
  
  export function getDisplayName(user: DemoUser | null) {
    if (!user) return 'Alex Johnson'
    return `${user.firstName} ${user.lastName}`.trim()
  }
  
  export function getInitials(user: DemoUser | null) {
    if (!user) return 'AJ'
    const first = user.firstName?.[0] ?? ''
    const last = user.lastName?.[0] ?? ''
    return `${first}${last}`.toUpperCase() || 'AJ'
  }