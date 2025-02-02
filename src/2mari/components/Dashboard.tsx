"use client"

import { useState, useEffect, useRef } from "react"
import { sanitizeText } from "../utils/sanitize"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

export default function Dashboard() {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [sanitizedText, setSanitizedText] = useState("")
  const [error, setError] = useState<string | null>(null)
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
            return newTranscript
          })
        }

        recognitionRef.current.onerror = (event: any) => {
          setError(`Speech recognition error: ${event.error}`)
          setIsTranscribing(false)
        }

        recognitionRef.current.onend = () => {
          if (isTranscribing) {
            try {
              recognitionRef.current.start()
            } catch (error) {
              console.error("Failed to restart speech recognition:", error)
            }
          }
        }
      } else {
        setError("Speech recognition is not supported in this browser.")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isTranscribing])

  const startTranscribing = async () => {
    setError(null)
    if (recognitionRef.current) {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true })

        setTranscript("")
        setSanitizedText("")
        interimTranscriptRef.current = ""
        recognitionRef.current.start()
        setIsTranscribing(true)
      } catch (err) {
        console.error("Failed to start speech recognition:", err)
        setError("Failed to start speech recognition. Please ensure microphone access is allowed.")
      }
    } else {
      setError("Speech recognition is not initialized.")
    }
  }

  const stopTranscribing = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsTranscribing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4">
        <Button
          onClick={startTranscribing}
          disabled={isTranscribing}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Start Transcribing
        </Button>
        <Button
          onClick={stopTranscribing}
          disabled={!isTranscribing}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Stop Transcribing
        </Button>
      </div>
      {error && <div className="text-red-500 font-bold text-center">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Original Transcript</h2>
          <p className="p-2 bg-gray-100 rounded min-h-[100px] whitespace-pre-wrap">
            {transcript}
            {isTranscribing ? interimTranscriptRef.current : ""}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Sanitized Text</h2>
          <p className="p-2 bg-gray-100 rounded min-h-[100px] whitespace-pre-wrap">{sanitizedText}</p>
        </div>
      </div>
    </div>
  )
}