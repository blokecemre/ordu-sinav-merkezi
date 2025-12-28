"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ChartData = {
    examName: string
    date: string
    score: number
    net: number
}

interface StudentDetailChartsProps {
    data: ChartData[]
}

export function StudentDetailCharts({ data }: StudentDetailChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Net Change Chart */}
            <Card className="bg-white border-0 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-slate-800">
                        Net Değişimi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="examName" stroke="#94a3b8" fontSize={12} tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="net"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={{ fill: "#22c55e", strokeWidth: 2 }}
                                name="Net"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Score Change Chart */}
            <Card className="bg-white border-0 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-slate-800">
                        Puan Değişimi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="examName" stroke="#94a3b8" fontSize={12} tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value} />
                            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 500]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                                name="Puan"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
