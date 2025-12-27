import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Category {
    id: string;
    name: string;
    description?: string;
}

const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Monitors', description: 'Display screens and TVs' },
    { id: '2', name: 'Computers', description: 'Laptops and Desktops' },
    { id: '3', name: 'Machinery', description: 'Heavy industrial equipment' },
    { id: '4', name: 'Tools', description: 'Handheld power tools' },
];

export function EquipmentCategories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [open, setOpen] = useState(false);
    const [newCatName, setNewCatName] = useState("");

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newCatName) return;
        const newCat: Category = {
            id: crypto.randomUUID(),
            name: newCatName,
            description: 'New category'
        };
        setCategories([...categories, newCat]);
        setNewCatName("");
        setOpen(false);
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-3xl font-bold tracking-tight">Equipment Categories</h2>
                   <p className="text-muted-foreground">Classify your equipment assets</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                         <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category Name</label>
                                <Input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="e.g. Vehicles" />
                            </div>
                            <Button type="submit" className="w-full">Create</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                             <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4 text-right">Items</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {categories.map(cat => (
                                    <tr 
                                        key={cat.id} 
                                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/equipment/list?category=${encodeURIComponent(cat.name)}`)}
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                 <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                    <Tag className="h-4 w-4" />
                                                 </div>
                                                 {cat.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{cat.description}</td>
                                        <td className="px-6 py-4 text-right text-muted-foreground">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-xs">{Math.floor(Math.random() * 10)} items</span>
                                                <ChevronRight className="h-4 w-4 opacity-50" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
