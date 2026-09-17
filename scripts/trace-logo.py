"""Trace the Aurum emblem (crown + U) from the official PNG into polygons for THREE.ExtrudeGeometry.

Outputs src/three/emblem-shapes.json with two outlines in emblem space (unit height, y-up):
  crown  - crown silhouette (extruded: velvet caps, gold bevel rim)
  ring   - the cream "U" beneath the crown
"""
import json
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

SRC = 'source-assets/new-logo.png'
OUT = 'src/three/emblem-shapes.json'

img = Image.open(SRC).convert('RGBA')
px = np.array(img).astype(int)
H, W = px.shape[:2]
alpha = px[..., 3] > 110
alpha[680:, :] = False  # drop the wordmark row

r, g, b = px[..., 0], px[..., 1], px[..., 2]


def components(mask):
    seen = np.zeros_like(mask)
    comps = []
    for y0, x0 in zip(*np.where(mask)):
        if seen[y0, x0]:
            continue
        q = deque([(y0, x0)])
        seen[y0, x0] = True
        pts = []
        while q:
            y, x = q.popleft()
            pts.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    q.append((ny, nx))
        comps.append(pts)
    return sorted(comps, key=len, reverse=True)


def close(mask, size=5):
    im = Image.fromarray((mask * 255).astype('uint8'))
    im = im.filter(ImageFilter.MaxFilter(size)).filter(ImageFilter.MinFilter(size))
    return np.array(im) > 127


def trace(mask):
    """Moore-neighbour outer boundary trace, returns list of (x, y)."""
    ys, xs = np.where(mask)
    i = np.lexsort((xs, ys))[0]
    start = (xs[i], ys[i])
    dirs = [(-1, 0), (-1, -1), (0, -1), (1, -1), (1, 0), (1, 1), (0, 1), (-1, 1)]

    def on(x, y):
        return 0 <= x < W and 0 <= y < H and mask[y, x]

    contour = [start]
    cur, back = start, 0  # entered from the left
    for _ in range(200000):
        found = False
        for k in range(8):
            d = (back + 1 + k) % 8
            nx, ny = cur[0] + dirs[d][0], cur[1] + dirs[d][1]
            if on(nx, ny):
                back = (d + 4) % 8
                cur = (nx, ny)
                found = True
                break
        if not found or cur == start:
            break
        contour.append(cur)
    return contour


def rdp(points, eps):
    pts = np.array(points, dtype=float)

    def rec(a, b):
        if b <= a + 1:
            return [a]
        p0, p1 = pts[a], pts[b]
        seg = p1 - p0
        n = np.hypot(*seg) or 1.0
        rel = pts[a + 1:b] - p0
        d = np.abs(seg[0] * rel[:, 1] - seg[1] * rel[:, 0]) / n
        k = int(np.argmax(d))
        if d[k] > eps:
            m = a + 1 + k
            return rec(a, m) + rec(m, b)
        return [a]

    # split closed loop at farthest point from start for stability
    far = int(np.argmax(np.hypot(*(pts - pts[0]).T)))
    idx = rec(0, far) + rec(far, len(pts) - 1)
    return [tuple(pts[i]) for i in idx]


comps = components(close(alpha, 3))
print('components', [len(c) for c in comps[:4]])
masks = []
for c in comps[:2]:
    m = np.zeros_like(alpha)
    ys, xs = zip(*c)
    m[list(ys), list(xs)] = True
    masks.append(m)
# crown is the component whose top is highest
masks.sort(key=lambda m: np.where(m)[0].min())
crown_mask, ring_mask = masks

shapes = {}
ys, xs = np.where(alpha)
cy_top, cy_bot = ys.min(), ys.max()
cx = (xs.min() + xs.max()) / 2
scale = 1.0 / (cy_bot - cy_top)
cy = (cy_top + cy_bot) / 2
for name, m, eps in (('crown', crown_mask, 1.1), ('ring', close(ring_mask, 3), 1.1)):
    poly = rdp(trace(m), eps)
    shapes[name] = [[round((x - cx) * scale, 5), round((cy - y) * scale, 5)] for x, y in poly]
    print(name, len(poly), 'points')

json.dump(shapes, open(OUT, 'w'))
print('wrote', OUT)
