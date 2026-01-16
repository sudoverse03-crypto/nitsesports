import { useState, useMemo } from "react";
import BracketView from "./BracketView.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Trash2, Plus, Edit2, Check, X } from "lucide-react";

const defaultTeams = [
  "Phoenix Rising", "Dragon Slayers", "Thunder Knights", "Elite Gamers",
  "Victory Squad", "Crimson Force", "Iron Titans", "Shadow Warriors",
  "Apex Legends", "Nova Team", "Inferno Crew", "Stellar Squad",
  "Divine Gaming", "Chaos Masters", "Legends Unite", "Mystic Rangers",
  "Alpha Force", "Thunder Squad", "Victory Eagles", "Blaze Team",
  "Titan Power", "Storm Chasers", "Elite Warriors", "Sonic Speed",
  "Quantum Kings", "Vortex Gaming", "Solar Flares", "Thunder Bolt",
  "Eclipse Team", "Infinity Squad", "Nexus Warriors", "Prime Legends"
];

const RCBracket = ({ canEdit = false }) => {
  const [teams, setTeams] = useState(defaultTeams);
  const [newTeamName, setNewTeamName] = useState("");
  const [editingTeamIndex, setEditingTeamIndex] = useState(null);
  const [editingTeamValue, setEditingTeamValue] = useState("");
  
  const [bracket, setBracket] = useState(() => {
    const rounds = generateInitialBracket(defaultTeams);
    return rounds;
  });

  const [finalStage, setFinalStage] = useState({
    semifinals: [
      { id: "sf1", teamA: "TBD", teamB: "TBD", scoreA: 0, scoreB: 0, status: "upcoming", time: null },
      { id: "sf2", teamA: "TBD", teamB: "TBD", scoreA: 0, scoreB: 0, status: "upcoming", time: null },
    ],
    finals: { id: "final", teamA: "TBD", teamB: "TBD", scoreA: 0, scoreB: 0, status: "upcoming", time: null }
  });

  // Generate initial bracket structure
  function generateInitialBracket(teamList) {
    const cols = [
      {
        title: "Round 1 (32 Teams)",
        matches: Array(16).fill(null).map((_, i) => ({
          teamA: teamList[i * 2] || "TBD",
          teamB: teamList[i * 2 + 1] || "TBD",
          scoreA: 0,
          scoreB: 0,
          status: "upcoming",
          time: null
        }))
      },
      {
        title: "Round 2 (16 Teams)",
        matches: Array(8).fill(null).map(() => ({
          teamA: "TBD",
          teamB: "TBD",
          scoreA: 0,
          scoreB: 0,
          status: "upcoming",
          time: null
        }))
      },
      {
        title: "Quarterfinals (8 Teams)",
        matches: Array(4).fill(null).map(() => ({
          teamA: "TBD",
          teamB: "TBD",
          scoreA: 0,
          scoreB: 0,
          status: "upcoming",
          time: null
        }))
      }
    ];
    return { columns: cols };
  }

  // Add new team
  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      const updatedTeams = [...teams, newTeamName.trim()];
      setTeams(updatedTeams);
      setNewTeamName("");
      // Regenerate bracket with new teams
      setBracket(generateInitialBracket(updatedTeams));
    }
  };

  // Edit team
  const handleEditTeam = (index) => {
    setEditingTeamIndex(index);
    setEditingTeamValue(teams[index]);
  };

  const handleSaveTeam = (index) => {
    if (editingTeamValue.trim()) {
      const updatedTeams = [...teams];
      updatedTeams[index] = editingTeamValue.trim();
      setTeams(updatedTeams);
      // Regenerate bracket with updated teams
      setBracket(generateInitialBracket(updatedTeams));
      setEditingTeamIndex(null);
      setEditingTeamValue("");
    }
  };

  // Delete team
  const handleDeleteTeam = (index) => {
    const updatedTeams = teams.filter((_, i) => i !== index);
    setTeams(updatedTeams);
    setBracket(generateInitialBracket(updatedTeams));
  };

  // Handle bracket score change
  const handleScoreChange = (colIndex, matchIndex, scoreA, scoreB) => {
    if (!canEdit) return;

    setBracket(prev => {
      const newBracket = { ...prev };
      newBracket.columns = newBracket.columns.map((col, i) => {
        if (i === colIndex) {
          return {
            ...col,
            matches: col.matches.map((match, idx) => {
              if (idx === matchIndex) {
                return { ...match, scoreA, scoreB };
              }
              return match;
            })
          };
        }
        return col;
      });
      return newBracket;
    });
  };

  // Handle final stage score change
  const handleFinalScoreChange = (stage, matchId, scoreA, scoreB) => {
    if (!canEdit) return;

    setFinalStage(prev => {
      if (stage === "semifinals") {
        return {
          ...prev,
          semifinals: prev.semifinals.map(match => 
            match.id === matchId ? { ...match, scoreA, scoreB } : match
          )
        };
      } else if (stage === "finals") {
        return {
          ...prev,
          finals: { ...prev.finals, scoreA, scoreB }
        };
      }
      return prev;
    });
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Teams Management */}
      <Card className="glass-card border-border/30 bg-black/50">
        <CardHeader>
          <CardTitle className="font-orbitron text-2xl">Section 1: Teams ({teams.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {canEdit && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add new team..."
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTeam()}
                className="flex-1"
              />
              <Button onClick={handleAddTeam} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Team
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {teams.map((team, index) => (
              <div key={index} className="relative">
                {editingTeamIndex === index ? (
                  <div className="flex gap-2">
                    <Input
                      value={editingTeamValue}
                      onChange={(e) => setEditingTeamValue(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveTeam(index)}
                      className="p-2 text-green-400 hover:bg-green-400/20 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingTeamIndex(null)}
                      className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-border/40 rounded-lg p-3 flex items-center justify-between group hover:border-yellow-400/50 transition">
                    <span className="text-sm font-medium truncate">{team}</span>
                    {canEdit && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEditTeam(index)}
                          className="p-1.5 text-blue-400 hover:bg-blue-400/20 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(index)}
                          className="p-1.5 text-red-400 hover:bg-red-400/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-400/10 border border-blue-400/30 rounded-lg">
            <p className="text-sm text-blue-300">
              💡 <strong>Note:</strong> Teams are automatically paired for Round 1 based on their position in the teams list.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Single Elimination Bracket */}
      <Card className="glass-card border-border/30 bg-black/50">
        <CardHeader>
          <CardTitle className="font-orbitron text-2xl">Section 2: Single Elimination Bracket</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            {canEdit ? "✓ Admin Mode: You can update match scores" : "Tournament bracket showing all matches"}
          </p>
          <div className="bg-black/30 border border-border/20 rounded-lg p-6">
            <BracketView 
              bracket={bracket} 
              onScoreChange={canEdit ? handleScoreChange : null}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="glass-card border-border/30 bg-blue-950/20">
              <CardHeader>
                <CardTitle className="font-orbitron text-base">Round 1</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>16 matches</p>
                <p>32 → 16 teams</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/30 bg-purple-950/20">
              <CardHeader>
                <CardTitle className="font-orbitron text-base">Round 2</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>8 matches</p>
                <p>16 → 8 teams</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/30 bg-pink-950/20">
              <CardHeader>
                <CardTitle className="font-orbitron text-base">Quarterfinals</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>4 matches</p>
                <p>8 → 4 teams</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Final Stage (Top 4) */}
      <Card className="glass-card border-border/30 bg-black/50">
        <CardHeader>
          <CardTitle className="font-orbitron text-2xl">Section 3: Final Stage (Top 4 Teams)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            {canEdit ? "✓ Admin Mode: You can update final stage scores" : "Semi-finals and finals where top 4 teams compete"}
          </p>

          {/* Semifinals */}
          <div>
            <h4 className="font-orbitron text-lg mb-4 text-yellow-400">Semifinals (4 Teams → 2 Teams)</h4>
            <div className="space-y-3">
              {finalStage.semifinals.map((match, idx) => (
                <div key={match.id} className="rounded-md border border-border/40 bg-black/80 text-white p-4">
                  <div className="mb-3 flex items-center justify-between text-sm uppercase tracking-wide text-muted-foreground">
                    <span className="font-semibold">Semifinal {idx + 1}</span>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-sm px-3 py-2 bg-gradient-to-r from-cyan-600/20 to-cyan-600/5 mb-2">
                    <span className="truncate font-medium">{match.teamA}</span>
                    {canEdit ? (
                      <Input
                        type="number"
                        className="w-12 h-8 text-right bg-orange-500 text-black border-none rounded font-bold text-sm"
                        value={match.scoreA}
                        onChange={(e) => handleFinalScoreChange("semifinals", match.id, Number(e.target.value) || 0, match.scoreB)}
                      />
                    ) : (
                      <span className="rounded bg-orange-500 px-2 py-1 font-orbitron text-black text-sm">{match.scoreA}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-sm px-3 py-2 bg-gradient-to-r from-cyan-600/20 to-cyan-600/5">
                    <span className="truncate font-medium">{match.teamB}</span>
                    {canEdit ? (
                      <Input
                        type="number"
                        className="w-12 h-8 text-right bg-orange-500 text-black border-none rounded font-bold text-sm"
                        value={match.scoreB}
                        onChange={(e) => handleFinalScoreChange("semifinals", match.id, match.scoreA, Number(e.target.value) || 0)}
                      />
                    ) : (
                      <span className="rounded bg-orange-500 px-2 py-1 font-orbitron text-black text-sm">{match.scoreB}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Finals */}
          <div>
            <h4 className="font-orbitron text-lg mb-4 text-yellow-400">Championship Finals (2 Teams → 1 Winner)</h4>
            <div className="rounded-md border border-border/40 bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 text-white p-4">
              <div className="mb-3 flex items-center justify-between text-sm uppercase tracking-wide text-muted-foreground">
                <span className="font-semibold text-yellow-400">Grand Finals</span>
                <Badge className="bg-yellow-600/50 text-yellow-100">Upcoming</Badge>
              </div>

              <div className="flex items-center justify-between rounded-sm px-3 py-3 bg-black/50 mb-2 border border-yellow-600/30">
                <span className="truncate font-bold text-base">{finalStage.finals.teamA}</span>
                {canEdit ? (
                  <Input
                    type="number"
                    className="w-12 h-8 text-right bg-yellow-500 text-black border-none rounded font-bold text-sm"
                    value={finalStage.finals.scoreA}
                    onChange={(e) => handleFinalScoreChange("finals", "final", Number(e.target.value) || 0, finalStage.finals.scoreB)}
                  />
                ) : (
                  <span className="rounded bg-yellow-500 px-3 py-2 font-orbitron text-black font-bold text-base">{finalStage.finals.scoreA}</span>
                )}
              </div>

              <div className="flex items-center justify-between rounded-sm px-3 py-3 bg-black/50 border border-yellow-600/30">
                <span className="truncate font-bold text-base">{finalStage.finals.teamB}</span>
                {canEdit ? (
                  <Input
                    type="number"
                    className="w-12 h-8 text-right bg-yellow-500 text-black border-none rounded font-bold text-sm"
                    value={finalStage.finals.scoreB}
                    onChange={(e) => handleFinalScoreChange("finals", "final", finalStage.finals.scoreA, Number(e.target.value) || 0)}
                  />
                ) : (
                  <span className="rounded bg-yellow-500 px-3 py-2 font-orbitron text-black font-bold text-base">{finalStage.finals.scoreB}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              🏆 <strong>Winners Advancement:</strong> SF winners advance to Finals. Finals winner is the champion!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Summary */}
      <Card className="glass-card border-border/30 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <CardHeader>
          <CardTitle className="font-orbitron text-lg">Tournament Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-yellow-400">{teams.length}</p>
            <p className="text-xs text-muted-foreground">Total Teams</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-cyan-400">28</p>
            <p className="text-xs text-muted-foreground">Total Matches</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">4</p>
            <p className="text-xs text-muted-foreground">Final Teams</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pink-400">1</p>
            <p className="text-xs text-muted-foreground">Winner</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RCBracket;
