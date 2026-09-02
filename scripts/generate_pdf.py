# -*- coding: utf-8 -*-
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVu-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVu-Oblique', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf'))

IVORY = colors.HexColor("#F7F4EE")
FOREST = colors.HexColor("#35443A")
CHARCOAL = colors.HexColor("#292B28")
TAUPE = colors.HexColor("#77756D")
TERRACOTTA = colors.HexColor("#B9826B")
BEIGE = colors.HexColor("#EDE7DD")

doc = SimpleDocTemplate(
    "/home/claude/brend/pdf/ilk-seansa-hazirliq.pdf",
    pagesize=A4,
    topMargin=18*mm, bottomMargin=16*mm, leftMargin=22*mm, rightMargin=22*mm,
    title="İlk seansa hazırlıq", author="Könül Babaşzadə"
)

styles = {}
styles['kicker'] = ParagraphStyle('kicker', fontName='DejaVu-Bold', fontSize=9, textColor=TERRACOTTA, leading=12, spaceAfter=6, tracking=1)
styles['title'] = ParagraphStyle('title', fontName='DejaVu-Bold', fontSize=25, textColor=CHARCOAL, leading=30, spaceAfter=10)
styles['sub'] = ParagraphStyle('sub', fontName='DejaVu-Oblique', fontSize=12.5, textColor=TAUPE, leading=18, spaceAfter=18)
styles['h2'] = ParagraphStyle('h2', fontName='DejaVu-Bold', fontSize=14.5, textColor=FOREST, leading=19, spaceBefore=16, spaceAfter=6)
styles['body'] = ParagraphStyle('body', fontName='DejaVu', fontSize=10.8, textColor=CHARCOAL, leading=16.5, spaceAfter=4)
styles['num'] = ParagraphStyle('num', fontName='DejaVu-Bold', fontSize=17, textColor=TERRACOTTA, leading=20)
styles['footer'] = ParagraphStyle('footer', fontName='DejaVu', fontSize=9, textColor=TAUPE, leading=13)

story = []

story.append(Paragraph("KÖNÜL BABAŞZADƏ · PSİXOLOQ", styles['kicker']))
story.append(Paragraph("İlk seansa hazırlıq", styles['title']))
story.append(Paragraph("Terapiyaya başlamazdan əvvəl bilməli olduğunuz 5 vacib şey", styles['sub']))
story.append(HRFlowable(width="100%", thickness=1, color=BEIGE, spaceAfter=14))

items = [
    ("01", "Hazır cavab gözləməyin",
     "İlk seans sizə hazır həll vermir — bir-birimizi tanıdığımız, sizin ehtiyacınızı birlikdə müəyyənləşdirdiyimiz bir görüşdür. Tələsmək lazım deyil."),
    ("02", "Hər şeyi bir dəfəyə danışmaq məcburiyyətində deyilsiniz",
     "Öz temponuzla açılmaq tamamilə normaldır. Nə qədər paylaşmaq istədiyinizi siz müəyyən edirsiniz."),
    ("03", "Sual vermək tamamilə normaldır",
     "Prosesin necə işlədiyi, nə qədər davam edəcəyi və ya metodun nə olduğu haqqında sualınız varsa, soruşmaqdan çəkinməyin."),
    ("04", "Rahat hiss etmədiyiniz format varsa deyin",
     "Üzbəüz və ya onlayn arasında seçim sizindir, istənilən vaxt formatı dəyişə bilərsiniz."),
    ("05", "Nəticə bir gündə gəlmir, amma addım atmısınız",
     "Dəyişiklik prosesdir. İlk görüşə gəlməklə artıq özünüzə ən vacib addımlardan birini atmısınız."),
]

for num, head, body in items:
    t = Table(
        [[Paragraph(num, styles['num']), Paragraph(f"<b>{head}</b><br/><br/>{body}", styles['body'])]],
        colWidths=[16*mm, 140*mm]
    )
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
    ]))
    story.append(t)

story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=1, color=BEIGE, spaceAfter=14))
story.append(Paragraph("Hazır olduğunuzda", styles['h2']))
story.append(Paragraph(
    "İlk görüş üçün müraciət etmək istəyirsinizsə, saytdakı rezervasiya formasını doldura və ya birbaşa "
    "WhatsApp / Instagram vasitəsilə yaza bilərsiniz. 24 saat ərzində sizinlə əlaqə saxlanılacaq.",
    styles['body']
))

story.append(Spacer(1, 6))
story.append(HRFlowable(width="100%", thickness=0.6, color=BEIGE, spaceAfter=8))
story.append(Paragraph("Könül Babaşzadə · Klinik Psixoloq, Psixoterapevt · Bakı", styles['footer']))
story.append(Paragraph("Bu sənəd nümunə (demo) məqsədilə hazırlanmışdır.", styles['footer']))

doc.build(story)
print("PDF hazırdır")
