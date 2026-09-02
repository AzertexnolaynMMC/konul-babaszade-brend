from PIL import Image, ImageDraw, ImageFont
import os

OUT = "/home/claude/brend/images"
os.makedirs(OUT, exist_ok=True)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

IVORY = (247, 244, 238)
BEIGE = (237, 231, 221)
SAGE = (168, 181, 162)
FOREST = (53, 68, 58)
CHARCOAL = (41, 43, 40)
TERRACOTTA = (185, 130, 107)

def lerp(c1, c2, t):
    return tuple(int(c1[i] + (c2[i]-c1[i])*t) for i in range(3))

def gradient(w, h, c1, c2, diagonal=True):
    img = Image.new("RGB", (w, h), c1)
    draw = ImageDraw.Draw(img)
    if diagonal:
        for y in range(h):
            t = y / h
            row_color = lerp(c1, c2, t)
            draw.line([(0, y), (w, y)], fill=row_color)
    return img

def add_label(img, filename, size_label, desc, dark_text=False, accent=TERRACOTTA):
    w, h = img.size
    draw = ImageDraw.Draw(img, "RGBA")
    # subtle center card
    card_w, card_h = int(w*0.72), int(h*0.34)
    cx, cy = w//2, h//2
    box = (cx-card_w//2, cy-card_h//2, cx+card_w//2, cy+card_h//2)
    draw.rounded_rectangle(box, radius=14, fill=(255,255,255,235))

    text_color = CHARCOAL
    accent_color = accent

    f_big = ImageFont.truetype(FONT_BOLD, max(18, int(h*0.045)))
    f_small = ImageFont.truetype(FONT_REG, max(13, int(h*0.026)))
    f_tiny = ImageFont.truetype(FONT_REG, max(11, int(h*0.022)))

    def center_text(y, text, font, color):
        bbox = draw.textbbox((0,0), text, font=font)
        tw = bbox[2]-bbox[0]
        draw.text((cx - tw/2, y), text, font=font, fill=color)

    # small accent line
    draw.rectangle((cx-30, box[1]+22, cx+30, box[1]+26), fill=accent_color)

    center_text(box[1]+40, filename, f_big, text_color)
    center_text(box[1]+40+int(h*0.06), size_label, f_small, (120,115,100))
    center_text(box[1]+40+int(h*0.06)+int(h*0.045), desc, f_tiny, (140,135,120))
    center_text(box[1]+card_h-36, "bura öz şəklinizi qoyun", f_tiny, accent_color)

    return img

def make(filename, w, h, c1, c2, size_label, desc, diagonal=True):
    img = gradient(w, h, c1, c2, diagonal)
    img = add_label(img, filename, size_label, desc)
    path = os.path.join(OUT, filename)
    img.save(path, quality=87)
    print("made", filename)

# HERO / ABOUT
make("hero-portrait.jpg", 800, 1000, SAGE, BEIGE, "800 × 1000 px", "Hero bölməsi — portret")
make("hero-secondary.jpg", 500, 600, TERRACOTTA, BEIGE, "500 × 600 px", "Hero — kiçik detal foto")
make("about-portrait.jpg", 800, 1000, BEIGE, SAGE, "800 × 1000 px", "Haqqımda bölməsi şəkli")

# GALLERY (6)
gallery_desc = [
    ("gallery-1.jpg", "Kabinet / otaq görünüşü"),
    ("gallery-2.jpg", "Söhbət / seans anı"),
    ("gallery-3.jpg", "İş masası / qeydlər"),
    ("gallery-4.jpg", "Gözləmə otağı / interyer"),
    ("gallery-5.jpg", "Portret / peşəkar foto"),
    ("gallery-6.jpg", "Ətraf mühit / detal"),
]
colors = [(SAGE,BEIGE),(BEIGE,TERRACOTTA),(SAGE,FOREST),(BEIGE,SAGE),(TERRACOTTA,BEIGE),(FOREST,SAGE)]
for (fname, desc), (c1,c2) in zip(gallery_desc, colors):
    make(fname, 1600, 1000, c1, c2, "1600 × 1000 px", desc)

# BLOG (3)
blog_desc = [
    ("blog-1.jpg", "Məqalə 1 — üz şəkli"),
    ("blog-2.jpg", "Məqalə 2 — üz şəkli"),
    ("blog-3.jpg", "Məqalə 3 — üz şəkli"),
]
for fname, desc in blog_desc:
    make(fname, 800, 500, TERRACOTTA, BEIGE, "800 × 500 px", desc)

# INSTAGRAM REELS (3) - vertical 9:16
reel_desc = [
    ("reel-1.jpg", "Instagram reel 1 kadrı"),
    ("reel-2.jpg", "Instagram reel 2 kadrı"),
    ("reel-3.jpg", "Instagram reel 3 kadrı"),
]
for fname, desc in reel_desc:
    make(fname, 720, 1280, FOREST, SAGE, "720 × 1280 px", desc)

# YOUTUBE (3) - 16:9
yt_desc = [
    ("youtube-1.jpg", "YouTube video 1 kadrı"),
    ("youtube-2.jpg", "YouTube video 2 kadrı"),
    ("youtube-3.jpg", "YouTube video 3 kadrı"),
]
for fname, desc in yt_desc:
    make(fname, 1280, 720, CHARCOAL, TERRACOTTA, "1280 × 720 px", desc)

# CERTIFICATES (3)
cert_desc = [
    ("certificate-1.jpg", "Diplom / sertifikat 1"),
    ("certificate-2.jpg", "Diplom / sertifikat 2"),
    ("certificate-3.jpg", "Diplom / sertifikat 3"),
]
for fname, desc in cert_desc:
    make(fname, 800, 600, BEIGE, SAGE, "800 × 600 px", desc)

# OG image
make("og-image.jpg", 1200, 630, FOREST, SAGE, "1200 × 630 px", "Sosial paylaşım (Open Graph) şəkli")

print("DONE")
