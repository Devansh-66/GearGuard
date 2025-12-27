import { useEffect, useState } from "react";
import { MaintenanceColumn } from "./MaintenanceColumn";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { MaintenanceCard } from "./MaintenanceCard";

const columns = ["New", "In Progress", "Repaired", "Scrap"];

export function MaintenanceBoard() {
    const [requests, setRequests] = useState<any[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const fetchRequests = () => {
        fetch('/api/requests').then(res => res.json()).then(setRequests).catch(console.error);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        
        if (!over) return;

        const requestId = active.id as string;
        const newStatus = over.id as string;

        const request = requests.find(r => r.id === requestId);
        if (request && request.status !== newStatus) {
            // Optimistic update
            const updated = requests.map(r => r.id === requestId ? { ...r, status: newStatus } : r);
            setRequests(updated);

            // API Call
            await fetch(`/api/requests/${requestId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        }
    };

    const activeRequest = requests.find(r => r.id === activeId);

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="h-full flex gap-4 overflow-x-auto pb-4">
                {columns.map(status => (
                    <MaintenanceColumn 
                        key={status} 
                        title={status} 
                        requests={requests.filter(r => r.status === status)} 
                    />
                ))}
            </div>
             <DragOverlay>
                {activeRequest ? (
                    <MaintenanceCard 
                        title={activeRequest.title} 
                        priority={activeRequest.priority} 
                        description={activeRequest.description}
                        equipmentName={activeRequest.equipmentName}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
