import { useDraggable } from '@dnd-kit/core';
import { MaintenanceCard } from "./MaintenanceCard";

export function MaintenanceCardDraggable({ id, request }: { id: string, request: any }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
             <MaintenanceCard 
                title={request.title} 
                priority={request.priority} 
                description={request.description}
                equipmentName={request.equipmentName}
            />
        </div>
    );
}
