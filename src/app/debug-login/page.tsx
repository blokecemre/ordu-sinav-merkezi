"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugLoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleTest = async () => {
        setLoading(true)
        setResult(null)
        try {
            const res = await fetch("/api/debug/login-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })
            const data = await res.json()
            setResult(data)
        } catch (error) {
            setResult({ error: "Fetch failed" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 flex justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Debug Login Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button onClick={handleTest} disabled={loading} className="w-full">
                        {loading ? "Testing..." : "Test Credentials"}
                    </Button>

                    {result && (
                        <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono overflow-auto">
                            <pre>{JSON.stringify(result, null, 2)}</pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
