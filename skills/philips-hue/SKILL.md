---
name: philips-hue
description: Control Philips Hue lights throughout Frank's home via the Hue Bridge local API.
---

# Philips Hue Light Control

Use this skill when Frank asks to control lights, set scenes, adjust brightness/color, or check light status.

## Setup (one-time)

1. Find the Hue Bridge IP on the network (check router admin page or use `hue-discover`)
2. Press the button on top of the Hue Bridge to pair
3. POST to `http://<bridge-ip>/api` with body `{"devicetype":"circuit#pc"}` to get a username/API key
4. Save the bridge IP and API key to `C:\Users\frank\.openclaw\workspace\skills\philips-hue\config.json`:
   ```json
   {
     "bridge_ip": "192.168.x.x",
     "api_key": "your-api-key-here"
   }
   ```

## API Base

All calls go to: `http://<bridge-ip>/api/<api-key>/`

## Common Operations

### List all lights
GET `/api/<api-key>/lights`

### Toggle a light on/off
PUT `/api/<api-key>/lights/<id>/state` body: `{"on": true}` or `{"on": false}`

### Set brightness (0-254)
PUT `/api/<api-key>/lights/<id>/state` body: `{"bri": 200}`

### Set color by hue (0-65535) and saturation (0-254)
PUT `/api/<api-key>/lights/<id>/state` body: `{"hue": 46920, "sat": 254}`

### Set color temperature (153-500, mirek)
PUT `/api/<api-key>/lights/<id>/state` body: "ct": 370}`

### Set a scene
PUT `/api/<api-key>/groups/0/action` body: `{"scene": "scene-id"}`

### List scenes
GET `/api/<api-key>/scenes`

### List rooms/zones
GET `/api<api-key>/groups`

### Control a room (group)
PUT `/api/<api-key>/groups/<id>/action` body: `{"on": true, "bri": 200}`

## Bedroom Lights (Frank's main room)

| ID | Name | Type |
|---|---|---|
| 14 | bedside lamp | Lamp |
| 5 | light strip | LED strip |
| 11 | wall light 1 | Wall |
| 10 | wall light 2 | Wall |
| 12 | corner light 1 | Corner |
| 13 | corner light 2 | Corner |

Bedroom Hue Room Group: **1**

## Other Rooms

| Room | IDs |
|---|---|
| Mom's Room | 15 (night table 1), 16 (night table 2) |
| Entertainment Area 1 | 5 (shared light strip) |
| Living Room | (no lights assigned yet) |

## Common Scenes

Scenes exist on the bridge but names may not be exposed via basic API. Use `hue.ps1 scenes` to list scene IDs, then activate with `hue.ps1 scene <id>`.

## Safety

- Never expose the API key in chat or logs
- Only modify lights when explicitly asked
- Confirm before turning off all lights or changing scenes dramatically
