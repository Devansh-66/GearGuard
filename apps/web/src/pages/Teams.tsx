import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useState } from "react";

interface Team {
    id: string;
    name: string;
    members: string[]; // Just names for now as per sketch
    company: string;
}

// Mock Data matching the sketch
const MOCK_TEAMS: Team[] = [
    {
        id: '1',
        name: 'Internal Maintenance',
        members: ['Anas Makari'],
        company: 'My Company (San Francisco)'
    },
    {
        id: '2',
        name: 'Metrology',
        members: ['Marc Demo'],
        company: 'My Company (San Francisco)'
    },
    {
        id: '3',
        name: 'Subcontractor',
        members: ['Maggie Davidson'],
        company: 'My Company (San Francisco)'
    }
];

export function Teams() {
    // In a real app, this would fetch from /api/teams
    const [teams] = useState<Team[]>(MOCK_TEAMS);

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-3xl font-bold tracking-tight">Teams</h2>
                   <p className="text-muted-foreground">Manage your maintenance teams and members</p>
                </div>
                 <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Team
                </Button>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Team Name</th>
                                    <th className="px-6 py-4">Team Members</th>
                                    <th className="px-6 py-4 text-right">Company</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {teams.map(team => (
                                    <tr key={team.id} className="hover:bg-muted/30 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            <div className="flex items-center gap-3">
                                                 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <Users className="h-4 w-4" />
                                                 </div>
                                                 {team.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {team.members.map(m => (
                                                    <span key={m} className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-500 text-[10px] flex items-center justify-center border border-indigo-500/30">
                                                            {m.charAt(0)}
                                                        </div>
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-muted-foreground">
                                            {team.company}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
