# Visual asset provenance

15 PNG works recovered as standalone, decodable image copies from the local ChatGPT Library cache and visually matched to the user’s Library screenshots. Image bytes are preserved; cached dimensions are recorded below. Original maximum export resolution and the entire cloud Library were not verified. No cache headers, account data or browser records are included.

| File in `public/images/posters` | Work | Dimensions | SHA-256 |
| --- | --- | --- | --- |
| `food-illustration.png` | 美食手绘 · 日式餐桌 | 1122 × 1402 | `6645290aa42d9f3816f3493d7ad40723e294dd99281926c6d9e53b679a040120` |
| `food-diary-corgi.png` | 美食拼贴 · More Good Days | 1122 × 1402 | `77f5cd83582fb7d021f6681ddedb48b699267d4efc79fb20972c10d095dc5e24` |
| `food-diary.png` | 美食拼贴 · 餐桌日记 | 1122 × 1402 | `9c29bea3956a390afd2a754dd5fc8dd3a9e0a2a64524be5c11f2bcff777110a4` |
| `travel-family-corgi.png` | 旅行拼贴 · 日落与陪伴 | 1122 × 1402 | `832e700af15d38c29f13236df449057136ef1f9574be304d1f75ba783e4e16db` |
| `travel-family.png` | 旅行拼贴 · 温暖时刻 | 1122 × 1402 | `25f81ab8f1ef0380c973b8fe8c58cb1212d3625f7d76dd019afab0879de58b10` |
| `travel-diary.png` | 旅行拼贴 · 圣托里尼 | 1122 × 1402 | `50d1d55a7c6cfe33518b7889f1c1a95a5062343ae4e9dbc26dc66b448be66983` |
| `santorini-illustration.png` | 风景插画 · 海岛日落 | 1122 × 1402 | `c590316c63024f22b900e7a9aaab853b4e1e0ff2a22d983bba9c33ac923733b5` |
| `santorini-sunset.png` | 风景视觉 · 金色时刻 | 1122 × 1402 | `9eb5e994bc0d5a046b72633f7e80b5ad97654c89e57789466b613dfcea815a20` |
| `watercolor-kites.png` | 水彩风格化 · 风筝与歌声 | 919 × 1712 | `43cb675fd3c20ec83a6c4df83fdea0741bd737a9f6affa28efebfc34fa402543` |
| `watercolor-wallpaper.png` | 水彩风格化 · 竖屏构图 | 845 × 1860 | `ee9b8c844148ac6e6d01ed48cc8eadf88cc0ddf150f98b839d051efa5780db99` |
| `watercolor-space.png` | 水彩风格化 · 留白构图 | 845 × 1860 | `b10610ddbe12751d9d39ebaa090a61a9e26570050d819d0cb982f0ac9825e3d6` |
| `portfolio-style-b.png` | 网站概念 · Style B 极简编辑 | 1448 × 1086 | `b1c32d44ddd23b72a2c8a6602180bd39a01db8c107937f6445e8d37188ad1285` |
| `portfolio-style-a.png` | 网站概念 · Style A 科技夜色 | 1448 × 1086 | `2de74a52aa0bc8df4842ff9ef25c5c35519aaa21818e53f773059e3c0da4149b` |
| `portfolio-style-c.png` | 网站概念 · Style C 柔和未来 | 1448 × 1086 | `68eb639ecc0eb8c7c3c8178827b73ada35248522e560d6479ee04cee138f4bd0` |
| `portfolio-style-d.png` | 网站概念 · Style D 创意手绘 | 1448 × 1086 | `866264293e68d16c7f6eae61338896a7962024389773c5974f6058704e4f8add` |


The three JD posters are existing reviewed local exports: `marketing/images/hero/a4.png` → `jd-overview.png`; `recovery/4x5.png` → `jd-recovery.png`; `security/16x9.png` → `jd-privacy.png`.

Travel/family and watercolor subjects are visual artwork, not a claim about the site owner’s identity or real travel. Website mockups and marketing copy are concepts/presentation material, not evidence of implemented features. Avatars are intentionally excluded.

To add a reviewed image: place its complete file in `public/images/posters`, add its title and actual dimensions to `src/data/projects.ts`, then deliberately select it for public display as described below and run the documented checks.

## Public selection

The gallery shows eight distinct works: `travel-diary`, `food-diary-corgi`, `santorini-illustration`, `watercolor-kites`, `jd-overview`, `jd-recovery`, `jd-privacy` and the historical `portfolio-style-b` concept. Related crops and near duplicates remain as source files, without appearing as additional gallery entries. Multi-image travel and product series use native horizontal rails; the single watercolour and historical concept keep complete, flat presentations.

To change the public selection, update the explicit selection in `PosterGallery.tsx` and its order/count assertions in the smoke, gallery and motion checks; adding a source asset alone does not publish another gallery entry.
