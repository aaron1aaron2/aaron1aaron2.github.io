# Aaron Ho · Portfolio

首頁以問題概要、負責範圍及成果介紹代表產品、研究與競賽，再連到完整案例。中英內容對應，語言切換與頁面導覽採不同樣式。更新／新增作品請依下列規則與模板維護。

[網站 / Website](https://aaron1aaron2.github.io/) · [專案 / Projects](https://aaron1aaron2.github.io/projects.html)

這是個人作品集的公開靜態網站。首頁、專案列表、案例、履歷與CV均提供中英文切換；研究、原型、團隊作品與產品交付保留各自的責任及驗證範圍。

## 維護文件

- [閱讀結構與固定格式](docs/PROJECT_STRUCTURE.md)
- [圖片選擇、排序與公開界線](docs/MEDIA_POLICY.md)
- [新增專案步驟](docs/ADDING_PROJECTS.md)
- [新增專案模板](docs/templates/project.md)

網站檔案放在 `public/`，GitHub Pages workflow只部署這個目錄；上述維護文件留在repo，不混入讀者介面。原始公司文件、手冊、簡報、內部截圖與私人來源資料不放進公開repo。公開圖片只保留經挑選與必要去識別的衍生版本。

## 行為約定

列表每案提供1–3張圖片，按現場照片、實際畫面、架構與流程排列；不自動播放。上一張／下一張與左右方向鍵切換，點圖開啟浮層，×、窗外或Esc關閉並恢復閱讀位置。只有一張時隱藏切換控制。停用JavaScript時仍可直接閱讀圖片。

All pages support Chinese and English. Original figures and screenshots retain their source language and attribution; explanatory captions are bilingual. Reconstructed interactions are explicitly labeled as schematics, never presented as original product screenshots.

## 技術與研究入口

每案在列表及案例首屏顯示有據的技術關鍵字；首頁代表案例沿用同一組標籤。研究與發表的標題連到各自案例，另說明本人分工；常用技術按應用分組並附作品入口。標籤是閱讀提示，不是篩選按鈕或熟練度評分。

技術導向案例以架構與流程為主，不為了有UI而放零碎控件。需要呈現操作設計的案例，截圖須保留該功能的基本資訊與分析圖表，必要去敏不得破壞理解。

每篇案例集中回答一個主要問題，正文依情境、系統／介面、關鍵取捨及成果展開；導覽順序相同。相關案例放最後，深入機制可展開。平台總覽與子案各自承擔清楚主題，避免重複。


## 2026-11-19 旗艦平台的系統與功能深度

旗艦平台先說清楚產品目標與本人責任，再以模組表呈現系統／功能全貌；主架構、事件流程及具代表性的真實介面各回答不同問題。不得為精簡而把完整產品縮成單一UI功能。監控需區分資料通道、非同步工作佇列、特徵／WAV／FFT保存、事件執行狀態與資料完整度；RabbitMQ設計參與不推定所有部署均使用同一broker。出廠檢測需交代計畫→工單→待測物、執行紀錄、階段／測點、基準錄製／確認／版本、門檻與判定、偏離定位及教學。三層主要UI不等於工單三分頁或三層判讀。文件中的能力、現場已驗證能力與正式驗收必須分開。
