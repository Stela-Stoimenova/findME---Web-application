How to change videos shown by the static Video API

Overview
- The interactive page loads `assets/videos.json`. To change which videos appear, edit that JSON or replace assets referenced by it.

Video record fields (example in `assets/videos.json`)
- id: unique string
- title: visible title
- description: short description
- category: category slug
- tags: array of strings
- duration: length in seconds
- thumbnail: path or URL to poster image (use WebP/AVIF if possible)
- posterLow: optional low-res image for progressive loading
- sourceType: "youtube" | "self" (youtube embed or self-hosted file)
- youtubeId: (if sourceType is youtube)
- mp4Url: (if self-hosted mp4)
- hlsUrl: (if using HLS)
- captions: array of {lang,label,url} pointing to VTT files
- transcriptUrl: optional text transcript

Steps to add/change a video
1. Add your media files to `assets/videos/` (thumbnails, mp4, captions). Example:
   - assets/videos/my-event-poster.webp
   - assets/videos/my-event.mp4
   - assets/captions/my-event.en.vtt
2. Open `assets/videos.json` and add or edit an entry. For a YouTube video use `sourceType: "youtube"` and `youtubeId: "<id>"`.
3. Save the file and reload `html/interactive.html` in the browser. If you serve files from a static server, refresh the page.

Notes
- If you host MP4 files locally, serve the site with a static server (double-clicking HTML files in some browsers may block or disallow video playback depending on CORS).
- For production, use a CDN or a managed video provider (Mux, Cloudinary) for better performance and streaming.
- To test locally quickly, you can point `mp4Url` to a public sample MP4 (the repo uses an example URL).

Troubleshooting
- If thumbnails don't show, ensure the `thumbnail` path is correct relative to the HTML file (interactive.html loads JSON from `../assets/videos.json`, and the JSON uses paths relative to that file).
- If captions don't load, confirm VTT file paths and that the server serves `.vtt` with correct MIME type.

If you'd like, I can:
- Add a small admin UI to add/remove entries from `videos.json` in the browser (no backend), or
- Scaffold a minimal Node.js backend to upload files and return a proper API.
