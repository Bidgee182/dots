import { useGame } from "../context/GameContext";

export default function TeamScoreSummary() {
  const { holes, players } = useGame();
  const totalStrokes = holes.reduce((acc, h) => acc + h.teamStrokes, 0);
  const parTotal = holes.reduce((acc, h) => acc + h.par, 0);
  const scoreVsPar = totalStrokes - parTotal;

  return (
    <div className="text-center text-white mt-6">
      <h3 className="text-lg font-bold text-yellow-400">Team Score Summary</h3>
      <p>Total Strokes: <strong>{totalStrokes}</strong></p>
      <p>Team Par: <strong>{parTotal}</strong></p>
      <p>
        Score vs Par:{" "}
        <span className={scoreVsPar > 0 ? "text-red-400" : scoreVsPar < 0 ? "text-green-400" : ""}>
          {scoreVsPar > 0 ? "+" : ""}
          {scoreVsPar}
        </span>
      </p>
    </div>
  );
}
