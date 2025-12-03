import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Church, Download, History, Users, Video, MapPin, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "PUNDE - Paroisse Universitaire Notre Dame de l'Espérance",
  description: "Histoire et informations de la Paroisse Universitaire Notre Dame de l'Espérance à Mbujimayi, Congo",
}

export default function PundePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative h-[500px] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/catholic-church-notre-dame-kinshasa-congo-universi.jpg')" }}
        />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center z-10">
          <Church className="w-20 h-20 mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">PUNDE</h1>
          <p className="text-2xl md:text-3xl mb-2">Paroisse Universitaire Notre Dame de l'Espérance</p>
          <p className="text-lg mt-4 opacity-90">Mbujimayi, République Démocratique du Congo</p>
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex items-center gap-2 opacity-80">
              <Calendar className="w-5 h-5" />
              <span className="text-md">Fondée le 8 décembre 1984</span>
            </div>
            <div className="flex items-center gap-2 opacity-80">
              <MapPin className="w-5 h-5" />
              <span className="text-md">Érigée canoniquement le 18 mai 1986</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-4">
            <Button asChild variant="outline" className="whitespace-nowrap bg-transparent">
              <a href="#actualites">📰 Actualités</a>
            </Button>
            <Button asChild variant="outline" className="whitespace-nowrap bg-transparent">
              <a href="#histoire">📖 Histoire</a>
            </Button>
            <Button asChild variant="outline" className="whitespace-nowrap bg-transparent">
              <a href="#biographies">👥 Biographies</a>
            </Button>
            <Button asChild variant="outline" className="whitespace-nowrap bg-transparent">
              <a href="#videos">🎥 Guide Vidéo</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Photo Gallery */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Galerie Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              className="aspect-square bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: "url('/catholic-church-exterior-congo.jpg')" }}
            />
            <div
              className="aspect-square bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: "url('/university-students-praying-church.jpg')" }}
            />
            <div
              className="aspect-square bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: "url('/african-catholic-mass-celebration.jpg')" }}
            />
            <div
              className="aspect-square bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: "url('/virgin-mary-notre-dame-statue.jpg')" }}
            />
            <div
              className="aspect-square bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: "url('/church-interior-altar-congo.jpg')" }}
            />
            <div
              className="aspect-square bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: "url('/congregation-worship-african-church.jpg')" }}
            />
          </div>
        </section>

        {/* Actualités Section */}
        <section id="actualites" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center mb-6">
              <Download className="w-10 h-10 mr-4" />
              <h2 className="text-4xl font-bold">Actualités</h2>
            </div>
            <p className="text-xl mb-6 opacity-90">Mis à jour hebdomadairement</p>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-3">Horaires des Messes</h3>
                <ul className="space-y-2 text-lg">
                  <li>• Dimanche: 8h00 et 10h30</li>
                  <li>• Jours de semaine: 18h00</li>
                  <li>• Samedi: 18h00 (messe dominicale anticipée)</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-3">📢 Influence Sociale et Morale</h3>
                <p className="text-lg mb-3">
                  Le curé de la paroisse, l'Abbé Blaise KANDA, est une figure locale influente, connue pour ses prises
                  de positions publiques sur les réseaux sociaux et dans les médias.
                </p>
                <ul className="space-y-2 text-lg">
                  <li>• Promotion du développement urbain de Mbujimayi</li>
                  <li>• Appels à la bonne gouvernance et à la transparence</li>
                  <li>• Mobilisation pour le nettoyage des routes récemment asphaltées</li>
                  <li>• Engagement actif dans la vie civique de la ville</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-3">🏥 Action dans le Domaine de la Santé</h3>
                <p className="text-lg mb-3">
                  <strong>Centre Hospitalier Notre Dame de l'Espérance</strong> - Inauguré en 2009
                </p>
                <p className="text-lg">
                  Une polyclinique portant le nom de la paroisse démontre l'engagement de l'institution dans
                  l'amélioration de l'accès aux soins de santé pour la communauté universitaire et la population de
                  Mbujimayi.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-3">🏗️ Projets d'Infrastructures</h3>
                <p className="text-lg mb-3">
                  <strong>Nouvelle église en construction</strong> - Avenue de l'Université, N°6, Commune de Kanshi
                </p>
                <ul className="space-y-2 text-lg">
                  <li>• Construction financée à 100% par les fidèles et personnes de bonne volonté</li>
                  <li>• Projet d'envergure contribuant à la modernisation de la ville</li>
                  <li>• Accessibilité pour personnes en fauteuil roulant (entrée, parking, toilettes)</li>
                  <li>• Symbole de l'engagement communautaire et de la foi</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-3">📅 Événements à Venir</h3>
                <p className="text-lg mb-3">Consultez régulièrement cette section pour:</p>
                <ul className="space-y-2 text-lg">
                  <li>• Annonces importantes de la paroisse</li>
                  <li>• Activités des mouvements et groupes de prière</li>
                  <li>• Récollections et retraites spirituelles</li>
                  <li>• Réunions de l'ADICAD (Association Diocésaine des Cadres Intellectuels et Dirigeants)</li>
                  <li>• Célébrations liturgiques spéciales</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Histoire Section */}
        <section id="histoire" className="mb-16 scroll-mt-24">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-8">
              <History className="w-10 h-10 mr-4 text-purple-600" />
              <h2 className="text-4xl font-bold text-gray-900">Histoire de la PUNDE</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Introduction</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                La Paroisse Universitaire Notre Dame de l'Espérance (PUNDE) est une église catholique située à Mbujimayi
                en République Démocratique du Congo. Culturellement, c'est un lieu de culte central, un centre
                d'apprentissage et de conservation du savoir, ainsi qu'un symbole de continuité et d'identité
                culturelle.
              </p>

              <h3 className="text-2xl font-bold text-purple-600 mb-4 mt-8">Étapes vers la Fondation (1968-1984)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depuis 1968, plusieurs tentatives d'encadrement spirituel des étudiants eurent lieu à l'ISP/Mbujimayi.
                La plus importante fut celle qui vit le jour sous l'initiative de{" "}
                <strong>Madame Clothilde Kampoyi Kapolo</strong>, une ex-religieuse de la congrégation des Sœurs de
                Sainte Thérèse de l'Enfant Jésus du Diocèse de Mbujimayi.
              </p>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 my-6">
                <p className="text-gray-800 italic">
                  "Un bon groupe d'étudiants et étudiantes s'étaient formés. Ils se réunissaient mensuellement,
                  faisaient un partage de l'évangile, priaient et organisaient des récollections et retraites."
                </p>
              </div>

              <h3 className="text-2xl font-bold text-purple-600 mb-4 mt-8">La Fondation (8 décembre 1984)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                En 1996, le Père Raphaël Lambrecht, premier Directeur de l'ISP/Mbujimayi, demanda à l'
                <strong>Abbé Mathieu Ilunga</strong>, jeune prêtre diocésain d'à peine une année d'ordination, de
                ressusciter une vie chrétienne à l'ISP pouvant conduire à l'émergence d'une aumônerie universitaire.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Le <strong>6 décembre 1984</strong>, une réunion décisive prit la décision de lancer une invitation à
                tous les étudiants pour une séance de prière le <strong>samedi 8 décembre 1984</strong>. Malgré le court
                délai, la première séance fut une grande réussite qui marqua la naissance du "Groupe de prière de
                l'ISP/Mbujimayi".
              </p>

              <h3 className="text-2xl font-bold text-purple-600 mb-4 mt-8">Érection Canonique (18 mai 1986)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                La récollection du 22 juin 1985 aboutit à la création de la{" "}
                <strong>Paroisse Universitaire Saint Raphaël</strong>
                de l'ISP Mbujimayi. Le 18 mai 1986, lors de l'inauguration de la nouvelle salle polyvalente construite
                par le Père Lambrecht, <strong>Monseigneur Joseph Nkongolo</strong> proclama solennellement:
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-600 p-6 my-6">
                <p className="text-gray-800 font-semibold">
                  "Par notre autorité, nous érigeons en ce jour la Paroisse Universitaire St Raphaël de l'ISP/Mbujimayi,
                  en tant que communauté chrétienne en vue de la pastorale auprès des étudiants et des intellectuels de
                  la ville de Mbujimayi."
                </p>
              </div>

              <h3 className="text-2xl font-bold text-purple-600 mb-4 mt-8">
                De Saint Raphaël à Notre-Dame de l'Espérance (1996)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                À partir de 1989, la libéralisation de l'enseignement supérieur en RDC entraîna la création de plusieurs
                universités et instituts supérieurs à Mbujimayi. La paroisse n'était plus limitée à l'ISP.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Le <strong>5 mai 1996</strong>, <strong>Monseigneur Tharcisse Tshibangu</strong>, successeur de Mgr
                Nkongolo, plaça tout le diocèse de Mbujimayi sous le patronage de Marie, Notre Dame de l'Espérance. La
                paroisse fut alors rebaptisée <strong>Paroisse Universitaire Notre Dame de l'Espérance (PUNDE)</strong>.
              </p>

              <h3 className="text-2xl font-bold text-purple-600 mb-4 mt-8">La PUNDE Aujourd'hui</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Aujourd'hui, la PUNDE dispose d'un terrain sur l'avenue de l'Université, au numéro 6 dans la commune de
                Kanshi, où est érigée sa nouvelle église. Les frais de construction sont supportés à 100% par les
                fidèles et les personnes de bonne volonté.
              </p>
              <p className="text-gray-700 leading-relaxed">
                En 2003, Mgr Tshibangu créa l'
                <strong>Association Diocésaine des Cadres Intellectuels et Dirigeants (ADICAD)</strong>, faisant de la
                PUNDE le fleuron de la pastorale des milieux intellectuels et universitaires de Mbujimayi.
              </p>
            </div>
          </div>
        </section>

        {/* Biographies Section */}
        <section id="biographies" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-8">
              <Users className="w-10 h-10 mr-4 text-amber-600" />
              <h2 className="text-4xl font-bold text-gray-900">Les Curés de la PUNDE</h2>
            </div>

            <div className="space-y-8">
              {/* Abbé Mathieu Ilunga */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Abbé Mathieu ILUNGA</h3>
                    <p className="text-amber-600 font-semibold mb-3">1985-1988 (Fondateur)</p>
                    <p className="text-gray-700 leading-relaxed">
                      Premier curé et fondateur de la Paroisse Universitaire. Jeune prêtre d'à peine une année
                      d'ordination, il accepta en 1984 le défi de ressusciter la vie chrétienne à l'ISP/Mbujimayi. Sa
                      vision et son dévouement ont permis la création d'une communauté chrétienne qui a traversé les
                      épreuves du temps. Il dirigea la paroisse pendant 3 ans avant d'être envoyé aux études en
                      Belgique.
                    </p>
                  </div>
                </div>
              </div>

              {/* Abbé Joachim Kadima */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Abbé Joachim KADIMA KADYANGNDU</h3>
                    <p className="text-amber-600 font-semibold mb-3">1988-1989</p>
                    <p className="text-gray-700 leading-relaxed">
                      Deuxième curé de la PUNDE, il assura la continuité pastorale après le départ du fondateur,
                      maintenant la dynamique communautaire établie.
                    </p>
                  </div>
                </div>
              </div>

              {/* Abbé Jean-Pierre Mukendi */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Abbé Jean-Pierre MUKENDI DIFINYA</h3>
                    <p className="text-amber-600 font-semibold mb-3">1989-1992</p>
                    <p className="text-gray-700 leading-relaxed">
                      Durant son ministère de trois ans, il a consolidé les structures paroissiales et développé la vie
                      liturgique de la communauté universitaire.
                    </p>
                  </div>
                </div>
              </div>

              {/* Abbé Célestin Malengu */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Abbé Célestin MALENGU</h3>
                    <p className="text-amber-600 font-semibold mb-3">1992-1993</p>
                    <p className="text-gray-700 leading-relaxed">
                      Son bref mandat coïncida avec une période de transition importante, marquée par la libéralisation
                      de l'enseignement supérieur en RDC.
                    </p>
                  </div>
                </div>
              </div>

              {/* Abbé Alphonse Ngindu Mushete */}
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-amber-300">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Abbé Alphonse NGINDU MUSHETE</h3>
                    <p className="text-amber-600 font-semibold mb-3">1994-2002</p>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Grand professeur de renommée internationale</strong>, membre du comité de gestion de
                      l'Université de Mbujimayi. Il réussit à ouvrir la PUNDE au milieu proprement universitaire,
                      attirant de nombreux professeurs et cadres intellectuels. Son mandat de 8 ans marqua un tournant
                      décisif dans l'affirmation de l'identité universitaire de la paroisse.
                    </p>
                  </div>
                </div>
              </div>

              {/* Abbé Simon Kalenga */}
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-amber-300">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    6
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Abbé Simon KALENGA NSHIMBA</h3>
                    <p className="text-amber-600 font-semibold mb-3">2002-2014</p>
                    <p className="text-gray-700 leading-relaxed">
                      Durant ses 12 années de ministère, il assura l'encadrement spirituel de l'ADICAD (Association
                      Diocésaine des Cadres Intellectuels et Dirigeants) créée en 2003. Il développa la pastorale des
                      intellectuels et renforça les liens avec les entreprises de la ville, notamment la MIBA.
                    </p>
                  </div>
                </div>
              </div>

              {/* Abbé Blaise Kanda */}
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-amber-300">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    7
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Abbé Blaise KANDA</h3>
                    <p className="text-amber-600 font-semibold mb-3">2014 - Présent</p>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Curé actuel de la PUNDE</strong>, figure locale influente connue pour ses prises de
                      position publiques sur les réseaux sociaux et dans les médias, notamment sur les questions de
                      développement urbain et de bonne gouvernance. Sous sa direction, la paroisse poursuit la
                      construction de ses infrastructures propres et maintient son engagement dans la vie civique de
                      Mbujimayi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fidèles de la première heure */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fidèles Laïcs de la Première Heure</h3>
              <p className="text-gray-700 mb-4">
                La PUNDE a vu le jour grâce à l'engagement de nombreux fidèles laïcs. Parmi eux:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <ul className="space-y-2">
                  <li>• Madame Clothilde Kampoyi Kapolo (initiatrice)</li>
                  <li>• Messieurs Mbala Kafiondo</li>
                  <li>• Athanase Mulumba Katootola</li>
                  <li>• Louis Mulumba Nsanza</li>
                  <li>• Lievin Mwamba Kashala</li>
                  <li>• Ngiefu Kitaxe</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Mesdames Marcline Kapinga Kalonji</li>
                  <li>• Scolastique Kankolongo Kalonji</li>
                  <li>• Julie Mbombo</li>
                  <li>• Chantal Muleka</li>
                  <li>• Mesdemoiselles Ursula Dinter</li>
                  <li>• Marie-Agnes Mernier</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4">
                <strong>Vocations sacerdotales issues de la PUNDE:</strong> Abbés Patrick Kabangu, Jean Kambila Bajika,
                et Père Franciscain Benjamin Kabongo.
              </p>
            </div>
          </div>
        </section>

        {/* Video Guide Section */}
        <section id="videos" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-8">
              <Video className="w-10 h-10 mr-4 text-pink-600" />
              <h2 className="text-4xl font-bold text-gray-900">Guide Vidéo</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Témoignages d'Étudiants</h3>
                <p className="text-gray-600">Découvrez les témoignages de foi des étudiants de la PUNDE</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Enseignements et Conférences</h3>
                <p className="text-gray-600">Accédez aux enseignements spirituels et conférences académiques</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Archives des Célébrations</h3>
                <p className="text-gray-600">Revivez les moments forts de la vie liturgique de la paroisse</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Activités Paroissiales</h3>
                <p className="text-gray-600">Présentation des différentes activités et mouvements de la PUNDE</p>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-xl p-6 shadow-md text-center">
              <p className="text-gray-600 mb-4">
                Les ressources vidéo seront bientôt disponibles. Revenez régulièrement pour découvrir les nouveaux
                contenus.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Contactez-Nous</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3">Adresse</h3>
              <p className="text-lg">Avenue de l'Université, N°6</p>
              <p className="text-lg">Commune de Kanshi</p>
              <p className="text-lg">Mbujimayi, République Démocratique du Congo</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Informations</h3>
              <p className="text-lg mb-2">Curé: Abbé Blaise KANDA</p>
              <p className="text-lg mb-2">Diocèse de Mbujimayi</p>
              <p className="text-lg">Paroisse personnelle pour étudiants et intellectuels</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
