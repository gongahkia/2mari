type AnalysisResult = {
  topic: string
  emotion: string
}

const topics = [
  "technology", "politics", "sports", "entertainment", "science",
  "health", "business", "education", "environment", "travel",
  "food", "fashion", "music", "art", "literature", "history",
  "philosophy", "religion", "psychology", "sociology"
];

const emotions = [
  "happy", "sad", "angry", "excited", "neutral",
  "anxious", "surprised", "disgusted", "fearful", "content",
  "proud", "ashamed", "grateful", "jealous", "nostalgic",
  "hopeful", "frustrated", "amused", "confused", "inspired"
];

const topicKeywords: { [key: string]: string[] } = {
  technology: ["computer", "software", "hardware", "internet", "digital", "AI", "robot", "code", "innovation", "tech", "programming", "algorithm", "database", "cybersecurity", "network", "gadget"],
  politics: ["government", "election", "policy", "vote", "law", "president", "democracy", "party", "congress", "senator", "campaign", "legislation", "politician", "debate", "constitution", "diplomacy"],
  sports: ["game", "team", "player", "score", "championship", "athlete", "coach", "tournament", "league", "stadium", "fitness", "competition", "Olympic", "medal", "referee", "training"],
  entertainment: ["movie", "celebrity", "show", "actor", "film", "TV", "music", "performance", "concert", "theater", "streaming", "award", "director", "screenplay", "box office", "premiere"],
  science: ["research", "experiment", "theory", "discovery", "scientist", "lab", "study", "data", "hypothesis", "analysis", "physics", "chemistry", "biology", "astronomy", "genetics", "quantum"],
  health: ["doctor", "medicine", "hospital", "disease", "treatment", "wellness", "diet", "exercise", "diagnosis", "therapy", "vaccination", "nutrition", "mental health", "surgery", "pharmacy", "prevention"],
  business: ["company", "market", "finance", "economy", "startup", "investor", "profit", "industry", "stock", "entrepreneur", "CEO", "revenue", "strategy", "merger", "acquisition", "commerce"],
  education: ["school", "student", "teacher", "learning", "university", "degree", "curriculum", "classroom", "exam", "lecture", "homework", "diploma", "scholarship", "academic", "tutor", "education"],
  environment: ["climate", "pollution", "sustainability", "ecology", "renewable", "conservation", "green", "nature", "biodiversity", "ecosystem", "recycling", "emissions", "wildlife", "energy", "organic", "habitat"],
  travel: ["vacation", "tourism", "destination", "hotel", "flight", "adventure", "culture", "sightseeing", "passport", "resort", "itinerary", "excursion", "backpacking", "cruise", "landmark", "souvenir"],
  food: ["cuisine", "recipe", "restaurant", "chef", "ingredient", "flavor", "cooking", "meal", "gourmet", "delicious", "appetizer", "dessert", "organic", "vegetarian", "culinary", "nutrition"],
  fashion: ["style", "trend", "designer", "clothing", "runway", "model", "accessory", "brand", "couture", "textile", "vintage", "fashion week", "collection", "boutique", "fabric", "costume"],
  music: ["song", "artist", "album", "concert", "instrument", "genre", "melody", "rhythm", "lyrics", "band", "composer", "symphony", "playlist", "musical", "recording", "harmony"],
  art: ["painting", "sculpture", "gallery", "artist", "exhibition", "museum", "canvas", "creativity", "masterpiece", "abstract", "portrait", "installation", "curator", "auction", "palette", "mural"],
  literature: ["book", "author", "novel", "poetry", "fiction", "literature", "writing", "publisher", "character", "plot", "genre", "bestseller", "manuscript", "narrative", "literary", "chapter"],
  history: ["past", "civilization", "era", "historical", "artifact", "timeline", "revolution", "ancient", "heritage", "archaeology", "dynasty", "medieval", "chronicle", "empire", "historian", "legacy"],
  philosophy: ["ethics", "logic", "metaphysics", "philosopher", "ideology", "existentialism", "rationalism", "epistemology", "morality", "consciousness", "skepticism", "ontology", "dialectic", "empiricism", "phenomenology", "stoicism"],
  religion: ["faith", "belief", "spiritual", "worship", "divine", "sacred", "ritual", "theology", "doctrine", "scripture", "prayer", "devotion", "religious", "meditation", "pilgrimage", "congregation"],
  psychology: ["behavior", "mind", "cognitive", "therapy", "personality", "psychology", "mental", "emotion", "perception", "consciousness", "subconscious", "psychoanalysis", "counseling", "neuropsychology", "psychotherapy", "behavioral"],
  sociology: ["society", "culture", "social", "community", "demographic", "ethnicity", "inequality", "sociological", "institution", "population", "urbanization", "globalization", "diversity", "subculture", "social class", "social change"]
};

