"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Users, Rocket, Calendar, FileText } from "lucide-react"
import { CalculatorButton } from "@/components/ui/calculator-button"
import { useLcarsTheme } from "@/components/lcars-theme-provider"
import { KlingonText } from "./klingon-mode"

interface TrekDatabaseProps {
  onClose: () => void
  klingonMode?: boolean
}

// Database content
const TREK_SERIES = [
  {
    id: "tos",
    name: "The Original Series",
    years: "1966-1969",
    abbreviation: "TOS",
    color: "bg-yellow-400",
    seasons: 3,
    episodes: 79,
    starship: "USS Enterprise NCC-1701",
    captain: "James T. Kirk",
    setting: "2265-2269",
    description:
      "The adventures of the USS Enterprise and its crew as they explore the galaxy, make first contact with new civilizations, and defend the United Federation of Planets.",
    mainCharacters: "Kirk, Spock, McCoy, Scott, Uhura, Sulu, Chekov",
    notableAchievements:
      "Groundbreaking for its diverse cast and tackling of social issues through science fiction allegory. First interracial kiss on American television.",
  },
  {
    id: "tng",
    name: "The Next Generation",
    years: "1987-1994",
    abbreviation: "TNG",
    color: "bg-blue-400",
    seasons: 7,
    episodes: 178,
    starship: "USS Enterprise NCC-1701-D",
    captain: "Jean-Luc Picard",
    setting: "2364-2370",
    description:
      "Set nearly a century after the original series, TNG follows a new crew aboard the Enterprise-D as they continue the mission to explore strange new worlds and seek out new civilizations.",
    mainCharacters: "Picard, Riker, Data, Worf, Crusher, Troi, La Forge",
    notableAchievements:
      "Revitalized the Star Trek franchise and expanded the universe with deeper character development and more complex storytelling.",
  },
  {
    id: "ds9",
    name: "Deep Space Nine",
    years: "1993-1999",
    abbreviation: "DS9",
    color: "bg-pink-500",
    seasons: 7,
    episodes: 176,
    starship: "USS Defiant / Space Station Deep Space 9",
    captain: "Benjamin Sisko",
    setting: "2369-2375",
    description:
      "Set on a space station near the planet Bajor and a stable wormhole that provides access to the distant Gamma Quadrant, DS9 deals with themes of religion, politics, and war.",
    mainCharacters: "Sisko, Kira, Odo, Dax, Bashir, O'Brien, Quark",
    notableAchievements:
      "First Star Trek series to feature a space station rather than a starship as its primary setting. Known for its serialized storytelling and darker themes.",
  },
  {
    id: "voy",
    name: "Voyager",
    years: "1995-2001",
    abbreviation: "VOY",
    color: "bg-orange-500",
    seasons: 7,
    episodes: 172,
    starship: "USS Voyager NCC-74656",
    captain: "Kathryn Janeway",
    setting: "2371-2378",
    description:
      "The adventures of the USS Voyager, stranded 70,000 light-years from Earth in the Delta Quadrant, as they attempt to find their way home.",
    mainCharacters: "Janeway, Chakotay, Tuvok, Seven of Nine, Paris, Torres, Kim, The Doctor",
    notableAchievements:
      "First Star Trek series with a female captain as the lead character. Explored themes of isolation and the challenges of integrating different crews.",
  },
  {
    id: "ent",
    name: "Enterprise",
    years: "2001-2005",
    abbreviation: "ENT",
    color: "bg-cyan-400",
    seasons: 4,
    episodes: 98,
    starship: "Enterprise NX-01",
    captain: "Jonathan Archer",
    setting: "2151-2155",
    description:
      "A prequel set before the formation of the Federation, following Earth's first deep space exploration vessel and the early days of human interstellar travel.",
    mainCharacters: "Archer, T'Pol, Tucker, Reed, Sato, Mayweather, Phlox",
    notableAchievements:
      "Explored the early history of the Star Trek universe, including first contact with many familiar species and the formation of the Federation.",
  },
  {
    id: "dsc",
    name: "Discovery",
    years: "2017-2024",
    abbreviation: "DSC",
    color: "bg-purple-500",
    seasons: 5,
    episodes: 65,
    starship: "USS Discovery NCC-1031",
    captain: "Various (Lorca, Pike, Saru, Burnham)",
    setting: "2250s / 32nd century",
    description:
      "Initially set roughly a decade before TOS, Discovery later jumps to the 32nd century, exploring the far future of the Star Trek universe.",
    mainCharacters: "Burnham, Saru, Stamets, Tilly, Culber, Georgiou, Book",
    notableAchievements:
      "Introduced the spore drive technology and was the first Star Trek series to feature a Black female lead. Later seasons explore a far-future Federation.",
  },
  {
    id: "pic",
    name: "Picard",
    years: "2020-2023",
    abbreviation: "PIC",
    color: "bg-red-500",
    seasons: 3,
    episodes: 30,
    starship: "La Sirena / USS Stargazer",
    captain: "Jean-Luc Picard (retired)",
    setting: "2399-2401",
    description:
      "Set 20 years after the events of Star Trek: Nemesis, the series follows a retired Jean-Luc Picard as he deals with new threats and old friends.",
    mainCharacters: "Picard, Raffi, Rios, Jurati, Elnor, Seven of Nine, Soji",
    notableAchievements:
      "Continued the story of beloved TNG characters while exploring themes of aging, legacy, and artificial intelligence.",
  },
  {
    id: "snw",
    name: "Strange New Worlds",
    years: "2022-Present",
    abbreviation: "SNW",
    color: "bg-green-500",
    seasons: 2,
    episodes: 20,
    starship: "USS Enterprise NCC-1701",
    captain: "Christopher Pike",
    setting: "2259-2260s",
    description:
      "Set in the decade before TOS, following Captain Pike, Science Officer Spock, and the crew of the USS Enterprise as they explore new worlds throughout the galaxy.",
    mainCharacters: "Pike, Spock, Una, La'an, Chapel, Uhura, M'Benga, Ortegas",
    notableAchievements:
      "Return to the episodic format of classic Trek while maintaining modern production values and character development.",
  },
]

