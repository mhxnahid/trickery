```bash
#download 720p OR lower, save as MP4
python -m youtube-dl -f 'bestvideo[height<=1280][ext=mp4]+bestaudio[ext=m4a]' --merge-output-format mp4 "URL"
```
