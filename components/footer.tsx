'use client'

import Link from "next/link"
import { Shield, Lock, Award, Clock, Mail, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Trust & Security Section */}
      <div className="bg-zinc-900 py-12 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">SSL Encrypted</h3>
              <p className="text-sm text-zinc-400">Bank-level security for all data</p>
            </div>
            <div className="text-center">
              <Lock className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">GDPR Compliant</h3>
              <p className="text-sm text-zinc-400">Your privacy is protected</p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">30-Day Guarantee</h3>
              <p className="text-sm text-zinc-400">Full refund if not satisfied</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">Digital Hosting</h3>
              <p className="text-sm text-zinc-400">$4.99/month per memorial</p>
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
              <li><Link href="/store" className="hover:text-white transition-colors">Shop All Products</Link></li>
              <li><Link href="/store#human-memorials" className="hover:text-white transition-colors">Human Memorials</Link></li>
              <li><Link href="/store#pet-memorials" className="hover:text-white transition-colors">Pet Memorials</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="mailto:support@memorialqr.com" className="hover:text-white transition-colors flex items-center gap-2"><Mail className="w-4 h-4" />Email Support</a></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal & Trust</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
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
                <p>Physical products are charged once.</p>
                <p>Digital hosting is $4.99/month per memorial.</p>
                <p>Secure online payments are processed by Square.</p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-3">Get in Touch</h4>
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-amber-500" />
                  <span>Based in the United States<br />Serving worldwide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <a href="mailto:support@memorialqr.com" className="hover:text-white transition-colors">support@memorialqr.com</a>
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
