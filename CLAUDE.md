@AGENTS.md

# Ổ đĩa: làm mọi thứ trên ổ D

Ổ C đã đầy. Mọi file tạo ra (script, ảnh render, log, snapshot, file tải về, file tạm) phải nằm trên ổ D:
- Nội dung marketing, script, ảnh: `D:\bitalgo-content\...`. Tài liệu: `D:\page\docs`.
- File tạm: `D:\bitalgo-content\tmp`. Trước khi chạy Chrome/Playwright/ffmpeg/npm, đặt `TEMP` và `TMP` về thư mục này.
- Không dùng `/tmp` (Git Bash trỏ nó về ổ C), `%TEMP%`, hay scratchpad dưới `C:\Users\...\AppData`.
- Chỉ được ghi vào ổ C với file cấu hình và bộ nhớ của Claude (`C:\Users\Admin\.claude`) và các app đã cài sẵn (Lynx). Không cài thêm gì vào ổ C.