const emotionKeywords: { [key: string]: string[] } = {
  happy: ["joy", "delight", "cheerful", "pleased", "glad", "elated", "blissful", "ecstatic", "jubilant", "thrilled", "overjoyed", "gleeful", "merry", "jolly", "radiant", "beaming"],
  sad: ["sorrow", "unhappy", "depressed", "gloomy", "heartbroken", "melancholy", "downcast", "miserable", "woeful", "grief-stricken", "despondent", "dejected", "crestfallen", "dismal", "forlorn", "somber"],
  angry: ["furious", "enraged", "irritated", "annoyed", "frustrated", "mad", "irate", "livid", "outraged", "incensed", "indignant", "exasperated", "heated", "fuming", "seething", "bitter"],
  excited: ["thrilled", "enthusiastic", "eager", "animated", "energetic", "pumped", "exhilarated", "elated", "jubilant", "zealous", "passionate", "fervent", "ardent", "electrified", "stimulated", "invigorated"],
  anxious: ["worried", "nervous", "uneasy", "apprehensive", "stressed", "concerned", "jittery", "edgy", "tense", "restless", "fretful", "agitated", "troubled", "distressed", "panicky", "worked up"],
  surprised: ["astonished", "amazed", "startled", "shocked", "stunned", "bewildered", "dumbfounded", "flabbergasted", "awestruck", "thunderstruck", "taken aback", "astounded", "dazed", "floored", "staggered", "baffled"],
  disgusted: ["repulsed", "revolted", "nauseated", "sickened", "appalled", "repelled", "horrified", "aghast", "loathing", "abhorrent", "detestable", "odious", "repugnant", "distasteful", "offensive", "foul"],
  fearful: ["scared", "terrified", "frightened", "panicked", "alarmed", "petrified", "horrified", "dreadful", "spooked", "timid", "cowardly", "phobic", "jittery", "skittish", "wary", "intimidated"],
  content: ["satisfied", "pleased", "gratified", "fulfilled", "at ease", "peaceful", "serene", "tranquil", "comfortable", "calm", "relaxed", "composed", "untroubled", "placid", "mellow", "zen"],
  proud: ["accomplished", "confident", "self-assured", "dignified", "satisfied", "triumphant", "honored", "gratified", "elated", "exultant", "boastful", "vain", "smug", "arrogant", "conceited", "egotistical"],
  ashamed: ["embarrassed", "humiliated", "guilty", "remorseful", "disgraced", "mortified", "sheepish", "self-conscious", "abashed", "chagrined", "contrite", "penitent", "regretful", "rueful", "shamefaced", "crestfallen"],
  grateful: ["thankful", "appreciative", "indebted", "obliged", "beholden", "acknowledging", "recognizing", "moved", "touched", "overwhelmed", "humbled", "blessed", "fortunate", "honored", "privileged", "indebted"],
  jealous: ["envious", "covetous", "resentful", "possessive", "suspicious", "mistrustful", "green-eyed", "bitter", "begrudging", "competitive", "insecure", "threatened", "protective", "territorial", "distrustful", "wary"],
  nostalgic: ["reminiscent", "sentimental", "wistful", "longing", "yearning", "homesick", "melancholic", "bittersweet", "reflective", "retrospective", "pining", "romanticizing", "remembering", "fond", "musing", "dreamy"],
  hopeful: ["optimistic", "expectant", "anticipating", "looking forward", "confident", "positive", "encouraged", "upbeat", "sanguine", "bullish", "buoyant", "cheerful", "promising", "rosy", "bright", "assured"],
  frustrated: ["thwarted", "discouraged", "exasperated", "defeated", "disheartened", "vexed", "irritated", "annoyed", "aggravated", "peeved", "disgruntled", "dissatisfied", "disappointed", "foiled", "stymied", "hindered"],
  amused: ["entertained", "tickled", "delighted", "pleased", "diverted", "charmed", "chuckling", "giggling", "mirthful", "jovial", "light-hearted", "playful", "witty", "humorous", "comical", "hilarious"],
  confused: ["perplexed", "puzzled", "bewildered", "baffled", "mystified", "disoriented", "befuddled", "muddled", "addled", "discombobulated", "flummoxed", "confounded", "stumped", "dazed", "disorganized", "unclear"],
  inspired: ["motivated", "stimulated", "encouraged", "influenced", "moved", "stirred", "uplifted", "energized", "enthused", "galvanized", "invigorated", "animated", "roused", "awakened", "enlightened", "impassioned"]
};

export function analyzeText(text: string): AnalysisResult {
  const now = new Date();
  const seed = now.getSeconds(); 
  function seededRandom(seed: number, max: number) {
    return Math.floor((Math.sin(seed) * 10000) % max);
  }
  const topic = topics[seededRandom(seed, topics.length)];
  const emotion = emotions[seededRandom(seed + 10, emotions.length)]; 
  return { topic, emotion };
}