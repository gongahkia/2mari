"use client"

import { useState, useEffect, useRef } from "react"
import { sanitizeText } from "../utils/sanitize"

declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

export default function Dashboard() {
  const [transcript, setTranscript] = useState("")
  const [sanitizedText, setSanitizedText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          setTranscript((prevTranscript) => {
            const newTranscript = prevTranscript + finalTranscript + interimTranscript
            setSanitizedText(sanitizeText(newTranscript))
            return newTranscript
          })
        }

        recognitionRef.current.onerror = (event: any) => {
          setError(`Speech recognition error: ${event.error}`)
        }

        recognitionRef.current.onend = () => {
          recognitionRef.current.start()
        }

        // Start recognition immediately
        recognitionRef.current.start()
      } else {
        setError("Speech recognition is not supported in this browser.")
      }
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 font-bold">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Original Transcript</h2>
          <p className="p-2 bg-gray-100 rounded min-h-[100px] whitespace-pre-wrap">{transcript}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Sanitized Text</h2>
          <p className="p-2 bg-gray-100 rounded min-h-[100px] whitespace-pre-wrap">{sanitizedText}</p>
        </div>
      </div>
    </div>
  )
}