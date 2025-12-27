import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Request {
    id: string;
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "New" | "In Progress" | "Repaired" | "Scrap";
    type: "Corrective" | "Preventive";
    equipmentName?: string;
    createdAt: string;
    scheduledDate?: string;
}

export function MaintenanceList() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/requests')
            .then(res => res.json())
            .then(setRequests)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center animate-pulse">Loading requests...</div>;

    if (requests.length === 0) {
        return <div className="p-8 text-center text-muted-foreground border rounded-lg">No maintenance requests found.</div>;
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Equipment</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Created</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50 bg-card">
                    {requests.map(req => (
                        <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium">
                                <div>{req.title}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{req.description}</div>
                            </td>
                            <td className="px-4 py-3">{req.equipmentName || '-'}</td>
                            <td className="px-4 py-3">{req.type}</td>
                            <td className="px-4 py-3">
                                <Badge variant="outline" className={
                                    req.priority === 'High' ? 'text-red-500 border-red-500/20 bg-red-500/10' :
                                    req.priority === 'Medium' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10' :
                                    'text-blue-500 border-blue-500/20 bg-blue-500/10'
                                }>
                                    {req.priority}
                                </Badge>
                            </td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                    req.status === 'Repaired' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                    req.status === 'In Progress' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                    'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                }`}>
                                    {req.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                                {new Date(req.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
