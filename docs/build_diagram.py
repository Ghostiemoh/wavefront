"""Render the Wavefront architecture diagram to PNG via Pillow."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1600, 1100
PAD = 40
img = Image.new("RGB", (W, H), "#ffffff")
d = ImageDraw.Draw(img, "RGBA")


def load(size, bold=False):
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


F_TITLE = load(44, bold=True)
F_SUB = load(26)
F_ZONE = load(26, bold=True)
F_BOX = load(34, bold=True)
F_BOX_SUB = load(22)
F_NOTE = load(22)


def rounded(xy, radius, fill=None, outline=None, width=1):
    d.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def text_centered(text, cx, y, font, fill="#1e1e1e"):
    bbox = d.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    d.text((cx - w / 2, y), text, font=font, fill=fill)


def text_at(text, x, y, font, fill="#1e1e1e"):
    d.text((x, y), text, font=font, fill=fill)


def arrow(x1, y1, x2, y2, color="#1e1e1e", width=3, dashed=False):
    if dashed:
        # simple dashed line
        from math import hypot
        dist = hypot(x2 - x1, y2 - y1)
        steps = int(dist / 16)
        for i in range(steps):
            if i % 2 == 0:
                t1 = i / steps
                t2 = (i + 1) / steps
                d.line(
                    [(x1 + (x2 - x1) * t1, y1 + (y2 - y1) * t1),
                     (x1 + (x2 - x1) * t2, y1 + (y2 - y1) * t2)],
                    fill=color, width=width,
                )
    else:
        d.line([(x1, y1), (x2, y2)], fill=color, width=width)
    # arrowhead
    from math import atan2, cos, sin
    ang = atan2(y2 - y1, x2 - x1)
    size = 14
    h1 = (x2 - size * cos(ang - 0.5), y2 - size * sin(ang - 0.5))
    h2 = (x2 - size * cos(ang + 0.5), y2 - size * sin(ang + 0.5))
    d.polygon([(x2, y2), h1, h2], fill=color)


# Title
text_centered("Wavefront — Intelligence Pipeline", W // 2, 30, F_TITLE)
text_centered("Solana data → narratives + risk verdicts → AI analyst", W // 2, 88, F_SUB, "#757575")

# DATA LAYER zone
data_y0, data_h = 140, 240
rounded((PAD, data_y0, W - PAD, data_y0 + data_h),
        radius=20, fill=(219, 228, 255, 90), outline="#4a9eed", width=2)
text_at("DATA LAYER · Birdeye API (3 keys, 60 RPM each, 5-min cache + stale fallback)",
        PAD + 24, data_y0 + 16, F_ZONE, "#2563eb")

# 3 lane boxes
lane_y = data_y0 + 70
lane_h = 120
lane_w = 380
gap = (W - 2 * PAD - 3 * lane_w) // 4
lane_x = [PAD + gap + i * (lane_w + gap) for i in range(3)]
lane_labels = [("CHARTS", "price + volume"), ("HOLDERS", "concentration + security"), ("TRADES", "new listings")]
for (x, (title, sub)) in zip(lane_x, lane_labels):
    rounded((x, lane_y, x + lane_w, lane_y + lane_h),
            radius=18, fill="#a5d8ff", outline="#4a9eed", width=3)
    text_centered(title, x + lane_w // 2, lane_y + 26, F_BOX, "#1e3a5f")
    text_centered(sub, x + lane_w // 2, lane_y + 76, F_BOX_SUB, "#2563eb")

# arrows down from each lane
intel_y0 = data_y0 + data_h + 60
for x in lane_x:
    cx = x + lane_w // 2
    arrow(cx, lane_y + lane_h + 10, cx, intel_y0 - 12, color="#1e1e1e", width=3)

# INTELLIGENCE LAYER zone
intel_h = 280
rounded((PAD, intel_y0, W - PAD, intel_y0 + intel_h),
        radius=20, fill=(229, 219, 255, 90), outline="#8b5cf6", width=2)
text_at("INTELLIGENCE LAYER · TypeScript engines + Gemini 2.5 Flash",
        PAD + 24, intel_y0 + 16, F_ZONE, "#8b5cf6")

# 3 engine boxes
eng_y = intel_y0 + 75
eng_h = 170
eng_w = 380
eng_x = [PAD + gap + i * (eng_w + gap) for i in range(3)]
eng_specs = [
    ("Narrative\nClusterer", "10 categories", "#d0bfff", "#8b5cf6", "#3b0764"),
    ("Risk\nScorer", "A+ to F grades", "#ffd8a8", "#f59e0b", "#7c2d12"),
    ("Gemini 2.5 Flash", "analyst Copilot", "#eebefa", "#ec4899", "#831843"),
]
for x, (title, sub, fill, stroke, txt) in zip(eng_x, eng_specs):
    rounded((x, eng_y, x + eng_w, eng_y + eng_h),
            radius=18, fill=fill, outline=stroke, width=3)
    lines = title.split("\n")
    if len(lines) == 1:
        text_centered(lines[0], x + eng_w // 2, eng_y + 30, F_BOX, txt)
        text_centered(sub, x + eng_w // 2, eng_y + 90, F_BOX_SUB, txt)
    else:
        text_centered(lines[0], x + eng_w // 2, eng_y + 20, F_BOX, txt)
        text_centered(lines[1], x + eng_w // 2, eng_y + 65, F_BOX, txt)
        text_centered(sub, x + eng_w // 2, eng_y + 120, F_BOX_SUB, txt)

# dashed arrow Narrative -> Gemini, Risk -> Gemini (context)
arrow(eng_x[0] + eng_w + 5, eng_y + eng_h // 2,
      eng_x[2] - 10, eng_y + eng_h // 2 - 10,
      color="#8b5cf6", width=2, dashed=True)
text_centered("context", (eng_x[0] + eng_x[2] + eng_w) // 2,
              eng_y + eng_h // 2 - 36, F_NOTE, "#8b5cf6")

# arrows down to UI
ui_y0 = intel_y0 + intel_h + 60
for x in eng_x:
    cx = x + eng_w // 2
    arrow(cx, eng_y + eng_h + 10, cx, ui_y0 - 12, color="#22c55e", width=3)

# UI LAYER zone
ui_h = 220
rounded((PAD, ui_y0, W - PAD, ui_y0 + ui_h),
        radius=20, fill=(211, 249, 216, 100), outline="#22c55e", width=2)
text_at("UI LAYER · Next.js 16 App Router + React 19 + Framer Motion",
        PAD + 24, ui_y0 + 16, F_ZONE, "#15803d")

# 4 route boxes
route_y = ui_y0 + 70
route_h = 130
route_w = 320
route_gap = (W - 2 * PAD - 4 * route_w) // 5
route_x = [PAD + route_gap + i * (route_w + route_gap) for i in range(4)]
route_specs = [("/", "home"), ("/feed", "intelligence"), ("/verdict/[mint]", "risk autopsy"), ("/terminal", "MCP playground")]
for x, (title, sub) in zip(route_x, route_specs):
    rounded((x, route_y, x + route_w, route_y + route_h),
            radius=18, fill="#b2f2bb", outline="#22c55e", width=3)
    text_centered(title, x + route_w // 2, route_y + 30, F_BOX, "#14532d")
    text_centered(sub, x + route_w // 2, route_y + 84, F_BOX_SUB, "#15803d")

out = Path(__file__).parent / "images" / "06-architecture.png"
img.save(out, "PNG", optimize=True)
print(f"Wrote {out} ({out.stat().st_size:,} bytes)")
