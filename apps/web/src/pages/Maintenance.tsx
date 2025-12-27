import { MaintenanceBoard } from "@/components/maintenance/MaintenanceBoard";
import { RequestForm } from "@/components/maintenance/RequestForm";
import { ViewSwitcher, ViewType } from "@/components/common/ViewSwitcher";
import { MaintenanceCalendar } from "@/components/maintenance/MaintenanceCalendar";
import { MaintenanceList } from "@/components/maintenance/MaintenanceList";
import { useState } from "react";

export function Maintenance() {
  const [view, setView] = useState<ViewType>("kanban");
  const [key, setKey] = useState(0); 

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
             <h2 className="text-3xl font-bold tracking-tight">Maintenance</h2>
             <ViewSwitcher currentView={view} onViewChange={setView} />
         </div>
         <RequestForm onSuccess={() => setKey(key + 1)} />
      </div>
      
      <div className="flex-1 overflow-hidden">
        {view === "kanban" && <MaintenanceBoard key={key} />}
        {view === "list" && <MaintenanceList />}
        {view === "calendar" && <MaintenanceCalendar />}
      </div>
    </div>
  )
}
