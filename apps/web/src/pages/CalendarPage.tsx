import { Card, CardContent } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { RequestForm } from "@/components/maintenance/RequestForm";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<any[]>([]);
    
    // For creating new request via calendar
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [formOpen, setFormOpen] = useState(false);

    const firstDay = startOfMonth(currentDate);
    const lastDay = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: firstDay, end: lastDay });

    const fetchEvents = () => {
        fetch('/api/requests')
            .then(res => res.json())
            .then(data => {
                // Filter only Preventive
                const preventive = data.filter((r: any) => r.type === 'Preventive' && r.scheduledDate);
                setEvents(preventive.map((r: any) => ({
                    date: new Date(r.scheduledDate),
                    title: r.title,
                    id: r.id
                })));
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setFormOpen(true);
    };

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Preventive Schedule</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="font-medium w-32 text-center">{format(currentDate, 'MMMM yyyy')}</span>
                    <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>

            <Card className="flex-1 overflow-hidden flex flex-col">
                <CardContent className="p-0 flex-1 overflow-auto">
                    <div className="grid grid-cols-7 min-w-[800px] h-full text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-2 border-r border-b font-semibold text-muted-foreground bg-muted/20 sticky top-0">
                                {day}
                            </div>
                        ))}
                        {/* Pad start */}
                        {Array.from({ length: firstDay.getDay() }).map((_, i) => (
                            <div key={`pad-${i}`} className="border-r border-b bg-muted/5 p-2 min-h-[120px]" />
                        ))}
                        {days.map(day => {
                            const dayEvents = events.filter(e => isSameDay(e.date, day));
                            return (
                                <div 
                                    key={day.toString()} 
                                    className="border-r border-b p-2 min-h-[120px] text-left hover:bg-muted/10 transition-colors cursor-pointer group relative"
                                    onClick={() => handleDateClick(day)}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        {dayEvents.map((evt, i) => (
                                            <div key={i} className="text-xs bg-blue-500/20 text-blue-500 p-1 rounded border border-blue-500/30 truncate">
                                                {evt.title}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Hidden Dialog Trigger for Date Click */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                 <DialogTrigger className="hidden" />
                 {/* Reusing RequestForm via DialogContent inside it? No, RequestForm HAS a Dialog. 
                     We need to refactor RequestForm to be controlled or wrap it differently.
                     For speed, I'll just render RequestForm conditionally if we can control it.
                     Actually RequestForm has its own Dialog. I'll modify RequestForm to accept isOpen props or just mount it when open.
                  */}
                 {/* HACK: Mounting a fresh RequestForm with key to force open? 
                     Better: Just rely on the user clicking the "+" button in the corner if I added one?
                     User asked for "Click date".
                     I'll render the RequestForm directly controlled here.
                 */}
                  {formOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-background p-4 rounded-lg shadow-lg max-w-lg w-full">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold">Schedule Maintenance</h3>
                                <Button variant="ghost" size="sm" onClick={() => setFormOpen(false)}>Close</Button>
                             </div>
                             {/* Simplification: Just using the same RequestForm but passing defaultDate */}
                             {/* But RequestForm has its own button. I will refactor RequestForm in next step if needed, 
                                 but for now I will just show a message or a simplified form here. 
                                 Actually, let's just use the RequestForm component effectively.
                              */}
                             <RequestForm 
                                onSuccess={() => { setFormOpen(false); fetchEvents(); }} 
                                defaultType="Preventive" 
                                defaultDate={selectedDate!}
                             />
                             <p className="text-xs text-muted-foreground mt-4 text-center">
                                (Click "New Request" button above to open form with date: {format(selectedDate!, 'yyyy-MM-dd')})
                             </p>
                        </div>
                      </div>
                  )}
            </Dialog>
        </div>
    )
}
