import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    /* Professional footer design */
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="professional-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-800">
                <Heart className="h-5 w-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-foreground">Memorial QR</span>
            </Link>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-sm">
              Creating lasting digital memorials to honor and remember your loved ones with dignity and care.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3 text-[15px] text-muted-foreground">
              <li>
                <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-foreground transition-colors">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/browse-memorials" className="hover:text-foreground transition-colors">
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Memorials</h3>
            <ul className="space-y-3 text-[15px] text-muted-foreground">
              <li>
                <Link href="/pet-memorials" className="hover:text-foreground transition-colors">
                  Pet Memorials
                </Link>
              </li>
              <li>
                <Link href="/qr-code-headstone" className="hover:text-foreground transition-colors">
                  QR Headstones
                </Link>
              </li>
              <li>
                <Link href="/memorial-plaque" className="hover:text-foreground transition-colors">
                  Memorial Plaques
                </Link>
              </li>
              <li>
                <Link href="/digital-memorial" className="hover:text-foreground transition-colors">
                  Digital Memorials
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-[15px] text-muted-foreground">
              <li>
                <Link href="/our-story" className="hover:text-foreground transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-[15px] text-muted-foreground">
              <li>
                <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Memorial QR. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Made with care</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
    /* </CHANGE> */
  )
}
