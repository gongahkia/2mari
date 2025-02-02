type AnalysisResult = {
  topic: string
  emotion: string
}

const topics = ["technology", "politics", "sports", "entertainment", "science"]
const emotions = ["happy", "sad", "angry", "excited", "neutral"]

export function analyzeText(text: string): AnalysisResult {
  const words = text.toLowerCase().split(/\s+/)
  const wordCount = words.length
  const topicIndex = wordCount % topics.length
  const topic = topics[topicIndex]
  const emotionIndex = Math.floor(wordCount / 10) % emotions.length
  const emotion = emotions[emotionIndex]
  return { topic, emotion }
}