const FAMOUS_EPISODES = [
  {
    id: "tos-balance-of-terror",
    title: "Balance of Terror",
    series: "tos",
    season: 1,
    episode: 14,
    stardate: "1709.2",
    description: "The Enterprise must destroy a Romulan ship that has been attacking Federation outposts.",
    significance: "First appearance of the Romulans and exploration of the futility of war.",
  },
  {
    id: "tos-city-on-the-edge",
    title: "The City on the Edge of Forever",
    series: "tos",
    season: 1,
    episode: 28,
    stardate: "3134.0",
    description: "McCoy accidentally changes history, and Kirk must make a painful decision to restore the timeline.",
    significance: "Often cited as one of the best episodes of the original series.",
  },
  {
    id: "tng-best-of-both-worlds",
    title: "The Best of Both Worlds",
    series: "tng",
    season: 3,
    episode: 26,
    stardate: "43989.1",
    description: "Captain Picard is captured and assimilated by the Borg, who then head towards Earth.",
    significance: "One of the most famous cliffhangers in television history.",
  },
  {
    id: "tng-inner-light",
    title: "The Inner Light",
    series: "tng",
    season: 5,
    episode: 25,
    stardate: "45944.1",
    description: "Picard lives out another man's life after being struck by an alien probe.",
    significance: "Won the Hugo Award for Best Dramatic Presentation.",
  },
  {
    id: "ds9-in-the-pale-moonlight",
    title: "In the Pale Moonlight",
    series: "ds9",
    season: 6,
    episode: 19,
    stardate: "51721.3",
    description: "Sisko compromises his principles to bring the Romulans into the Dominion War.",
    significance: "Explores the moral compromises made during wartime.",
  },
  {
    id: "ds9-far-beyond-the-stars",
    title: "Far Beyond the Stars",
    series: "ds9",
    season: 6,
    episode: 13,
    stardate: "Unknown",
    description: "Sisko experiences life as a science fiction writer in 1950s America.",
    significance: "Powerful commentary on racism and the power of imagination.",
  },
  {
    id: "voy-scorpion",
    title: "Scorpion",
    series: "voy",
    season: 3,
    episode: 26,
    stardate: "50984.3",
    description: "Voyager forms an alliance with the Borg to fight Species 8472.",
    significance: "Introduction of Seven of Nine and a major turning point for the series.",
  },
  {
    id: "voy-year-of-hell",
    title: "Year of Hell",
    series: "voy",
    season: 4,
    episode: "8-9",
    stardate: "51268.4",
    description: "Voyager becomes trapped in a temporal war and faces a year of continuous attacks.",
    significance: "Dark exploration of Captain Janeway's determination.",
  },
]

