import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paroisse Universitaire Notre Dame de l'Espérance | PUNDE",
  description: "Paroisse Universitaire Notre Dame de l'Espérance (PUNDE) - Mbujimayi, République Démocratique du Congo",
}

export default function PUNDEPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">
            Paroisse Universitaire Notre Dame de l'Espérance
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-2">PUNDE</p>
          <p className="text-lg text-white/90">Mbujimayi, République Démocratique du Congo</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <a href="#actualites" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Actualités</h3>
              <p className="text-gray-600 text-sm">Mises à jour hebdomadaires</p>
            </div>
          </a>

          <a href="#histoire" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Histoire</h3>
              <p className="text-gray-600 text-sm">Depuis 1968</p>
            </div>
          </a>

          <a href="#biographies" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Biographies</h3>
              <p className="text-gray-600 text-sm">Prêtres de la PUNDE</p>
            </div>
          </a>

          <a href="#videos" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="w-12 h-12 bg-rose-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Guide Vidéo</h3>
              <p className="text-gray-600 text-sm">Ressources multimédias</p>
            </div>
          </a>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              La Paroisse Universitaire Notre Dame de l'Espérance (PUNDE en sigle) est une Église catholique située à
              Mbujimayi en République Démocratique du Congo (RDC). Elle dispose d'une entrée, d'un parking et des
              toilettes accessibles aux personnes en fauteuil roulant.
            </p>
            <p className="mb-4">
              Culturellement c'est un lieu du culte central, un centre d'apprentissage et de conservation du savoir,
              ainsi qu'un symbole de continuité et d'identité culturelle.
            </p>
            <p>
              Historiquement, elle a influencé la vie quotidienne, la politique et l'art, marquant le rythme de la
              société par ses fêtes, ses sacrements et ses enseignements. C'est un monument patrimonial qui témoigne de
              l'histoire, abrite des œuvres d'art et peut servir de lieu de repos ou de rassemblement pour les
              communautés modernes, renforçant le sentiment d'identité et de stabilité.
            </p>
          </div>
        </div>
      </div>

      {/* Actualités Section */}
      <div id="actualites" className="bg-blue-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Actualités</h2>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
              <p className="text-gray-700 text-lg">
                Section des actualités mise à jour hebdomadairement. Consultez cette section régulièrement pour rester
                informé des événements, célébrations et annonces importantes de la paroisse.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Histoire Section */}
      <div id="histoire" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Histoire de la PUNDE</h2>
            </div>

            <div className="space-y-8">
              {/* Les débuts */}
              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Les Débuts (1968-1985)</h3>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="mb-4">
                    Depuis 1968, plusieurs tentatives d'encadrement spirituel des étudiants eurent lieu à
                    l'ISP/Mbujimayi. La plus importante fut celle qui vit le jour sous l'initiative de Madame Clothilde
                    Kampoyi Kapolo, une ex-religieuse de la congrégation des sœurs de Sainte Thérèse de l'Enfant Jésus
                    du Diocèse de Mbujimayi.
                  </p>
                  <p className="mb-4">
                    En 1996, le père Raphaël Lambrecht, le tout premier Directeur de l'ISP/Mbujimayi, décida de
                    s'impliquer directement. Il contacta l'Abbé Mathieu Ilunga, un jeune prêtre diocésain d'à peine une
                    année d'ordination, pour ressusciter une vie chrétienne à l'ISP pouvant conduire à l'émergence d'une
                    aumônerie universitaire.
                  </p>
                  <p>
                    La première séance de prière du "Groupe de prière de l'ISP/Mbujimayi" eut lieu le{" "}
                    <strong>samedi 8 décembre 1984</strong>, marquant le début d'une nouvelle communauté chrétienne.
                  </p>
                </div>
              </div>

              {/* Fondation */}
              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Fondation de la Paroisse (1985)</h3>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="mb-4">
                    La Paroisse Universitaire Saint Raphaël de l'ISP/Mbujimayi a été{" "}
                    <strong>fondée le 22 juin 1985</strong> lors d'une récollection qui aboutit à la création officielle
                    de la paroisse universitaire.
                  </p>
                  <p>
                    Avec la sortie du premier numéro de la revue trimestrielle "La Chandelle" pendant l'année académique
                    1985-1986, la communauté estudiantine et intellectuelle de Mbujimayi apprit qu'une paroisse
                    universitaire venait de naître à l'ISP.
                  </p>
                </div>
              </div>

              {/* Érection canonique */}
              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Érection Canonique (1986)</h3>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="mb-4">
                    Le <strong>dimanche 18 mai 1986</strong>, Mgr Joseph Nkongolo érigea canoniquement la Paroisse
                    Universitaire Saint Raphaël lors d'une célébration solennelle. Dans son homélie, il déclara :
                  </p>
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
                    "Par notre autorité, nous érigeons en ce jour la Paroisse Universitaire St Raphaël de
                    l'ISP/Mbujimayi, entant que communauté chrétienne en vue de la pastorale auprès des étudiants et des
                    intellectuels de la ville de Mbujimayi."
                  </blockquote>
                  <p>
                    De la sorte, la Paroisse Universitaire St Raphaël était canoniquement érigée en tant qu'une paroisse
                    personnelle, concernant avant tout les étudiants et intellectuels disséminés aux quatre coins de la
                    ville de Mbujimayi.
                  </p>
                </div>
              </div>

              {/* Changement de nom */}
              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  De Saint Raphaël à Notre-Dame de l'Espérance (1992-1996)
                </h3>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="mb-4">
                    En 1992, Mgr Tharcisse Tshibangu succéda à Mgr Nkongolo à la tête du diocèse de Mbujimayi. Le{" "}
                    <strong>5 mai 1996</strong>, il prit une décision épiscopale par laquelle il plaça tout le diocèse
                    de Mbujimayi sous le patronage de Marie, Notre Dame de l'Espérance.
                  </p>
                  <p className="mb-4">
                    Dans ce contexte, il rebaptisa la paroisse Saint Raphaël qui devint la{" "}
                    <strong>"Paroisse Universitaire Notre Dame de l'Espérance" (PUNDE)</strong>.
                  </p>
                  <p>
                    La libéralisation de l'enseignement supérieur à partir de 1989 eut pour effet la création de
                    plusieurs universités et instituts supérieurs à Mbujimayi. La paroisse ne fut plus liée uniquement à
                    l'ISP mais concernait désormais tous les étudiants des différentes institutions d'enseignement
                    supérieur et tout cadre intellectuel de la ville.
                  </p>
                </div>
              </div>

              {/* Aujourd'hui */}
              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">La PUNDE Aujourd'hui</h3>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="mb-4">
                    La PUNDE s'est affirmée comme une communauté chrétienne destinée avant tout à l'encadrement des
                    fidèles issus des milieux universitaires. Elle dispose aujourd'hui d'une adresse physique :{" "}
                    <strong>Avenue de l'Université, numéro 6 dans la commune de Kanshi</strong>.
                  </p>
                  <p className="mb-4">
                    L'Association Diocésaine des Cadres Intellectuels et Dirigeants (A.D.I.C.A.D.) fut créée le dimanche
                    28 août 2003 pour aider à bâtir le Royaume de Dieu dans l'Église et dans le monde. Elle attira de
                    nombreux cadres intellectuels, notamment ceux de la société MIBA et d'autres entreprises de
                    Mbujimayi.
                  </p>
                  <p>
                    La paroisse dispose actuellement d'un terrain sur lequel est érigée sa nouvelle église, dont les
                    frais de construction sont supportés à 100% par les fidèles et personnes de bonne volonté.
                  </p>
                </div>
              </div>

              {/* Impact social */}
              <div className="bg-purple-50 rounded-xl p-6 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Influence Sociale et Morale</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                      <strong>Engagement civique :</strong> Le curé, l'Abbé Blaise KANDA, est une figure locale
                      influente, connu pour ses prises de positions publiques sur les réseaux sociaux et dans les médias
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                      <strong>Infrastructures :</strong> Construction d'une nouvelle église moderne contribuant à la
                      modernisation de la ville
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                      <strong>Santé :</strong> Centre Hospitalier Notre Dame de l'Espérance inauguré en 2009, démontrant
                      l'engagement de l'institution envers la communauté
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biographies Section */}
      <div id="biographies" className="bg-amber-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Biographies des Prêtres de la PUNDE</h2>
            </div>

            <p className="text-gray-700 mb-8 text-lg">
              Six prêtres se sont succédé à la tête de la Paroisse Universitaire Notre Dame de l'Espérance depuis sa
              fondation en 1985.
            </p>

            <div className="space-y-6">
              {/* Abbé Mathieu Ilunga */}
              <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-6 border-l-4 border-amber-600">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">Abbé Mathieu Ilunga</h3>
                  <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                    1985-1988
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Premier curé (Aumônier) de la Paroisse Universitaire de Mbujimayi. Jeune prêtre diocésain d'à peine
                  une année d'ordination lorsqu'il fut contacté par le père Raphaël Lambrecht en 1996 pour ressusciter
                  la vie chrétienne à l'ISP. Il organisa la première séance de prière le 8 décembre 1984 et fonda
                  officiellement la paroisse le 22 juin 1985. Après 3 ans de service (1985-1988), il fut envoyé aux
                  études en Belgique. La communauté qu'il avait suscitée réussit à braver les épreuves du temps.
                </p>
              </div>

              {/* Abbé Joachim Kadima Kadyangndu */}
              <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-6 border-l-4 border-amber-600">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">Abbé Joachim Kadima Kadyangndu</h3>
                  <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                    1988-1989
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Deuxième curé de la PUNDE, il assura la continuité de la paroisse après le départ de l'Abbé Mathieu
                  Ilunga.
                </p>
              </div>

              {/* Abbé Jean-Pierre Mukendi Difinya */}
              <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-6 border-l-4 border-amber-600">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">Abbé Jean-Pierre Mukendi Difinya</h3>
                  <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                    1989-1992
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Troisième curé de la PUNDE, il dirigea la paroisse pendant trois années importantes qui précédèrent
                  l'arrivée de Mgr Tshibangu au diocèse de Mbujimayi.
                </p>
              </div>

              {/* Abbé Célestin Malengu */}
              <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-6 border-l-4 border-amber-600">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">Abbé Célestin Malengu</h3>
                  <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                    1992-1993
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Quatrième curé de la PUNDE, il assura la transition pendant la période où Mgr Tharcisse Tshibangu
                  venait de succéder à Mgr Nkongolo à la tête du diocèse de Mbujimayi.
                </p>
              </div>

              {/* Abbé Alphonse Ngindu Mushete */}
              <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-6 border-l-4 border-amber-600">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">Abbé Alphonse Ngindu Mushete</h3>
                  <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                    1994-2002
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Grand professeur de renommée internationale, professeur et membre du comité de gestion de l'Université
                  de Mbujimayi. Il réussit à ouvrir la PUNDE au milieu proprement universitaire, attirant beaucoup de
                  professeurs et cadres intellectuels de la ville qui devinrent membres à part entière de la paroisse.
                  Son mandat de 8 ans (le plus long) fut marqué par une transformation significative de la paroisse vers
                  une véritable communauté intellectuelle. L'arrivée de nombreux refoulés du Shaba en 1992-1993 donna
                  naissance à une importante chorale dont les mélodies sonores attirèrent de nombreux fidèles des
                  milieux intellectuels et universitaires.
                </p>
              </div>

              {/* Abbé Simon Kalenga Nshimba */}
              <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-6 border-l-4 border-amber-600">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">Abbé Simon Kalenga Nshimba</h3>
                  <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                    2002-2014
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Sixième curé de la PUNDE, il encadra spirituellement l'Association Diocésaine des Cadres Intellectuels
                  et Dirigeants (A.D.I.C.A.D.) créée le 28 août 2003. Son mandat de 12 ans fut marqué par l'expansion de
                  la paroisse auprès des cadres intellectuels, notamment ceux de la société MIBA et des autres
                  entreprises de Mbujimayi, faisant de la PUNDE le fleuron de la pastorale des milieux intellectuels et
                  universitaires de la ville.
                </p>
              </div>

              {/* Abbé Blaise Kanda */}
              <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-6 border-l-4 border-amber-600">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">Abbé Blaise Kanda</h3>
                  <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                    2014-Présent
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Curé actuel de la PUNDE. Figure locale influente, il est connu pour ses prises de positions publiques
                  sur les réseaux sociaux et dans les médias, notamment sur des questions de développement urbain et de
                  bonne gouvernance. Il a appelé au nettoyage des routes récemment asphaltées, démontrant l'implication
                  de la paroisse dans la vie civique de la ville. Sous sa direction, la paroisse poursuit la
                  construction de sa nouvelle église et continue son engagement envers la communauté à travers divers
                  projets sociaux et spirituels.
                </p>
              </div>
            </div>

            {/* Personnel laïc */}
            <div className="mt-12 bg-amber-50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personnel Laïc de la Première Heure</h3>
              <p className="text-gray-700 mb-4">
                La communauté chrétienne de la paroisse universitaire a vu le jour sous l'impulsion des fidèles laïcs.
                Parmi les pionniers :
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Madame Clothilde Kampoyi Kapolo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>M. Mbala Kafiondo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>M. Athanase Mulumba Katootola</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>M. Louis Mulumba Nsanza</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>M. Lievin Mwamba Kashala</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Mme Marcline Kapinga Kalonji</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Mme Scolastique Kankolongo Kalonji</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Mme Julie Mbombo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Mme Chantal Muleka</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Mlle Ursula Dinter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Mlle Marie-Agnes Mernier</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-gray-700 font-semibold">
                  Don de l'engagement des laïcs : Trois fidèles de la première heure sont devenus prêtres :
                </p>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Abbé Patrick Kabangu</li>
                  <li>• Abbé Jean Kambila Bajika</li>
                  <li>• Père Franciscain Benjamin Kabongo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Vidéo Section */}
      <div id="videos" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Guide Vidéo</h2>
            </div>
            <div className="bg-rose-50 border-l-4 border-rose-600 p-6 rounded-r-lg">
              <p className="text-gray-700 text-lg mb-4">
                Section des ressources vidéo et multimédias de la paroisse. Cette section contiendra :
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Célébrations et messes enregistrées</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Homélies et enseignements de l'Abbé Blaise Kanda</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Événements spéciaux et fêtes liturgiques</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Performances de la chorale paroissiale</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Témoignages de fidèles et membres de la communauté</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Paroisse Universitaire Notre Dame de l'Espérance</h3>
          <p className="text-gray-300 mb-2">Avenue de l'Université, numéro 6</p>
          <p className="text-gray-300 mb-6">Commune de Kanshi, Mbujimayi, RDC</p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              Fondée en 1985 • Érigée canoniquement en 1986 • Au service des intellectuels et universitaires depuis plus
              de 40 ans
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
