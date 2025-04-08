import Link from "next/link"
import { Home } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-12 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Home className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-primary">PropCloud.io</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6 md:mb-0">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary">
              How It Works
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-primary">
              About Us
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-primary">
              FAQ
            </Link>
            <Link href="#waitlist" className="text-sm text-muted-foreground hover:text-primary">
              Join Waitlist
            </Link>
          </nav>

          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PropCloud.io. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
