'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, Loader2, Upload } from 'lucide-react'

export function ConciergeForm() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deceasedName: '',
    birthDate: '',
    deathDate: '',
    obituary: '',
    deliveryType: 'digital',
    plaqueColor: 'gold',
  })

  const [files, setFiles] = useState<{
    photos: File[]
    videos: File[]
    documents: File[]
  }>({
    photos: [],
    videos: [],
    documents: [],
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (fileType: 'photos' | 'videos' | 'documents') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.currentTarget.files ? Array.from(e.currentTarget.files) : []
    setFiles(prev => ({ ...prev, [fileType]: selectedFiles }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      // Add files
      files.photos.forEach(file => formDataToSend.append('photos', file))
      files.videos.forEach(file => formDataToSend.append('videos', file))
      files.documents.forEach(file => formDataToSend.append('documents', file))

      const response = await fetch('/api/concierge/submit', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you! We\'ve received your memorial request. Our team will contact you within 24 hours.')
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          deceasedName: '',
          birthDate: '',
          deathDate: '',
          obituary: '',
          deliveryType: 'digital',
          plaqueColor: 'gold',
        })
        setFiles({ photos: [], videos: [], documents: [] })
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again or email support@memorials.com')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error submitting form. Please email support@memorials.com with your details.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div>
        <h3 className="font-semibold text-white mb-4">Your Information</h3>
        <div className="space-y-4">
          <Input
            name="customerName"
            placeholder="Your Name"
            value={formData.customerName}
            onChange={handleInputChange}
            required
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          <Input
            name="customerEmail"
            type="email"
            placeholder="Your Email"
            value={formData.customerEmail}
            onChange={handleInputChange}
            required
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          <Input
            name="customerPhone"
            type="tel"
            placeholder="Your Phone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Deceased Information */}
      <div>
        <h3 className="font-semibold text-white mb-4">About the Deceased</h3>
        <div className="space-y-4">
          <Input
            name="deceasedName"
            placeholder="Full Name"
            value={formData.deceasedName}
            onChange={handleInputChange}
            required
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            <Input
              name="deathDate"
              type="date"
              value={formData.deathDate}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <Textarea
            name="obituary"
            placeholder="Obituary or bio information"
            value={formData.obituary}
            onChange={handleInputChange}
            rows={4}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* File Uploads */}
      <div>
        <h3 className="font-semibold text-white mb-4">Upload Media</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-2">Photos</label>
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange('photos')}
                className="block w-full text-sm text-zinc-400"
              />
              {files.photos.length > 0 && (
                <p className="text-sm text-green-400 mt-2">{files.photos.length} photos selected</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-2">Videos</label>
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleFileChange('videos')}
                className="block w-full text-sm text-zinc-400"
              />
              {files.videos.length > 0 && (
                <p className="text-sm text-green-400 mt-2">{files.videos.length} videos selected</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-2">Documents</label>
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange('documents')}
                className="block w-full text-sm text-zinc-400"
              />
              {files.documents.length > 0 && (
                <p className="text-sm text-green-400 mt-2">{files.documents.length} documents selected</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div>
        <h3 className="font-semibold text-white mb-4">How Do You Want Your QR Code?</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="deliveryType"
              value="digital"
              checked={formData.deliveryType === 'digital'}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span className="text-white">Digital Link Only ($299)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="deliveryType"
              value="plaque"
              checked={formData.deliveryType === 'plaque'}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span className="text-white">Physical Plaque with QR Code (+$29.99)</span>
          </label>
        </div>

        {formData.deliveryType === 'plaque' && (
          <div className="mt-4">
            <label className="block text-sm text-zinc-300 mb-2">Plaque Color</label>
            <select
              name="plaqueColor"
              value={formData.plaqueColor}
              onChange={handleInputChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded text-white px-3 py-2"
            >
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="black">Black</option>
            </select>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 flex gap-3">
          <CheckCircle2 className="text-green-400 flex-shrink-0" />
          <p className="text-green-300">{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0" />
          <p className="text-red-300">{message}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Memorial Request'
        )}
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Or email us directly at <span className="text-amber-500">support@memorials.com</span> with your materials
      </p>
    </form>
  )
}
