import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, CheckCircle2, AlertTriangle, Clock, Database } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });

  const fetchStats = () => {
    fetch('/api/requests')
        .then(res => res.json())
        .then(data => {
            const open = data.filter((r: any) => r.status === 'New').length;
            const inProgress = data.filter((r: any) => r.status === 'In Progress').length;
            const completed = data.filter((r: any) => r.status === 'Repaired').length;
            // distinct count or just mock overdue logic
            const overdue = data.filter((r: any) => r.priority === 'High' && r.status !== 'Repaired').length;
            setStats({ open, inProgress, completed, overdue });
        })
        .catch(console.error);
  };

  const handleSeed = async () => {
      await fetch('/api/seed', { method: 'POST' });
      fetchStats();
      // Optional: Add toast notification here if desired
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
         <Button variant="outline" onClick={handleSeed}>
            <Database className="mr-2 h-4 w-4" /> Seed Demo Data
         </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
            <p className="text-xs text-muted-foreground">Waiting for assignment</p>
          </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active jobs</p>
          </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Lifetime repairs</p>
          </CardContent>
        </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical / Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">High priority pending</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
