import { useDroppable } from '@dnd-kit/core';
import { MaintenanceCardDraggable } from "./MaintenanceCardDraggable.tsx";

interface Props {
    title: string;
    requests: any[];
}

export function MaintenanceColumn({ title, requests }: Props) {
    const { setNodeRef } = useDroppable({
        id: title,
    });

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[280px] bg-muted/30 rounded-lg p-3 flex flex-col border border-border/50">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{requests.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto min-h-[500px] flex flex-col gap-3">
                {requests.map(req => (
                    <MaintenanceCardDraggable key={req.id} id={req.id} request={req} />
                ))}
            </div>
        </div>
    );
}
