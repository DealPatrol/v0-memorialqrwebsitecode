'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react'

interface EmailComposerProps {
  recipientEmail: string
  recipientName: string
  conciergeRequestId: string
  onEmailSent?: () => void
}

export function EmailComposer({
  recipientEmail,
  recipientName,
  conciergeRequestId,
  onEmailSent,
}: EmailComposerProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const templates = {
    acknowledgment: {
      subject: 'We Received Your Memorial Request',
      body: `Hi ${recipientName},\n\nThank you for choosing Memorial QR for your concierge service. We've received all your materials and our team is reviewing everything.\n\nWe'll have an update for you within 24-48 hours.\n\nBest regards,\nMemorial QR Team`,
    },
    update: {
      subject: 'Update on Your Memorial',
      body: `Hi ${recipientName},\n\nYour memorial is coming along beautifully! Our team is organizing all your photos and creating a polished biography.\n\nWe'll send you a preview shortly for your review.\n\nBest regards,\nMemorial QR Team`,
    },
    preview: {
      subject: 'Your Memorial Preview is Ready',
      body: `Hi ${recipientName},\n\nYour memorial preview is ready for review! Please take a look and let us know if you'd like any changes.\n\nLink: [memorial preview link]\n\nBest regards,\nMemorial QR Team`,
    },
    completed: {
      subject: 'Your Memorial is Complete!',
      body: `Hi ${recipientName},\n\nYour memorial is now live! You can access it here: [memorial link]\n\nYour ${recipientName === 'plaque' ? 'plaque' : 'digital link'} will be delivered shortly.\n\nThank you for choosing Memorial QR.\n\nBest regards,\nMemorial QR Team`,
    },
  }

  const handleSendEmail = async () => {
    if (!subject.trim() || !body.trim()) {
      setStatus('error')
      setMessage('Please fill in subject and message')
      return
    }

    setIsSending(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/admin/concierge/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conciergeRequestId,
          subject,
          body: `<p>${body.replace(/\n/g, '</p><p>')}</p>`,
          recipientEmail,
        }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Email sent successfully!')
        setSubject('')
        setBody('')
        setIsExpanded(false)
        onEmailSent?.()
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setMessage('Failed to send email')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error sending email')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-4">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Email to {recipientName}
        </Button>
      ) : (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">To</label>
            <div className="text-sm text-zinc-400">{recipientEmail}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">Quick Templates</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSubject(template.subject)
                    setBody(template.body)
                  }}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded capitalize"
                >
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Message</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Your message..."
              rows={6}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          {status === 'success' && (
            <div className="bg-green-900/20 border border-green-700 rounded p-3 flex gap-2">
              <CheckCircle2 className="text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-900/20 border border-red-700 rounded p-3 flex gap-2">
              <AlertCircle className="text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{message}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleSendEmail}
              disabled={isSending}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Email'
              )}
            </Button>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
