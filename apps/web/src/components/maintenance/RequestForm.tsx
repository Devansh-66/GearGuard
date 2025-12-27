import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar as CalendarIcon, Clock, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    onSuccess: () => void;
    defaultType?: "Corrective" | "Preventive";
    defaultDate?: Date;
}

export function RequestForm({ onSuccess, defaultType = "Corrective", defaultDate }: Props) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"notes" | "instruction">("notes");
    
    // Lists
    const [equipmentList, setEquipmentList] = useState<any[]>([]);
    const [workCenterList, setWorkCenterList] = useState<any[]>([]); // To be fetched
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        maintenanceScope: 'Equipment' as 'Equipment' | 'WorkCenter',
        equipmentId: '',
        workCenterId: '',
        
        priority: 'Low',
        type: defaultType,
        scheduledDate: defaultDate ? defaultDate.toISOString().split('T')[0] : '',
        durationHours: 1.0,
        
        teamId: '',
        technicianId: '',
        
        description: '', // Internal Notes
        instruction: '', // Instructions
    });

    useEffect(() => {
        if (open) {
            // Fetch Equipment
            fetch('/api/equipment').then(res => res.json()).then(setEquipmentList).catch(console.error);
            // Fetch Work Centers (Mock functionality if endpoint missing)
            fetch('/api/work-centers').then(res => {
                if(res.ok) return res.json();
                return []; 
            }).then(setWorkCenterList).catch(() => setWorkCenterList([]));
        }
    }, [open]);

    // Auto-fill Team based on selection (Mock logic)
    const handleScopeSelectionChange = (id: string) => {
        if (formData.maintenanceScope === 'Equipment') {
            const eq = equipmentList.find(e => e.id === id);
            if (eq) {
                setFormData(prev => ({
                    ...prev,
                    equipmentId: id,
                    teamId: eq.assignedTeamId || '', 
                    // In real app, we'd fetch the team name or list
                }));
            }
        } else {
             setFormData(prev => ({ ...prev, workCenterId: id }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setOpen(false);
                onSuccess();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> New Request
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[85vh]">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl font-semibold">New Maintenance Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    
                    {/* Header: Subject & Type */}
                    <div className="grid gap-4">
                         <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-muted-foreground">Request Subject</label>
                            <Input name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Laser Cutter Calibration" className="text-lg font-medium" />
                        </div>
                    </div>

                    {/* Scope Selection */}
                    <div className="grid grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Maintenance For</label>
                            <div className="flex gap-2">
                                <Button 
                                    type="button" 
                                    variant={formData.maintenanceScope === 'Equipment' ? 'default' : 'outline'}
                                    className="w-full"
                                    onClick={() => setFormData(prev => ({ ...prev, maintenanceScope: 'Equipment', workCenterId: '' }))}
                                >
                                    Equipment
                                </Button>
                                <Button 
                                    type="button" 
                                    variant={formData.maintenanceScope === 'WorkCenter' ? 'default' : 'outline'} 
                                    className="w-full"
                                    onClick={() => setFormData(prev => ({ ...prev, maintenanceScope: 'WorkCenter', equipmentId: '' }))}
                                >
                                    Work Center
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                             <label className="text-sm font-medium">Selected {formData.maintenanceScope}</label>
                             {formData.maintenanceScope === 'Equipment' ? (
                                <select 
                                    name="equipmentId" 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={formData.equipmentId} 
                                    onChange={(e) => handleScopeSelectionChange(e.target.value)}
                                    required
                                >
                                    <option value="">Select Equipment...</option>
                                    {equipmentList.map((eq: any) => (
                                        <option key={eq.id} value={eq.id}>{eq.name} ({eq.serialNumber})</option>
                                    ))}
                                </select>
                             ) : (
                                <select 
                                    name="workCenterId" 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={formData.workCenterId} 
                                    onChange={(e) => handleScopeSelectionChange(e.target.value)}
                                    required
                                >
                                    <option value="">Select Work Center...</option>
                                    {workCenterList.map((wc: any) => (
                                        <option key={wc.id} value={wc.id}>{wc.name} ({wc.code})</option>
                                    ))}
                                </select>
                             )}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Users className="h-4 w-4" /> Assignment
                            </h3>
                            <div className="grid gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium">Team</label>
                                    {/* We could fetch teams here, defaulting to simple input for now */}
                                    <Input name="teamId" value={formData.teamId} onChange={handleChange} placeholder="Maintenance Team A" /> 
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium">Technician</label>
                                    <Input name="technicianId" value={formData.technicianId} onChange={handleChange} placeholder="Assign to..." /> 
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Scheduling
                            </h3>
                            <div className="grid gap-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium">Scheduled Date</label>
                                        <Input name="scheduledDate" type="date" value={formData.scheduledDate} onChange={handleChange} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium">Duration (Hours)</label>
                                        <Input name="durationHours" type="number" step="0.5" value={formData.durationHours} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium">Priority</label>
                                    <select 
                                        name="priority"
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        value={formData.priority}
                                        onChange={handleChange}
                                    >
                                        <option value="Low">Low ⭐</option>
                                        <option value="Medium">Medium ⭐⭐</option>
                                        <option value="High">High ⭐⭐⭐</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs / Notes */}
                    <div className="mt-2">
                        <div className="flex border-b">
                            <button
                                type="button"
                                className={cn("px-4 py-2 text-sm font-medium transition-colors border-b-2", activeTab === 'notes' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                                onClick={() => setActiveTab('notes')}
                            >
                                Internal Notes
                            </button>
                            <button
                                type="button"
                                className={cn("px-4 py-2 text-sm font-medium transition-colors border-b-2", activeTab === 'instruction' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                                onClick={() => setActiveTab('instruction')}
                            >
                                Instructions
                            </button>
                        </div>
                        <div className="mt-4 p-1">
                            {activeTab === 'notes' && (
                                <textarea 
                                    name="description" 
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Add internal notes, observations, or context..."
                                    value={formData.description} 
                                    onChange={handleChange} 
                                />
                            )}
                             {activeTab === 'instruction' && (
                                <textarea 
                                    name="instruction" 
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Add specific instructions for the technician..."
                                    value={formData.instruction} 
                                    onChange={handleChange} 
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Request</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
