import { LayoutGrid, List, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewType = "kanban" | "list" | "calendar";

interface Props {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewSwitcher({ currentView, onViewChange }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background p-1 shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("kanban")}
        className={cn(
          "h-8 px-2 lg:px-3",
          currentView === "kanban" && "bg-muted hover:bg-muted"
        )}
      >
        <LayoutGrid className="mr-2 h-4 w-4" />
        Kanban
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("list")}
        className={cn(
          "h-8 px-2 lg:px-3",
          currentView === "list" && "bg-muted hover:bg-muted"
        )}
      >
        <List className="mr-2 h-4 w-4" />
        List
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("calendar")}
        className={cn(
          "h-8 px-2 lg:px-3",
          currentView === "calendar" && "bg-muted hover:bg-muted"
        )}
      >
        <CalendarDays className="mr-2 h-4 w-4" />
        Calendar
      </Button>
    </div>
  );
}
