"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Play sound effect
      new Audio("/notification.mp3").play().catch(() => {})
      // Switch between work and break
      setIsBreak(!isBreak)
      setTimeLeft((!isBreak ? breakDuration : workDuration) * 60)
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, breakDuration, workDuration])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(workDuration * 60)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const progress = isBreak ? (timeLeft / (breakDuration * 60)) * 100 : (timeLeft / (workDuration * 60)) * 100

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-64 h-64">
            {/* Circular progress */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-orange-100"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                className="text-orange-500 transition-all duration-1000"
              />
            </svg>

            {/* Corgi Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 relative">
                <div className={`absolute inset-0 transition-opacity duration-300 ${isRunning ? 'opacity-100' : 'opacity-80'}`}>
                  <img 
                    src="/cropped.gif" 
                    alt="Corgi animation"
                    className={`w-full h-full object-contain ${isBreak ? 'opacity-80 grayscale' : ''}`}
                  />
                </div>
                {isBreak && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="text-2xl">💤</span>
                  </div>
                )}
                {!isBreak && isRunning && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="text-2xl">📚</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-4xl font-bold text-orange-900">
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={resetTimer} className="rounded-full">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={toggleTimer}
              className="h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-600"
            >
              {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="work" className="col-span-2">
                      Work Duration (min)
                    </Label>
                    <Input
                      id="work"
                      type="number"
                      value={workDuration}
                      onChange={(e) => setWorkDuration(Number(e.target.value))}
                      className="col-span-2"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="break" className="col-span-2">
                      Break Duration (min)
                    </Label>
                    <Input
                      id="break"
                      type="number"
                      value={breakDuration}
                      onChange={(e) => setBreakDuration(Number(e.target.value))}
                      className="col-span-2"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Status */}
          <p className="text-orange-600 font-medium">{isBreak ? "Take a break!" : "Study time!"}</p>
        </div>
      </Card>
    </div>
  )
}

