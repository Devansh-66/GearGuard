import { EquipmentList } from "@/components/equipment/EquipmentList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Equipment() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight">Equipment</h2>
         <Button variant="outline" asChild>
            <Link to="/equipment/categories">Manage Categories</Link>
         </Button>
      </div>
      <EquipmentList />
    </div>
  )
}
