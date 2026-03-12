# How Wolfenstein 3D handles closing doors

In the original **Wolfenstein 3D (1992)** engine, doors are implemented as special tiles in the grid-based map. The engine explicitly prevents a door from closing if the **player or an actor is occupying the doorway tile**. In other words: **the door simply refuses to close until the tile is clear.**

### Key idea: door tiles are “blocked” while occupied

Each door has a state machine roughly like:

1. **Closed**
2. **Opening**
3. **Open (waiting)**
4. **Closing**

When the door tries to transition from **open → closing**, the game checks whether anything is inside the door tile (player or enemy). If so, it **aborts the closing attempt** and keeps the door open.

This is why in gameplay:

* If you **stand in a doorway**, the door will stay open.
* If an **enemy dies in the doorway**, the door can remain stuck open forever because the tile stays blocked. ([wolfenstein.fandom.com][1])

### How the check works (conceptually)

Internally the map keeps a grid of tiles (64×64 world units per tile).
Each door occupies one tile.

Before the door finishes closing, the engine does a tile-occupancy check:

Pseudo-logic (simplified from the Wolf3D source):

```c
if (actor_at[door_x][door_y] != NULL || player_is_in_tile(door_x, door_y))
{
    // Something is blocking the door
    reopen_or_keep_open(door);
    return;
}
else
{
    continue_closing(door);
}
```

So the engine never needs to deal with the complicated case of a door closing “through” the player.

### Why this design was convenient

Wolfenstein’s engine is **strictly grid-based**:

* Walls = solid tiles
* Doors = special tiles with an animation offset
* Actors = occupy tiles for collision checks

Allowing a door to close while something is inside would require **continuous collision resolution** (pushing the player out, crushing, etc.), which the engine wasn’t built for. The tile check avoids that entirely.

### Interesting side effect

Because the check only cares about the tile being occupied:

* A **dead enemy corpse in the doorway** keeps the door open.
* Players sometimes exploit this to **block doors permanently**.
