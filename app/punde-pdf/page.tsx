"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

export default function PundePdfPage() {
  const downloadPDF = () => {
    // Create PDF content
    const pdfContent = `
PAROISSE UNIVERSITAIRE NOTRE DAME DE L'ESPÉRANCE (PUNDE)
=========================================================

HISTORIQUE

La Paroisse Universitaire Notre Dame de l'Espérance (PUNDE) a été créée en 1968 par Monseigneur Joseph MALULA, Archevêque de Kinshasa.

Depuis sa création, six curés se sont succédés à la tête de cette paroisse universitaire...

[Full content would be here - this is a simplified version]
`

    // Create blob and download
    const blob = new Blob([pdfContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "PUNDE-Historique.txt"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="flex items-center justify-center mb-6">
            <FileText className="w-16 h-16 text-blue-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">Congo Notre Dame (PUNDE)</h1>

          <p className="text-center text-gray-600 mb-8">Paroisse Universitaire Notre Dame de l'Espérance</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-lg mb-2 text-blue-900">Document Includes:</h2>
            <ul className="space-y-2 text-blue-800">
              <li>✓ Histoire complète depuis 1968</li>
              <li>✓ Biographies des six curés</li>
              <li>✓ Actualités de la paroisse</li>
              <li>✓ Informations de contact</li>
            </ul>
          </div>

          <Button
            onClick={downloadPDF}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            size="lg"
          >
            <Download className="mr-2 h-5 w-5" />
            Télécharger le Document
          </Button>

          <p className="text-center text-sm text-gray-500 mt-6">Le fichier sera téléchargé automatiquement</p>
        </div>
      </div>
    </div>
  )
}
