"use client"

import { useState, useEffect, useRef } from "react"
import { sanitizeText } from "../utils/sanitize"
import { analyzeText } from "../utils/naiveWord2Vec"
import { Button } from "@/components/ui/button"
import { ClipboardCopy } from "lucide-react"

declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

export default function Dashboard() {
  const [transcript, setTranscript] = useState("")
  const [sanitizedText, setSanitizedText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<{ topic: string; emotion: string } | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const recognitionRef = useRef<any>(null)
  const interimTranscriptRef = useRef("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          setTranscript((prevTranscript) => {
            const newTranscript = prevTranscript + finalTranscript
            interimTranscriptRef.current = interimTranscript
            const fullTranscript = newTranscript + interimTranscript
            setSanitizedText(sanitizeText(fullTranscript))
            setAnalysis(analyzeText(fullTranscript))
            return newTranscript
          })
        }

        recognitionRef.current.onerror = (event: any) => {
          setError(`Speech recognition error: ${event.error}`)
        }

        recognitionRef.current.onend = () => {
          try {
            recognitionRef.current.start()
          } catch (error) {
            console.error("Failed to restart speech recognition:", error)
          }
        }

        // Start transcribing immediately
        startTranscribing()
      } else {
        setError("Speech recognition is not supported in this browser.")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startTranscribing = async () => {
    setError(null)
    if (recognitionRef.current) {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true })

        setTranscript("")
        setSanitizedText("")
        setAnalysis(null)
        interimTranscriptRef.current = ""
        recognitionRef.current.start()
      } catch (err) {
        console.error("Failed to start speech recognition:", err)
        setError("Failed to start speech recognition. Please ensure microphone access is allowed.")
      }
    } else {
      setError("Speech recognition is not initialized.")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sanitizedText)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000) // Reset success message after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err)
      setError("Failed to copy text to clipboard.")
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 font-bold text-center">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Original Transcript</h2>
          <p className="p-2 bg-gray-100 rounded min-h-[100px] whitespace-pre-wrap">
            {transcript}
            {interimTranscriptRef.current}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Sanitized Text</h2>
          <p className="p-2 bg-gray-100 rounded min-h-[100px] whitespace-pre-wrap">{sanitizedText}</p>
          <div className="mt-2 flex items-center">
            <Button onClick={copyToClipboard} className="flex items-center space-x-2" variant="outline">
              <ClipboardCopy className="h-4 w-4" />
              <span>Copy Sanitized Text</span>
            </Button>
            {copySuccess && <span className="ml-2 text-green-600">Copied to clipboard!</span>}
          </div>
        </div>
      </div>
      {analysis && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Sentiment analysis</h2>
          <div className="p-2 bg-gray-100 rounded">
            <p>
              <strong>General Topic:</strong> {analysis.topic}
            </p>
            <p>
              <strong>General Emotion:</strong> {analysis.emotion}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}