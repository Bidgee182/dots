export function calculateDotCounts(holes, players) {
  const counts = {};
  players.forEach((p) => (counts[p] = 0));

  holes.forEach((hole) => {
    // Count valid shots
    hole.shots.forEach((s) => {
      if (s.player && players.includes(s.player)) {
        counts[s.player] += 1;
      }
    });

    const { bonuses, penalties } = hole;

    // Bonuses
    if (bonuses.closestToPin && players.includes(bonuses.closestToPin)) {
      counts[bonuses.closestToPin] += 1;
    }

    if (bonuses.greenInTwo && players.includes(bonuses.greenInTwo)) {
      counts[bonuses.greenInTwo] += 1;
    }

    if (bonuses.hitAndPutt && players.includes(bonuses.hitAndPutt)) {
      counts[bonuses.hitAndPutt] += 1;
    }

    // ✅ Clean Sweep FIX
    if (bonuses.cleanSweep) {
      const first = hole.shots[0]?.player;
      const allSame = hole.shots.every((s) => s.player === first);
      if (allSame && first && players.includes(first)) {
        counts[first] += 1;
      }
    }

    // Penalties
    if (penalties) {
      Object.entries(penalties).forEach(([player, types]) => {
        if (players.includes(player)) {
          counts[player] -= types.length;
        }
      });
    }
  });

  return counts;
}
