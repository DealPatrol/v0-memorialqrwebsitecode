'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Lock, Award, Clock, Mail, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SUPPORT_EMAIL } from "@/lib/site"

export function Footer() {
  const pathname = usePathname()
  const adLanding = pathname.startsWith("/ads/")
  if (adLanding) {
    return (
      <footer className="bg-black text-white">
        <div className="mx-auto flex max-w-xl flex-wrap gap-4 px-4 py-8 text-sm text-zinc-400">
          <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
          <Link href="/terms-of-service" className="hover:text-white">Terms</Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white">{SUPPORT_EMAIL}</a>
        </div>
      </footer>
    )
  }
  return (
    <footer className="bg-black text-white">
      {/* Trust & Security Section */}
      <div className="bg-zinc-900 py-12 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">Secure HTTPS</h3>
              <p className="text-sm text-zinc-400">Pages and uploads use HTTPS</p>
            </div>
            <div className="text-center">
              <Lock className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">Payments by Square</h3>
              <p className="text-sm text-zinc-400">Payments processed by Square</p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">30-Day Guarantee</h3>
              <p className="text-sm text-zinc-400">Full refund if not satisfied</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">Hosting Included</h3>
              <p className="text-sm text-zinc-400">10 years with every keepsake</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Resources</Link></li>
              <li><Link href="/concierge" className="hover:text-white transition-colors">Concierge Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/store" className="hover:text-white transition-colors">QR Keepsakes</Link></li>
              <li><Link href="/memorial-qr-code-plaque" className="hover:text-white transition-colors">QR Memorial Plaque</Link></li>
              <li><Link href="/qr-code-for-headstone" className="hover:text-white transition-colors">QR Code for a Headstone</Link></li>
              <li><Link href="/qr-code-for-urn" className="hover:text-white transition-colors">QR Code for an Urn</Link></li>
              <li><Link href="/pet-memorial-qr-code" className="hover:text-white transition-colors">Pet Memorial QR Code</Link></li>
              <li><Link href="/funeral-program-qr-code" className="hover:text-white transition-colors">Funeral Program QR Code</Link></li>
              <li><Link href="/digital-memorial-page" className="hover:text-white transition-colors">Digital Memorial Page</Link></li>
              <li><Link href="/guides" className="hover:text-white transition-colors">Memorial Guides</Link></li>
              <li><Link href="/gifts" className="hover:text-white transition-colors">Gift Ideas</Link></li>
              <li><Link href="/sympathy-gift-ideas" className="hover:text-white transition-colors">Sympathy Gift Ideas</Link></li>
              <li><Link href="/personalized-memorial-gift" className="hover:text-white transition-colors">Personalized Memorial Gift</Link></li>
              <li><Link href="/funeral-homes" className="hover:text-white transition-colors">Funeral Homes</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors flex items-center gap-2"><Mail className="w-4 h-4" />Email Support</a></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal & Trust</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Security Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* Bottom Section */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Service details */}
            <div>
              <h4 className="font-semibold mb-3">Simple, transparent service</h4>
              <div className="space-y-2 text-xs text-zinc-400">
                <p>Every QR keepsake opens an online memorial page.</p>
                <p>Each keepsake includes 10 years of hosting. No recurring fees.</p>
                <p>Secure online payments are processed by Square.</p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-3">Get in Touch</h4>
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-amber-500" />
                  <span>Based in the United States</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">{SUPPORT_EMAIL}</a>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-800 mb-8" />

          {/* Social & Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Memorial QR. All rights reserved. Created with care to honor memories.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
