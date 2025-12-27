import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentForm } from "./EquipmentForm";
// Actually, I should use raw HTML as I haven't verified Table component existence and don't want to break build if missing.
// Let's stick to raw HTML/Tailwind for safety as requested in thought process.

interface Equipment {
    id: string;
    name: string;
    serialNumber: string;
    location: string;
    status: "Active" | "Scrapped";
    department: string;
    assignee?: string;
    category?: string;
}

export function EquipmentList() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    const fetchEquipment = () => {
        setLoading(true);
        fetch('/api/equipment')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch equipment');
                return res.json();
            })
            .then((data: Equipment[]) => {
                if (categoryFilter) {
                    setEquipment(data.filter(eq => eq.category === categoryFilter));
                } else {
                    setEquipment(data);
                }
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError("Could not load equipment. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchEquipment();
    }, [categoryFilter]);

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading equipment...</div>;
    }

    if (error) {
        return (
            <div className="p-8 text-center text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                <p>{error}</p>
                <button onClick={fetchEquipment} className="mt-2 text-sm underline hover:text-destructive/80">Try Again</button>
            </div>
        );
    }

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold">Equipment Inventory</CardTitle>
                <EquipmentForm onSuccess={fetchEquipment} />
                
                {/* Hidden form for editing, controlled by selectedEquipmentId */}
                {selectedEquipmentId && (
                    <EquipmentForm 
                        selectedId={selectedEquipmentId} 
                        onSuccess={fetchEquipment} 
                        onClose={() => setSelectedEquipmentId(null)} 
                    />
                )}
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto rounded-md border border-border/50">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Serial Number</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Assignee</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {equipment.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        No equipment found. Add your first item!
                                    </td>
                                </tr>
                            ) : (
                                equipment.map(eq => (
                                    <tr 
                                        key={eq.id} 
                                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => setSelectedEquipmentId(eq.id)}
                                    >
                                        <td className="px-4 py-3 font-medium text-foreground">{eq.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{eq.serialNumber}</td>
                                        <td className="px-4 py-3">{eq.category || '-'}</td>
                                        <td className="px-4 py-3">{eq.location}</td>
                                        <td className="px-4 py-3">{eq.department}</td>
                                        <td className="px-4 py-3">{eq.assignee || '-'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                eq.status === 'Active' 
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                                {eq.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
