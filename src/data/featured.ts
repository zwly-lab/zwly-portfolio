export const featuredPreviews = [
  { title: "JD · 应用界面", src: "/images/projects/jd-dashboard.png", width: 1600, height: 1000, slug: "jd-protocol-engine", alt: "JD 实际任务控制台：应用界面作品" },
  { title: "PyScreen · 交互实验", src: "/images/projects/pyscreen.png", width: 1440, height: 1000, slug: "pyscreen", alt: "PyScreen 实际运行界面：交互实验作品" },
  { title: "旅行日记 · 视觉创作", src: "/images/posters/travel-diary.png", width: 1122, height: 1402, slug: "poster-collection", alt: "旅行日记拼贴原作：视觉创作作品" },
];

export const previewSizes = (index: number) => index === 0 ? "(max-width: 760px) 100vw, 580px" : "(max-width: 760px) 50vw, 380px";
