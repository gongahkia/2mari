import { Word2Vec } from 'word2vec-node';

type AnalysisResult = {
  topic: string
  emotion: string
}

const topics = ["technology", "politics", "sports", "entertainment", "science"]
const emotions = ["happy", "sad", "angry", "excited", "neutral"]

// FUA
// proper word2vec implementation requires the model to be loaded from a file, consider using this dataset https://www.kaggle.com/datasets/watts2/glove6b50dtxt
const model = new Word2Vec();
await model.load('./../models/');

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const words = text.toLowerCase().split(/\s+/);
  const vectors = words.map(word => model.getVector(word)).filter(v => v !== null);
  const averageVector = vectors.reduce((acc, vec) => acc.map((v, i) => v + vec[i]), new Array(vectors[0].length).fill(0)).map(v => v / vectors.length);
  const topic = findClosest(averageVector, topics);
  const emotion = findClosest(averageVector, emotions);
  return { topic, emotion };
}

function findClosest(vector: number[], categories: string[]): string {
  let closestCategory = categories[0];
  let closestDistance = Infinity;
  for (const category of categories) {
    const categoryVector = model.getVector(category);
    if (categoryVector) {
      const distance = cosineSimilarity(vector, categoryVector);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCategory = category;
      }
    }
  }
  return closestCategory;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}