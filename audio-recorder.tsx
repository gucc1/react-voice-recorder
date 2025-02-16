"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Play } from "lucide-react"

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorderRef.current = new MediaRecorder(stream)
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" })
      const audioUrl = URL.createObjectURL(audioBlob)
      setAudioURL(audioUrl)
      chunksRef.current = []
    }
    mediaRecorderRef.current.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL)
      audio.play()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">音声録音アプリ</h1>
        <div className="flex justify-center space-x-4 mb-4">
          <Button onClick={startRecording} disabled={isRecording} className="bg-red-500 hover:bg-red-600">
            <Mic className="mr-2 h-4 w-4" /> 録音開始
          </Button>
          <Button onClick={stopRecording} disabled={!isRecording} className="bg-gray-500 hover:bg-gray-600">
            <Square className="mr-2 h-4 w-4" /> 録音終了
          </Button>
          <Button onClick={playRecording} disabled={!audioURL} className="bg-green-500 hover:bg-green-600">
            <Play className="mr-2 h-4 w-4" /> 再生
          </Button>
        </div>
        <div className="text-center">
          {isRecording ? <p className="text-red-500">録音中...</p> : <p className="text-gray-500">録音待機中</p>}
        </div>
      </div>
    </div>
  )
}