const FAMOUS_CHARACTERS = [
  {
    id: "kirk",
    name: "James T. Kirk",
    series: ["tos"],
    rank: "Captain",
    species: "Human",
    actor: "William Shatner",
    description: "The bold, intuitive captain of the USS Enterprise who relies on his gut instincts.",
  },
  {
    id: "spock",
    name: "Spock",
    series: ["tos", "tng"],
    rank: "Commander/Ambassador",
    species: "Vulcan/Human",
    actor: "Leonard Nimoy",
    description: "Half-Vulcan science officer who struggles with his logical Vulcan side and emotional human side.",
  },
  {
    id: "picard",
    name: "Jean-Luc Picard",
    series: ["tng", "pic"],
    rank: "Captain/Admiral",
    species: "Human",
    actor: "Patrick Stewart",
    description: "Diplomatic and thoughtful captain who leads through wisdom and careful consideration.",
  },
  {
    id: "data",
    name: "Data",
    series: ["tng"],
    rank: "Lieutenant Commander",
    species: "Android",
    actor: "Brent Spiner",
    description: "An android seeking to understand humanity and become more human himself.",
  },
  {
    id: "sisko",
    name: "Benjamin Sisko",
    series: ["ds9"],
    rank: "Commander/Captain",
    species: "Human",
    actor: "Avery Brooks",
    description: "Reluctant commander of Deep Space Nine who becomes a religious icon to the Bajorans.",
  },
  {
    id: "janeway",
    name: "Kathryn Janeway",
    series: ["voy"],
    rank: "Captain/Admiral",
    species: "Human",
    actor: "Kate Mulgrew",
    description: "Determined captain who leads her crew through the Delta Quadrant while maintaining principles.",
  },
  {
    id: "seven",
    name: "Seven of Nine",
    series: ["voy", "pic"],
    rank: "Civilian",
    species: "Human (former Borg)",
    actor: "Jeri Ryan",
    description: "Former Borg drone who struggles to reclaim her humanity aboard Voyager.",
  },
  {
    id: "pike",
    name: "Christopher Pike",
    series: ["tos", "dsc", "snw"],
    rank: "Captain",
    species: "Human",
    actor: "Anson Mount",
    description: "Honorable captain of the Enterprise before Kirk, known for his ethical leadership.",
  },
]

const FAMOUS_QUOTES = [
  {
    quote: "Space: the final frontier. These are the voyages of the starship Enterprise...",
    character: "Captain Kirk",
    series: "tos",
  },
  {
    quote: "Live long and prosper.",
    character: "Spock",
    series: "tos",
  },
  {
    quote: "The needs of the many outweigh the needs of the few, or the one.",
    character: "Spock",
    series: "tos",
  },
  {
    quote: "Make it so.",
    character: "Captain Picard",
    series: "tng",
  },
  {
    quote: "Resistance is futile.",
    character: "The Borg",
    series: "tng",
  },
  {
    quote: "It is possible to commit no mistakes and still lose. That is not weakness, that is life.",
    character: "Captain Picard",
    series: "tng",
  },
  {
    quote: "I am not a merry man!",
    character: "Worf",
    series: "tng",
  },
  {
    quote: "In the pale moonlight...",
    character: "Captain Sisko",
    series: "ds9",
  },
  {
    quote: "There's coffee in that nebula.",
    character: "Captain Janeway",
    series: "voy",
  },
  {
    quote: "Logic is the beginning of wisdom, not the end.",
    character: "Spock",
    series: "tos",
  },
]

