import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
    title: string;
    priority: string;
    description?: string;
    equipmentName?: string;
}

export function MaintenanceCard({ title, priority, description, equipmentName }: Props) {
    return (
        <Card className="cursor-grab hover:shadow-md transition-shadow mb-3 bg-card border-border">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium line-clamp-2">{title}</CardTitle>
                     <span className={cn(
                        "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
                        priority === 'High' ? "bg-red-500/10 text-red-500" : 
                        priority === 'Medium' ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-blue-500/10 text-blue-500"
                     )}>
                        {priority}
                     </span>
                </div>
                {equipmentName && (
                    <div className="text-xs font-semibold text-muted-foreground mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                        {equipmentName}
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground line-clamp-3">{description || "No description provided."}</p>
            </CardContent>
        </Card>
    );
}
