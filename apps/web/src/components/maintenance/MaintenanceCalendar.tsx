import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function MaintenanceCalendar() {
  const [requests, setRequests] = useState<any[]>([]);
  const currentMonth = "December 2025"; // In a real app, track current date state
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  useEffect(() => {
    fetch('/api/requests').then(res => res.json()).then(setRequests).catch(console.error);
  }, []);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
             <h3 className="text-xl font-semibold w-40 text-center">{currentMonth}</h3>
             <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Preventive</Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Corrective</Badge>
          </div>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm">
         <div className="grid grid-cols-7 h-10 bg-muted/50 border-b text-sm font-medium text-muted-foreground text-center items-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
         </div>
         <div className="grid grid-cols-7 h-[calc(100%-2.5rem)] auto-rows-fr">
             {days.map(day => {
                 // Mock logic: randomly assign requests to days if they lack scheduledDate for demo visual
                 // In real app: use req.scheduledDate
                 // We will map based on 'createdAt' day for now or scheduledDate if present
                 const currentDayStr = day.toString();
                 
                 const events = requests.filter(r => {
                     const d = new Date(r.scheduledDate || r.createdAt);
                     // Just match day of month for visual demo since our seed data is random dates
                     return d.getDate() === day;
                 });
                 
                 return (
                    <div key={day} className="border-r border-b p-2 min-h-[100px] relative hover:bg-muted/10 transition-colors">
                        <span className="text-sm text-muted-foreground font-medium">{day}</span>
                        <div className="mt-1 flex flex-col gap-1 overflow-y-auto max-h-[80px]">
                            {events.map((ev, i) => (
                                <div key={i} className={`text-[10px] p-1 rounded border truncate ${ev.type === 'Preventive' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                    {ev.title}
                                </div>
                            ))}
                        </div>
                    </div>
                 )
             })}
         </div>
      </div>
    </div>
  );
}
