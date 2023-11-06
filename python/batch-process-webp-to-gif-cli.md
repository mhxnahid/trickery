```bash
for f in *.webp;do echo "$f";python3 -c "from PIL import Image;Image.open('$f').save('${f%.webp}.gif','gif',save_all=True,optimize=True,background=0)";done
```
