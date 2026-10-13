"""Isolate the existing bottle photograph; no generated branding or imagery."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

root = Path(__file__).resolve().parents[1]
image = Image.open(root / 'public/images/bottle-product.png').convert('RGBA')
mask = Image.new('L', image.size)
outline = [(470,60),(492,57),(533,57),(554,62),(557,76),(556,93),(561,105),
           (557,121),(551,126),(551,170),(562,230),(577,290),(600,356),
           (623,413),(636,467),(640,529),(640,917),(635,940),(623,956),
           (597,963),(430,963),(408,955),(394,940),(388,917),(385,539),
           (389,468),(401,416),(425,351),(445,290),(460,228),(472,169),
           (473,126),(466,120),(463,106),(467,92),(466,76)]
ImageDraw.Draw(mask).polygon(outline, fill=255)
image.putalpha(mask.filter(ImageFilter.GaussianBlur(1)))
image.crop((374,46,652,976)).save(root / 'public/images/bottle-subject.png', optimize=True)
print('Prepared bottle-subject.png from existing bottle-product.png')
