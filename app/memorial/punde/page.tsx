"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Church, History, Users, Video, Calendar, MapPin } from "lucide-react"

export default function PUNDEMemorialPage() {
  const [activeSection, setActiveSection] = useState("histoire")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-purple-900 to-purple-700">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <Church className="w-20 h-20 mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2">
            Paroisse Universitaire Notre Dame de l'Espérance
          </h1>
          <p className="text-xl md:text-2xl text-center mb-4">PUNDE</p>
          <div className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5" />
            <span>Mbujimayi, République Démocratique du Congo</span>
          </div>
          <p className="text-lg mt-2">Fondée le 22 juin 1985</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Button
            onClick={() => setActiveSection("actualites")}
            variant={activeSection === "actualites" ? "default" : "outline"}
            className="h-24 flex flex-col gap-2"
          >
            <Calendar className="w-8 h-8" />
            <span className="text-base font-semibold">Actualités</span>
            <span className="text-xs">(Mise à jour hebdomadaire)</span>
          </Button>

          <Button
            onClick={() => setActiveSection("histoire")}
            variant={activeSection === "histoire" ? "default" : "outline"}
            className="h-24 flex flex-col gap-2"
          >
            <History className="w-8 h-8" />
            <span className="text-base font-semibold">Histoire</span>
          </Button>

          <Button
            onClick={() => setActiveSection("biographies")}
            variant={activeSection === "biographies" ? "default" : "outline"}
            className="h-24 flex flex-col gap-2"
          >
            <Users className="w-8 h-8" />
            <span className="text-base font-semibold">Biographies</span>
            <span className="text-xs">des Prêtres</span>
          </Button>

          <Button
            onClick={() => setActiveSection("video")}
            variant={activeSection === "video" ? "default" : "outline"}
            className="h-24 flex flex-col gap-2"
          >
            <Video className="w-8 h-8" />
            <span className="text-base font-semibold">Guide Vidéo</span>
          </Button>
        </div>

        {/* Content Sections */}
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {/* Actualités Section */}
            {activeSection === "actualites" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-purple-900 mb-6">Actualités</h2>

                <div className="space-y-4">
                  <Card className="border-l-4 border-l-purple-600">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Calendar className="w-6 h-6 text-purple-600 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Mise à jour hebdomadaire</p>
                          <h3 className="text-xl font-bold mb-2">Célébrations et Activités de la Semaine</h3>
                          <p className="text-gray-700">
                            Les messes dominicales sont célébrées à la salle polyvalente Mgr Tharcisse Tshibangu en
                            attendant l'achèvement de la nouvelle église sur l'avenue de l'université n°6, commune de
                            Kanshi.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-600">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">Projet de Construction</h3>
                      <p className="text-gray-700 mb-4">
                        La nouvelle paroisse est en cours de construction sur l'avenue de l'université, au numéro 6 dans
                        la commune de Kanshi. Les frais de construction sont supportés à 100% par les fidèles et autres
                        personnes de bonne volonté.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-600">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">Centre Hospitalier Notre Dame de l'Espérance</h3>
                      <p className="text-gray-700">
                        La polyclinique de la paroisse continue de servir la communauté avec des soins de santé de
                        qualité depuis son inauguration en 2009.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Histoire Section */}
            {activeSection === "histoire" && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-purple-900 mb-6">Histoire de la PUNDE</h2>

                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold text-purple-800 mt-8 mb-4">Introduction</h3>
                  <p className="text-gray-700 leading-relaxed">
                    La Paroisse Universitaire Notre Dame de l'Espérance (PUNDE en sigle) est une Église catholique
                    située à Mbujimayi en République Démocratique du Congo (RDC). Elle dispose d'une entrée, d'un
                    parking et des toilettes accessibles aux personnes en fauteuil roulant.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Culturellement, c'est un lieu du culte central, un centre d'apprentissage et de conservation du
                    savoir, ainsi qu'un symbole de continuité et d'identité culturelle.
                  </p>

                  <h3 className="text-2xl font-bold text-purple-800 mt-8 mb-4">Étapes vers la Fondation (1968-1984)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Depuis 1968, plusieurs tentatives d'encadrement spirituel des étudiants eurent lieu à
                    l'ISP/Mbujimayi. La plus importante fut celle qui vit le jour sous l'initiative de Madame Clothilde
                    Kampoyi Kapolo, une ex-religieuse de la congrégation des sœurs de Sainte Thérèse de l'Enfant Jésus.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    En 1996, le Père Raphaël Lambrecht, Directeur de l'ISP/Mbujimayi, contacta l'Abbé Mathieu Ilunga
                    pour ressusciter une vie chrétienne conduisant à l'émergence d'une aumônerie universitaire.
                  </p>

                  <h3 className="text-2xl font-bold text-purple-800 mt-8 mb-4">
                    Naissance du Groupe de Prière (Décembre 1984)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    La première réunion se tint le <strong>jeudi 6 décembre 1984</strong> dans la salle des professeurs
                    de l'ISP. La première séance de prière eut lieu le <strong>samedi 8 décembre 1984</strong> avec un
                    grand succès.
                  </p>

                  <h3 className="text-2xl font-bold text-purple-800 mt-8 mb-4">Fondation Officielle (22 juin 1985)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    La récollection du <strong>22 juin 1985</strong> aboutit à la création de la Paroisse Universitaire
                    Saint Raphaël de l'ISP Mbujimayi. La revue trimestrielle "La Chandelle" annonça cette naissance à
                    toute la communauté intellectuelle.
                  </p>

                  <h3 className="text-2xl font-bold text-purple-800 mt-8 mb-4">Érection Canonique (18 mai 1986)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Le <strong>dimanche 18 mai 1986</strong>, Mgr Joseph Nkongolo érigea canoniquement la paroisse lors
                    de l'inauguration de la salle polyvalente : "Par notre autorité, nous érigeons en ce jour la
                    Paroisse Universitaire St Raphaël de l'ISP/Mbujimayi, en tant que communauté chrétienne en vue de la
                    pastorale auprès des étudiants et des intellectuels de la ville de Mbujimayi."
                  </p>

                  <h3 className="text-2xl font-bold text-purple-800 mt-8 mb-4">Changement de Nom (5 mai 1996)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Le <strong>5 mai 1996</strong>, Mgr Tharcisse Tshibangu plaça tout le diocèse sous le patronage de
                    Marie, Notre Dame de l'Espérance. La Paroisse Saint Raphaël devint alors la
                    <strong> Paroisse Universitaire Notre Dame de l'Espérance (PUNDE)</strong>.
                  </p>

                  <h3 className="text-2xl font-bold text-purple-800 mt-8 mb-4">Développements Récents</h3>
                  <p className="text-gray-700 leading-relaxed">
                    En 2003, création de l'Association Diocésaine des Cadres Intellectuels et Dirigeants (A.D.I.C.A.D)
                    sous la direction de l'Abbé Simon Kalenga.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    En 2009, inauguration du Centre Hospitalier Notre Dame de l'Espérance (polyclinique).
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Aujourd'hui, la PUNDE dispose d'une adresse physique sur l'avenue de l'université, au numéro 6 dans
                    la commune de Kanshi, avec une nouvelle paroisse en construction.
                  </p>

                  <div className="bg-purple-50 p-6 rounded-lg mt-8">
                    <h4 className="text-xl font-bold text-purple-900 mb-3">Calendrier Liturgique</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>Temps de l'Avent</strong> - Début de l'année liturgique
                      </li>
                      <li>
                        <strong>Temps de Noël</strong> - Noël, Sainte Famille, Nouvel An, Épiphanie
                      </li>
                      <li>
                        <strong>Temps du Carême</strong> - Mercredi des Cendres, Dimanche des Rameaux, Semaine Sainte
                      </li>
                      <li>
                        <strong>Temps de Pâques</strong> - Vigile Pascale, Ascension, Pentecôte
                      </li>
                      <li>
                        <strong>Temps Ordinaire</strong> - Sainte Trinité, Saint Sacrement, Toussaint, Christ Roi
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Biographies Section */}
            {activeSection === "biographies" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-purple-900 mb-6">Biographies des Prêtres de la PUNDE</h2>

                <div className="space-y-6">
                  <Card className="bg-purple-50">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-purple-900 mb-4">Abbé Mathieu Ilunga (1985-1988)</h3>
                      <p className="text-gray-700 mb-2">
                        <strong>Premier Curé (Aumônier) et Fondateur</strong>
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Jeune prêtre diocésain d'à peine une année d'ordination en 1984, l'Abbé Mathieu Ilunga fut
                        contacté par le Père Raphaël Lambrecht pour créer une aumônerie universitaire. Il organisa la
                        première réunion le 6 décembre 1984 et la première séance de prière le 8 décembre 1984. Sous sa
                        direction, le "Groupe de prière" se transforma en Paroisse Universitaire Saint Raphaël le 22
                        juin 1985. Au terme de son mandat en 1988, il fut envoyé aux études en Belgique.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-purple-900 mb-2">
                        Abbé Joachim Kadima Kadyangndu (1988-1989)
                      </h3>
                      <p className="text-gray-700">Deuxième curé de la paroisse universitaire.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-purple-900 mb-2">
                        Abbé Jean-Pierre Mukendi Difinya (1989-1992)
                      </h3>
                      <p className="text-gray-700">Troisième curé, période de consolidation de la paroisse.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-purple-900 mb-2">Abbé Célestin Malengu (1992-1993)</h3>
                      <p className="text-gray-700">
                        Curé pendant la période de libéralisation de l'enseignement supérieur et l'arrivée des refoulés
                        du Shaba.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-purple-900 mb-4">
                        Abbé Alphonse Ngindu Mushete (1994-2002)
                      </h3>
                      <p className="text-gray-700 mb-2">
                        <strong>Professeur et Grand Intellectuel</strong>
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Grand professeur de renommée internationale et membre du comité de gestion de l'Université de
                        Mbujimayi. Il réussit à ouvrir la paroisse au milieu proprement universitaire, attirant beaucoup
                        de ses collègues professeurs et cadres intellectuels. Son mandat de 8 ans transforma la PUNDE en
                        un véritable foyer pour les intellectuels de Mbujimayi.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-purple-900 mb-4">
                        Abbé Simon Kalenga Nshimba (2002-2014)
                      </h3>
                      <p className="text-gray-700 mb-2">
                        <strong>Aumônier et Animateur de l'A.D.I.C.A.D</strong>
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Sous sa direction spirituelle fut créée en 2003 l'Association Diocésaine des Cadres
                        Intellectuels et Dirigeants (A.D.I.C.A.D), sortie officiellement le 28 août 2003 lors de la
                        visite du Nonce Apostolique Mgr Giovanni d'Anniello. Cette association attira beaucoup de cadres
                        intellectuels, notamment de la société MIBA. Son mandat de 12 ans fit de la PUNDE le fleuron de
                        la pastorale des milieux intellectuels de Mbujimayi.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-purple-900 mb-4">Abbé Blaise Kanda (2014 - Présent)</h3>
                      <p className="text-gray-700 mb-2">
                        <strong>Curé Actuel et Figure Publique</strong>
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Figure locale influente, connu pour ses prises de positions publiques sur les réseaux sociaux et
                        dans les médias, notamment sur des questions de développement urbain et de bonne gouvernance. Il
                        a appelé au nettoyage des routes récemment asphaltées et dirige actuellement le projet de
                        construction de la nouvelle église sur l'avenue de l'université.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-6 rounded-lg mt-8">
                    <h4 className="text-xl font-bold text-purple-900 mb-3">Vocations Issues de la PUNDE</h4>
                    <p className="text-gray-700 mb-3">
                      Grand don de l'engagement des laïcs, plusieurs fidèles chrétiens de la première heure sont devenus
                      prêtres :
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        • <strong>Abbé Patrick Kabangu</strong> - Prêtre diocésain
                      </li>
                      <li>
                        • <strong>Abbé Jean Kambila Bajika</strong> - Prêtre diocésain
                      </li>
                      <li>
                        • <strong>Père Benjamin Kabongo</strong> - Père Franciscain
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Video Guide Section */}
            {activeSection === "video" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-purple-900 mb-6">Guide Vidéo de la PUNDE</h2>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="bg-gradient-to-br from-purple-50 to-white">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <Video className="w-16 h-16 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Histoire de la PUNDE</h3>
                      <p className="text-gray-600 mb-4">
                        Découvrez l'histoire complète de la paroisse depuis sa fondation en 1985.
                      </p>
                      <Button className="w-full bg-transparent" variant="outline">
                        Regarder la vidéo
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-white">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <Video className="w-16 h-16 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Visite Virtuelle</h3>
                      <p className="text-gray-600 mb-4">
                        Visitez la nouvelle église en construction sur l'avenue de l'université.
                      </p>
                      <Button className="w-full bg-transparent" variant="outline">
                        Regarder la vidéo
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-white">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <Video className="w-16 h-16 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Témoignages des Fidèles</h3>
                      <p className="text-gray-600 mb-4">Écoutez les témoignages des membres de la communauté PUNDE.</p>
                      <Button className="w-full bg-transparent" variant="outline">
                        Regarder la vidéo
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-white">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <Video className="w-16 h-16 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Célébrations Liturgiques</h3>
                      <p className="text-gray-600 mb-4">
                        Découvrez les célébrations et événements liturgiques de la PUNDE.
                      </p>
                      <Button className="w-full bg-transparent" variant="outline">
                        Regarder la vidéo
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-purple-900 text-white mt-8">
                  <CardContent className="p-8 text-center">
                    <Video className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Chaîne YouTube de la PUNDE</h3>
                    <p className="mb-6">
                      Abonnez-vous pour ne manquer aucune actualité, célébration ou événement spécial.
                    </p>
                    <Button size="lg" variant="secondary">
                      S'abonner à la Chaîne
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Information */}
        <Card className="mt-12 bg-gradient-to-r from-purple-900 to-purple-700 text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Adresse</h3>
                <p>Avenue de l'Université, N°6</p>
                <p>Commune de Kanshi</p>
                <p>Mbujimayi, RDC</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Services</h3>
                <ul className="space-y-2">
                  <li>• Messes Dominicales</li>
                  <li>• Sacrements</li>
                  <li>• Centre Hospitalier</li>
                  <li>• Aumônerie Universitaire</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Mission</h3>
                <p className="leading-relaxed">
                  Pastorale auprès des étudiants et des intellectuels de la ville de Mbujimayi, lieu de culte,
                  d'apprentissage et de conservation du savoir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
