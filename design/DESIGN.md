# 星旅手帖 · Design notes

主页按一本深夜天文手帖来做：墨色底、金色细线、象牙白衬线字，红色只留给名牌与彼岸花。所有面板自带深色背景，所以 GitHub 浅色和深色主题下看起来都是一样的“画廊里挂着的版画”。

## 结构

| 资产 | 来源 | 说明 |
| --- | --- | --- |
| `assets/hero.svg` | `scenes.mjs` | Plate I：半实半虚的月、七色电线杆、四色星座、splash 文字 |
| `assets/dialogue.svg` | `scenes.mjs` | galgame 文本框，SMIL 逐字打出，结束后出现 ▼ |
| `assets/choice-*.svg` | `scenes.mjs` | 选项支，每个都是一个外链 |
| `assets/chapter-*.svg` | `scenes-more.mjs` | 章节页眉 |
| `assets/projects/*.svg` | `scenes-more.mjs` | 作品卡，稀有度用星级表示 |
| `assets/garage.svg` | `scenes-more.mjs` | 工具栈，用性能等级牌表示 |
| `assets/footer.svg` | `scenes-more.mjs` | Now Playing、彼岸花、结语 |
| `assets/trailblaze.svg` | `../scripts/render-dynamic.mjs` | 每天由 CI 根据 GraphQL 数据重绘 |
| `assets/cycles.svg` | `../scripts/render-dynamic.mjs` | 给 Platane/snk 生成的贪吃蛇加框 |

## 字体

Cormorant Garamond、Noto Serif SC、JetBrains Mono、DotGothic16，均为 OFL。构建时把可变字体固定到用到的字重，并且只保留每个字重实际渲染的字符，以 woff2 base64 内嵌进 SVG。这样 `<img>` 里的 SVG 不依赖访客本机字体。CI 卡片用的子集提前放在 `assets/fonts/`，CI 不需要安装任何依赖。

## 重新构建

```bash
cd design
npm install
npm run fonts      # 下载字体与头像到 .cache/
npm run build      # 重写 ../assets 里的静态 SVG 和 CI 字体子集
node preview.mjs   # 用本机 Edge 截图到 preview/
```

改动文字后需要重新 build，因为字体子集只包含用到的字。

## 圈内人才看得懂的部分

写在这里给维护者看，主页本身不做任何解释。

- **原神**：标题上方的拉丁文 *Ad astra abyssosque*，冒险家协会的问候语。头像本身就是纳西妲。
- **Minecraft × 魔女的夜宴**：标题右上角倾斜、黄色、带硬阴影、持续脉动的文字，是 MC 标题画面的 splash；内容是因幡めぐる的 Ciallo～(∠・ω< )⌒★。
- **超かぐや姫！**：右侧的月亮一半是实体，一半是线框，对应虚拟空间「ツクヨミ」；旁边那根泛着七色光的电线杆，是辉夜姬出场的地方。
- **孤独摇滚**：星空里四颗分别为粉、黄、蓝、红的星，连起来就是「星座になれたら」；页脚正在播放这首歌，曲名前是后藤一里那对蓝黄方块发饰，均衡器四根柱子也是四人的颜色。
- **魔女之旅**：文本框的叙述借用伊蕾娜的固定句式，先描写一位旅人再自问自答「没错，就是我」；名牌左侧的星形胸针是魔女的证明。
- **galgame**：文本框、名牌、Q.SAVE / AUTO / SKIP 快捷菜单、▼ 翻页标记，以及把外链做成选项支。
- **名探偵プリキュア！**：雾港档案卡片上的放大镜，镜片里是一颗心，取自「ハートにヒント」与ミラールーペ。
- **崩坏：星穹铁道**：「开拓记录」卡片的开拓等级（上限 70）和均衡等级，章节 II 的车票图标，状态页的选项写成「确认列车运行状态」，页脚的「愿此行，终抵群星」。
- **极限竞速：地平线**：工具栈的等级牌按 D / C / B / A / S1 / S2 分档并配上 PI 数值；右上角是七条音乐节腕带，最后一条是金色。LuomoCore 卡片上是一块会轰油门的转速表。
- **莉可丽丝**：页脚分隔线中央的红色彼岸花，以及右下角轻轻摆动的猫头鹰挂坠（アラン機関）。
- **魔法少女小圆**：章节 III「圆环之理」和它的灵魂宝石图标；页脚左下角的 ／人◕‿‿◕人＼ 在问你要不要签契约。
