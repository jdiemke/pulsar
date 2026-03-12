# How to check if a player can interact with a door

To check if a **player can interact with a door in a 3D game**, games usually combine **distance checks**, **direction checks**, and sometimes **line-of-sight checks**. The exact method depends on the engine (Unity, Unreal, custom engine), but the logic is generally the same.

---

## 1. Distance Check (Basic Requirement)

First check if the player is **close enough to the door**.

**Concept:**
If the distance between the player and the door is below some threshold, interaction is allowed.

**Example (pseudo code):**

```pseudo
distance = length(player.position - door.position)

if distance < interactionRange:
    canInteract = true
```

Typical values:

* 1–3 meters for doors
* adjustable per object

---

## 2. Direction / Facing Check (Optional but common)

You usually want the player to be **looking toward the door**, not standing nearby facing away.

Use a **dot product** between the player's forward direction and the direction to the door.

```pseudo
directionToDoor = normalize(door.position - player.position)
dot = dotProduct(player.forward, directionToDoor)

if dot > 0.6:
    facingDoor = true
```

Interpretation:

| Dot value | Meaning                  |
| --------- | ------------------------ |
| 1         | looking directly at door |
| 0         | perpendicular            |
| -1        | looking away             |

Typical threshold: **0.5 – 0.8**

---

## 3. Line of Sight Check (Very common)

Even if the player is close, something might block the interaction.

Use a **raycast** from the player camera.

```pseudo
ray = Ray(player.camera.position, player.camera.forward)

hit = raycast(ray)

if hit.object == door:
    visible = true
```

This ensures the player actually **points at the door**.

---

## 4. Interaction Input Check

Finally check if the player pressed the interaction key.

```pseudo
if canInteract AND playerPressedInteract:
    door.open()
```

---

## 5. Typical Combined System

Most games combine everything:

```pseudo
if distance < interactionRange:
    if dot(player.forward, directionToDoor) > 0.6:
        if raycast(player.camera.forward) hits door:
            showInteractionPrompt()
```

---

## 6. Alternative: Trigger Volumes

Another method is using a **trigger collider around the door**.

Workflow:

1. Player enters trigger zone
2. Door becomes interactable
3. Player presses interact key

Example:

```pseudo
onTriggerEnter(player):
    door.canInteract = true

onTriggerExit(player):
    door.canInteract = false
```

---

## 7. What AAA Games Usually Do

Most modern games use:

**Raycast from camera + interaction interface**

Advantages:

* works for all objects
* scalable
* easy UI prompts

---

✅ **Summary**

Common checks:

1. **Distance** – player is near
2. **Facing direction** – player looks toward object
3. **Raycast** – player points at object
4. **Input** – player presses interact
