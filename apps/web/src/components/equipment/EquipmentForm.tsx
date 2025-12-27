import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Wrench, Calendar, Building, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    onSuccess: () => void;
    // If selectedId is provided, we are in Edit/View mode
    selectedId?: string | null; 
    onClose?: () => void;
}

export function EquipmentForm({ onSuccess, selectedId, onClose }: Props) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"description" | "product_info">("description");
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        serialNumber: '',
        location: '',
        department: '',
        category: '',
        purchaseDate: '',
        assignee: '',
        assignedTeamId: '',
        // New fields from sketch
        company: 'My Company (San Francisco)',
        technician: '',
        scrapDate: '',
        workCenter: '',
        description: ''
    });

    // Control open state based on selectedId presence (if controlled from parent)
    useEffect(() => {
        if (selectedId) {
            setOpen(true);
            // In real app, fetch details by ID here
            // Mock fetching for demo based on ID presence
            fetch('/api/equipment').then(res => res.json()).then(list => {
                const found = list.find((e: any) => e.id === selectedId);
                if (found) {
                    setFormData(prev => ({
                        ...prev,
                        ...found,
                        // Ensure defaults for missing fields
                        company: found.company || 'My Company (San Francisco)',
                        technician: found.technician || 'Mitchell Admin',
                        workCenter: found.workCenter || found.location || '',
                    }));
                }
            });
        }
    }, [selectedId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen && onClose) {
            onClose(); // Notify parent to clear selection
        }
        if (!newOpen) {
            // Reset form if closing
             setFormData({
                name: '', serialNumber: '', location: '', department: '', category: '',
                purchaseDate: '', assignee: '', assignedTeamId: '', company: 'My Company (San Francisco)',
                technician: '', scrapDate: '', workCenter: '', description: ''
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Determine URL and Method based on Edit vs Create
        const url = selectedId ? `/api/equipment/${selectedId}` : '/api/equipment'; // Note: Edit endpoint might not exist yet
        const method = selectedId ? 'PUT' : 'POST'; 
        
        // Fallback for demo if PUT not implemented: treat as success
        if (selectedId) {
            console.log("Saving updates", formData);
            if (onClose) onClose();
            onSuccess();
            setOpen(false);
            return;
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setOpen(false);
                if (onClose) onClose();
                onSuccess();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {/* Only show trigger button if NOT controlled by parent list click */}
            {!selectedId && (
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Equipment
                    </Button>
                </DialogTrigger>
            )}
            
            <DialogContent className="sm:max-w-[900px] overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                     <div>
                        <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                            Equipment
                        </div>
                        {selectedId ? (
                            <h2 className="text-2xl font-bold">{formData.name}</h2>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-xl">New</span>
                            </div>
                        )}
                     </div>
                     
                     {/* Smart Button */}
                     <Button variant="outline" className="h-14 flex flex-col items-center justify-center gap-1 border-border/60 bg-muted/20 hover:bg-muted/40">
                         <div className="flex items-center gap-2 text-primary font-bold text-lg">
                             <Wrench className="h-5 w-5" />
                             <span>0</span>
                         </div>
                         <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Maintenance</span>
                     </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main 2-Column Layout */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        {/* Left Column */}
                        <div className="space-y-4">
                             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-bold text-muted-foreground">Name</label>
                                <Input name="name" value={formData.name} onChange={handleChange} className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent" placeholder="Equipment Name" />
                             </div>
                             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-bold text-muted-foreground">Equipment Category</label>
                                <Input name="category" value={formData.category} onChange={handleChange} className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent" placeholder="e.g. Monitors" />
                             </div>
                             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-bold text-muted-foreground">Company</label>
                                <Input name="company" value={formData.company} onChange={handleChange} className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent" />
                             </div>
                             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-bold text-muted-foreground">Used By</label>
                                <Input name="assignee" value={formData.assignee} onChange={handleChange} className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent" placeholder="Employee Name" />
                             </div>
                             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-bold text-muted-foreground">Maintenance Team</label>
                                {/* Mock Select */}
                                <select name="assignedTeamId" value={formData.assignedTeamId} onChange={handleChange} className="w-full border-0 border-b bg-transparent py-2 text-sm focus:outline-none focus:border-primary">
                                    <option value="">Select Team...</option>
                                    <option value="1">Internal Maintenance</option>
                                    <option value="2">Metrology</option>
                                </select>
                             </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-bold text-muted-foreground">Technician</label>
                                <Input name="technician" value={formData.technician} onChange={handleChange} className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent" />
                             </div>
                             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-bold text-muted-foreground">Employee</label>
                                <Input name="assignee" value={formData.assignee} onChange={handleChange} className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent" />
                             </div>
                             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-bold text-muted-foreground">Scrap Date</label>
                                <Input name="scrapDate" type="date" value={formData.scrapDate} onChange={handleChange} className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent" />
                             </div>
                             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-bold text-muted-foreground">Used in Location</label>
                                <Input name="location" value={formData.location} onChange={handleChange} className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent" />
                             </div>
                             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-bold text-muted-foreground">Work Center</label>
                                <Input name="workCenter" value={formData.workCenter} onChange={handleChange} className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent" />
                             </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="mt-8">
                        <div className="flex border-b w-full">
                            <button
                                type="button"
                                className={cn("px-6 py-3 text-sm font-medium transition-colors border-b-2", activeTab === 'description' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                                onClick={() => setActiveTab('description')}
                            >
                                Description
                            </button>
                            <button
                                type="button"
                                className={cn("px-6 py-3 text-sm font-medium transition-colors border-b-2", activeTab === 'product_info' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                                onClick={() => setActiveTab('product_info')}
                            >
                                Product Information
                            </button>
                        </div>
                        <div className="pt-4">
                            {activeTab === 'description' && (
                                <textarea 
                                    name="description" 
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Add description..."
                                    value={formData.description} 
                                    onChange={handleChange} 
                                />
                            )}
                            {activeTab === 'product_info' && (
                                <div className="grid grid-cols-2 gap-8 py-4">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label className="text-sm font-bold text-muted-foreground">Vendor</label>
                                            <Input className="border-0 border-b rounded-none px-0 bg-transparent" placeholder="Vendor Name" />
                                        </div>
                                         <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label className="text-sm font-bold text-muted-foreground">Vendor Reference</label>
                                            <Input className="border-0 border-b rounded-none px-0 bg-transparent" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label className="text-sm font-bold text-muted-foreground">Model</label>
                                            <Input className="border-0 border-b rounded-none px-0 bg-transparent" />
                                        </div>
                                         <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label className="text-sm font-bold text-muted-foreground">Serial Number</label>
                                            <Input name="serialNumber" value={formData.serialNumber} onChange={handleChange} className="border-0 border-b rounded-none px-0 bg-transparent" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Discard</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