export function TrekDatabase({ onClose, klingonMode = false }: TrekDatabaseProps) {
  const { colors } = useLcarsTheme()
  const [activeSection, setActiveSection] = useState<"episodes" | "characters" | "series" | "quotes">("episodes")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeries, setSelectedSeries] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // Filter data based on search term and selected series
  const filteredEpisodes = FAMOUS_EPISODES.filter(
    (episode) =>
      (searchTerm === "" ||
        episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        episode.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSeries.length === 0 || selectedSeries.includes(episode.series)),
  )

  // Also fix the filteredCharacters function to handle potential undefined series
  const filteredCharacters = FAMOUS_CHARACTERS.filter((character) => {
    // Ensure character.series is always an array
    const seriesArray = Array.isArray(character.series) ? character.series : character.series ? [character.series] : []

    return (
      (searchTerm === "" ||
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSeries.length === 0 || seriesArray.some((s) => selectedSeries.includes(s)))
    )
  })

  const filteredQuotes = FAMOUS_QUOTES.filter(
    (quote) =>
      (searchTerm === "" ||
        quote.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.character.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSeries.length === 0 || selectedSeries.includes(quote.series)),
  )

  // Handle series filter toggle
  const toggleSeriesFilter = (seriesId: string) => {
    if (selectedSeries.includes(seriesId)) {
      setSelectedSeries(selectedSeries.filter((id) => id !== seriesId))
    } else {
      setSelectedSeries([...selectedSeries, seriesId])
    }
  }

  // Handle item selection
  const handleItemSelect = (item: any) => {
    setSelectedItem(item)
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedItem(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="w-full max-w-6xl h-[90vh] bg-gray-950 rounded-lg overflow-hidden border-2 border-orange-500"
      >
        {/* Header */}
        <div className="bg-black p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`h-8 w-16 ${colors.primary} rounded-l-full`}></div>
              <div className={`h-8 flex-grow ${colors.secondary} mx-1 flex items-center justify-center px-4`}>
                <h1 className="text-black text-xl font-bold tracking-wider">
                  <KlingonText enabled={klingonMode}>STARFLEET DATABASE ACCESS</KlingonText>
                </h1>
              </div>
              <div className={`h-8 w-24 ${colors.accent} rounded-r-full`}></div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-orange-500 hover:text-orange-400"
            >
              <X size={24} />
            </motion.button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-yellow-400 text-sm">
              <KlingonText enabled={klingonMode}>SECURITY CLEARANCE: LEVEL 9</KlingonText>
            </div>
            <div className="text-orange-500 text-sm">
              <KlingonText enabled={klingonMode}>STARDATE: 47634.44</KlingonText>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-900 p-4 flex flex-wrap gap-2 items-center">
          <div className="flex-1 flex items-center bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-2 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder={klingonMode ? "nej..." : "Search..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-orange-500 p-2 flex-1 focus:outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="p-2 text-gray-400 hover:text-orange-500">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {TREK_SERIES.map((series) => (
              <motion.button
                key={series.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSeriesFilter(series.id)}
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedSeries.includes(series.id) ? `${series.color} text-black` : "bg-gray-800 text-gray-400"
                }`}
              >
                {series.abbreviation}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-black">
          <TabButton
            active={activeSection === "episodes"}
            onClick={() => setActiveSection("episodes")}
            icon={<FileText size={16} />}
            label={klingonMode ? "qonwI'" : "Episodes"}
          />
          <TabButton
            active={activeSection === "characters"}
            onClick={() => setActiveSection("characters")}
            icon={<Users size={16} />}
            label={klingonMode ? "ghot" : "Characters"}
          />
          <TabButton
            active={activeSection === "series"}
            onClick={() => setActiveSection("series")}
            icon={<Rocket size={16} />}
            label={klingonMode ? "Hovmey" : "Series"}
          />
          <TabButton
            active={activeSection === "quotes"}
            onClick={() => setActiveSection("quotes")}
            icon={<Calendar size={16} />}
            label={klingonMode ? "mu'mey" : "Quotes"}
          />
        </div>

        {/* Content Area */}
        <div className="flex h-[calc(90vh-220px)]">
          {/* Left Panel - List */}
          <div className="w-1/3 bg-gray-900 overflow-y-auto border-r border-gray-800">
            <AnimatePresence mode="wait">
              {activeSection === "episodes" && (
                <motion.div key="episodes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {filteredEpisodes.map((episode) => {
                    const series = TREK_SERIES.find((s) => s.id === episode.series)
                    return (
                      <motion.div
                        key={episode.id}
                        whileHover={{ backgroundColor: "rgba(255,165,0,0.1)" }}
                        onClick={() => handleItemSelect(episode)}
                        className={`p-3 border-b border-gray-800 cursor-pointer ${
                          selectedItem?.id === episode.id ? "bg-gray-800" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-8 ${series?.color || "bg-gray-500"} rounded-sm`}></div>
                          <div>
                            <div className="text-orange-500 font-medium">
                              <KlingonText enabled={klingonMode}>{episode.title}</KlingonText>
                            </div>
                            <div className="text-gray-400 text-sm">
                              <KlingonText enabled={klingonMode}>
                                {series?.abbreviation} • S{episode.season}E{episode.episode}
                              </KlingonText>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  {filteredEpisodes.length === 0 && (
                    <div className="p-4 text-gray-500 text-center">
                      <KlingonText enabled={klingonMode}>No episodes found</KlingonText>
                    </div>
                  )}
                </motion.div>
              )}

              {activeSection === "characters" && (
                <motion.div key="characters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {filteredCharacters.map((character) => (
                    <motion.div
                      key={character.id}
                      whileHover={{ backgroundColor: "rgba(255,165,0,0.1)" }}
                      onClick={() => handleItemSelect(character)}
                      className={`p-3 border-b border-gray-800 cursor-pointer ${
                        selectedItem?.id === character.id ? "bg-gray-800" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-8 ${
                            character.series.includes("tos")
                              ? "bg-yellow-400"
                              : character.series.includes("tng")
                                ? "bg-blue-400"
                                : character.series.includes("ds9")
                                  ? "bg-pink-500"
                                  : character.series.includes("voy")
                                    ? "bg-orange-500"
                                    : "bg-gray-500"
                          } rounded-sm`}
                        ></div>
                        <div>
                          <div className="text-orange-500 font-medium">
                            <KlingonText enabled={klingonMode}>{character.name}</KlingonText>
                          </div>
                          <div className="text-gray-400 text-sm">
                            <KlingonText enabled={klingonMode}>
                              {character.rank} • {character.species}
                            </KlingonText>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {filteredCharacters.length === 0 && (
                    <div className="p-4 text-gray-500 text-center">
                      <KlingonText enabled={klingonMode}>No characters found</KlingonText>
                    </div>
                  )}
                </motion.div>
              )}

              {activeSection === "series" && (
                <motion.div key="series" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {TREK_SERIES.map((series) => (
                    <motion.div
                      key={series.id}
                      whileHover={{ backgroundColor: "rgba(255,165,0,0.1)" }}
                      onClick={() => handleItemSelect(series)}
                      className={`p-3 border-b border-gray-800 cursor-pointer ${
                        selectedItem?.id === series.id ? "bg-gray-800" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-8 ${series.color} rounded-sm`}></div>
                        <div>
                          <div className="text-orange-500 font-medium">
                            <KlingonText enabled={klingonMode}>Star Trek: {series.name}</KlingonText>
                          </div>
                          <div className="text-gray-400 text-sm">
                            <KlingonText enabled={klingonMode}>{series.years}</KlingonText>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeSection === "quotes" && (
                <motion.div key="quotes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {filteredQuotes.map((quote, index) => {
                    const series = TREK_SERIES.find((s) => s.id === quote.series)
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ backgroundColor: "rgba(255,165,0,0.1)" }}
                        onClick={() => handleItemSelect(quote)}
                        className={`p-3 border-b border-gray-800 cursor-pointer ${
                          selectedItem === quote ? "bg-gray-800" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-8 ${series?.color || "bg-gray-500"} rounded-sm`}></div>
                          <div>
                            <div className="text-orange-500 font-medium">
                              <KlingonText enabled={klingonMode}>"{quote.quote.substring(0, 30)}..."</KlingonText>
                            </div>
                            <div className="text-gray-400 text-sm">
                              <KlingonText enabled={klingonMode}>{quote.character}</KlingonText>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  {filteredQuotes.length === 0 && (
                    <div className="p-4 text-gray-500 text-center">
                      <KlingonText enabled={klingonMode}>No quotes found</KlingonText>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Details */}
          <div className="w-2/3 bg-gray-950 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedItem ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeSection === "episodes" && <EpisodeDetails episode={selectedItem} klingonMode={klingonMode} />}
                  {activeSection === "characters" && (
                    <CharacterDetails character={selectedItem} klingonMode={klingonMode} />
                  )}
                  {activeSection === "series" && <SeriesDetails series={selectedItem} klingonMode={klingonMode} />}
                  {activeSection === "quotes" && <QuoteDetails quote={selectedItem} klingonMode={klingonMode} />}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-gray-500"
                >
                  <div className="w-24 h-24 mb-4 opacity-30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" fill="currentColor">
                      <path d="M96 16l28 48h-56l28-48zm-32 56h64l-32 56-32-56zm-16 64l28-48 28 48h-56zm80 0l28-48 28 48h-56z" />
                    </svg>
                  </div>
                  <p className="text-lg">
                    <KlingonText enabled={klingonMode}>Select an item to view details</KlingonText>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black p-4">
          <div className="flex items-center">
            <div className={`h-6 w-32 ${colors.primary} rounded-l-full`}></div>
            <div className={`h-6 flex-grow ${colors.secondary} mx-1`}></div>
            <div className={`h-6 w-16 ${colors.accent} rounded-r-full`}></div>
          </div>
          <div className="text-gray-500 text-xs text-center mt-2">
            <KlingonText enabled={klingonMode}>
              LCARS ACCESS TERMINAL • STARFLEET COMMAND • AUTHORIZED PERSONNEL ONLY
            </KlingonText>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <motion.button
      whileHover={{ backgroundColor: active ? "" : "rgba(255,165,0,0.1)" }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 ${
        active ? "bg-gray-900 text-orange-500" : "bg-black text-gray-400"
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  )
}

// Fix the CharacterDetails component to handle cases where character.series might be undefined
function CharacterDetails({ character, klingonMode }: { character: any; klingonMode: boolean }) {
  // Ensure character.series is always an array
  const seriesArray = Array.isArray(character.series) ? character.series : character.series ? [character.series] : []

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-4 h-16 ${
            seriesArray.includes("tos")
              ? "bg-yellow-400"
              : seriesArray.includes("tng")
                ? "bg-blue-400"
                : seriesArray.includes("ds9")
                  ? "bg-pink-500"
                  : seriesArray.includes("voy")
                    ? "bg-orange-500"
                    : "bg-gray-500"
          } rounded-sm`}
        ></div>
        <div>
          <h2 className="text-2xl text-orange-500 font-bold">
            <KlingonText enabled={klingonMode}>{character.name}</KlingonText>
          </h2>
          <div className="text-yellow-400">
            <KlingonText enabled={klingonMode}>
              {character.rank} • {character.species}
            </KlingonText>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">
            <KlingonText enabled={klingonMode}>ACTOR</KlingonText>
          </div>
          <div className="text-orange-500">
            <KlingonText enabled={klingonMode}>{character.actor}</KlingonText>
          </div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">
            <KlingonText enabled={klingonMode}>SERIES</KlingonText>
          </div>
          <div className="text-orange-500">
            {seriesArray.map((seriesId: string) => {
              const series = TREK_SERIES.find((s) => s.id === seriesId)
              return (
                <span key={seriesId} className="mr-2">
                  <KlingonText enabled={klingonMode}>{series?.abbreviation}</KlingonText>
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-yellow-400 mb-2">
          <KlingonText enabled={klingonMode}>BIOGRAPHY</KlingonText>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-gray-300">
          <KlingonText enabled={klingonMode}>{character.description}</KlingonText>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <CalculatorButton variant="orange" className="text-sm">
          <KlingonText enabled={klingonMode}>ACCESS PERSONNEL FILE</KlingonText>
        </CalculatorButton>
      </div>
    </div>
  )
}

function SeriesDetails({ series, klingonMode }: { series: any; klingonMode: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-4 h-16 ${series.color} rounded-sm`}></div>
        <div>
          <h2 className="text-2xl text-orange-500 font-bold">
            <KlingonText enabled={klingonMode}>Star Trek: {series.name}</KlingonText>
          </h2>
          <div className="text-yellow-400">
            <KlingonText enabled={klingonMode}>{series.years}</KlingonText>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">
            <KlingonText enabled={klingonMode}>ABBREVIATION</KlingonText>
          </div>
          <div className="text-orange-500">{series.abbreviation}</div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">
            <KlingonText enabled={klingonMode}>ERA</KlingonText>
          </div>
          <div className="text-orange-500">
            <KlingonText enabled={klingonMode}>{series.years}</KlingonText>
          </div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">
            <KlingonText enabled={klingonMode}>SEASONS</KlingonText>
          </div>
          <div className="text-orange-500">{series.seasons}</div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">
            <KlingonText enabled={klingonMode}>EPISODES</KlingonText>
          </div>
          <div className="text-orange-500">{series.episodes}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-yellow-400 mb-2">
          <KlingonText enabled={klingonMode}>PRIMARY VESSEL</KlingonText>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-gray-300">
          <KlingonText enabled={klingonMode}>{series.starship}</KlingonText>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-yellow-400 mb-2">
          <KlingonText enabled={klingonMode}>COMMANDING OFFICER</KlingonText>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-gray-300">
          <KlingonText enabled={klingonMode}>{series.captain}</KlingonText>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-yellow-400 mb-2">
          <KlingonText enabled={klingonMode}>SETTING</KlingonText>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-gray-300">
          <KlingonText enabled={klingonMode}>{series.setting}</KlingonText>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-yellow-400 mb-2">
          <KlingonText enabled={klingonMode}>DESCRIPTION</KlingonText>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-gray-300">
          <KlingonText enabled={klingonMode}>{series.description}</KlingonText>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-yellow-400 mb-2">
          <KlingonText enabled={klingonMode}>MAIN CHARACTERS</KlingonText>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-gray-300">
          <KlingonText enabled={klingonMode}>{series.mainCharacters}</KlingonText>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-yellow-400 mb-2">
          <KlingonText enabled={klingonMode}>NOTABLE ACHIEVEMENTS</KlingonText>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-gray-300">
          <KlingonText enabled={klingonMode}>{series.notableAchievements}</KlingonText>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <CalculatorButton variant="orange" className="text-sm">
          <KlingonText enabled={klingonMode}>ACCESS FULL EPISODE LIST</KlingonText>
        </CalculatorButton>
      </div>
    </div>
  )
}

function QuoteDetails({ quote, klingonMode }: { quote: any; klingonMode: boolean }) {
  const series = TREK_SERIES.find((s) => s.id === quote.series)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-4 h-16 ${series?.color || "bg-gray-500"} rounded-sm`}></div>
        <div>
          <h2 className="text-2xl text-orange-500 font-bold">
            <KlingonText enabled={klingonMode}>{quote.character}</KlingonText>
          </h2>
          <div className="text-yellow-400">
            <KlingonText enabled={klingonMode}>Star Trek: {series?.name}</KlingonText>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-yellow-400 mb-2">
          <KlingonText enabled={klingonMode}>QUOTE</KlingonText>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg text-gray-300 text-lg italic">
          <KlingonText enabled={klingonMode}>"{quote.quote}"</KlingonText>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <CalculatorButton variant="orange" className="text-sm">
          <KlingonText enabled={klingonMode}>ADD TO FAVORITES</KlingonText>
        </CalculatorButton>
      </div>
    </div>
  )
}

function EpisodeDetails({ episode, klingonMode }: { episode: any; klingonMode: boolean }) {
  const series = TREK_SERIES.find((s) => s.id === episode.series)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-4 h-16 ${series?.color || "bg-gray-500"} rounded-sm`}></div>
        <div>
          <h2 className="text-2xl text-orange-500 font-bold">
            <KlingonText enabled={klingonMode}>{episode.title}</KlingonText>
          </h2>
          <div className="text-yellow-400">
            <KlingonText enabled={klingonMode}>
              {series?.name} • S{episode.season}E{episode.episode}
            </KlingonText>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">
            <KlingonText enabled={klingonMode}>SERIES</KlingonText>
          </div>
          <div className="text-orange-500">
            <KlingonText enabled={klingonMode}>{series?.name}</KlingonText>
          </div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">
            <KlingonText enabled={klingonMode}>SEASON</KlingonText>
          </div>
          <div className="text-orange-500">
            <KlingonText enabled={klingonMode}>{episode.season}</KlingonText>
          </div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">
            <KlingonText enabled={klingonMode}>EPISODE</KlingonText>
          </div>
          <div className="text-orange-500">
            <KlingonText enabled={klingonMode}>{episode.episode}</KlingonText>
          </div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">
            <KlingonText enabled={klingonMode}>STARDATE</KlingonText>
          </div>
          <div className="text-orange-500">
            <KlingonText enabled={klingonMode}>{episode.stardate}</KlingonText>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-yellow-400 mb-2">
          <KlingonText enabled={klingonMode}>DESCRIPTION</KlingonText>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-gray-300">
          <KlingonText enabled={klingonMode}>{episode.description}</KlingonText>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-yellow-400 mb-2">
          <KlingonText enabled={klingonMode}>SIGNIFICANCE</KlingonText>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg text-gray-300">
          <KlingonText enabled={klingonMode}>{episode.significance}</KlingonText>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <CalculatorButton variant="orange" className="text-sm">
          <KlingonText enabled={klingonMode}>ACCESS FULL TRANSCRIPT</KlingonText>
        </CalculatorButton>
      </div>
    </div>
  )
}
