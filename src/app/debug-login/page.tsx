"use client"

import { useState } from "react"
import { checkCredentials } from "./action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugLoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [logs, setLogs] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const handleCheck = async () => {
        setLoading(true)
        setLogs(["Starting check..."])
        try {
            const result = await checkCredentials(username, password)
            setLogs(result)
        } catch (e) {
            setLogs(prev => [...prev, "Error: " + String(e)])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Debug Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Input
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <Input
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button onClick={handleCheck} disabled={loading}>
                            {loading ? "Checking..." : "Check Credentials"}
                        </Button>
                    </div>

                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] whitespace-pre-wrap">
                        {logs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
