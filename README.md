# 视频理解 · 个人网站

这是一个定制静态网站，沿用学术主页“内容与页面分开”的组织方式。没有使用 al-folio 的 Jekyll 运行时；第一版优先实现已确认的内容结构、视觉与文字维护方式，不需要安装 Ruby 或前端依赖。

## 主要页面

首页、研究与论文、项目与视频演示、教育/科研/实习经历、学术 CV 与求职简历、写作与文章详情。

个人信息尚未提供，因此所有占位项目和文章均标明“内容模板”或“写作示例”。未添加虚构论文、机构、实习或成绩。

## 日常更新

- `content/profile.json`：姓名、简介、学校/实验室、邮箱、GitHub 和 Google Scholar。确认真实内容后将 `isDraft` 改为 `false`。
- `content/research.md`：研究介绍，像写文档一样修改。
- `content/projects/*.md`：每个项目一个 Markdown 文件。顶部填写标题、分类和标签，下面写问题、贡献和结果。修改分类可用 `research` 或 `engineering`。
- `content/publications.json`：论文列表，默认为空。
- `content/experience.json`：教育、科研、实习和奖项经历，默认为空。
- `content/cv.json`：简历摘要、技能和代表项目。两版简历自动共用个人信息与经历，避免重复修改。
- `content/articles/*.md`：每篇文章一个 Markdown 文件。
- `assets/`：图片、视频或已制作的简历 PDF。

首页视频可在 `profile.json` 的 `demoVideo` / `demoPoster` 更新；替换为个人素材后，将 `demoIsExample` 改为 `false`。项目 Markdown 顶部还支持 `period`、`role`、`code`、`paper`、`video`、`poster`，用来展示时间、角色、链接与项目视频，无需修改页面代码。

Markdown 支持段落、一至三级标题、列表、加粗、行内代码及安全链接。第一版不包含复杂 Markdown 扩展、公式编译或 Jupyter 自动导入。

更新内容后运行：

```powershell
node scripts/build.mjs
```

生成的 `dist/` 可以部署到支持静态网站的平台。无需 npm 安装。请在本聊天中告诉 Codex 修改和发布要求；在线页面当前不包含后台内容编辑器。

## 论文条目格式

```json
[
  {
    "title": "真实论文题目",
    "authors": "作者列表",
    "year": "2026",
    "venue": "真实会议或期刊，或 Preprint",
    "url": "https://...",
    "pdf": "https://...",
    "code": "https://...",
    "project": "/projects/项目文件名/",
    "bibtex": "可选的 BibTeX 原文"
  }
]
```

## 经历条目格式

`education`、`research`、`industry`、`awards` 均接受以下条目：

```json
{
  "period": "实际起止年月",
  "title": "真实职位或学位",
  "organization": "真实机构名称",
  "description": "真实经历简介",
  "highlights": ["个人贡献", "可核实成果"]
}
```

## 简历与视频

简历页面可以切换两版，并通过浏览器打印对话框保存为 PDF。如果已有正式 PDF，可以放入 `assets/`，在 `cv.json` 的 `academicPdf` / `industryPdf` 填写 `/assets/文件名.pdf`。

示例视频来自 MDN 的 `cc0-videos/flower.mp4`，仅演示播放器与时间轴，非个人研究成果或模型输出。素材源：https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4。

## 首次上线前的内容检查

填写真实姓名与联系方式；替换三个项目模板和写作示例；填入可核实的经历与论文；使用你有权展示的视频和图片。未准备好的栏目可以保持为空。

## GitHub Pages 发布

这个目录是 GitHub Pages 迁移版，保留原有页面设计与内容结构。

1. 在 [GitHub 新建仓库页面](https://github.com/new)选择所有者 `Dreamerposter`，创建公开仓库 `Dreamerposter.github.io`，并勾选 Add README 初始化仓库。
2. 将这个目录中的源文件上传到仓库的 `main` 分支，包括 `.github/workflows/pages.yml`。
3. 在仓库 Settings → Pages 中，将 Source 选择为 GitHub Actions。
4. Actions 中的“Publish personal website”完成后，使用 Pages 显示的实际网址访问。本账号的预期个人主页地址是 `https://dreamerposter.github.io/`；完成远程发布并验证后，该网址才可用。

GitHub Free 支持公开仓库的 Pages。默认公开主页的访客不需要登录 GitHub 或 ChatGPT。

此版支持个人主页的根路径，也支持项目仓库的子路径。工作流会自动传入 Pages 的路径，所以导航、图片、视频与简历 PDF 能使用同一套内容文件。

### 以后怎么更新

在 GitHub 中打开 `content/` 下对应的文件，点击编辑，改文字并提交到 `main`。工作流会自动构建、检查链接和发布。你也可以继续在本聊天中让我处理更新。

构建输出 `dist/` 不需要提交，也不需要手动改 HTML。首次发布仍需要你登录或连接 GitHub，并对目标仓库具有管理权限。

### 本地检查

```powershell
node scripts/build.mjs
node scripts/check.mjs
```

如果发布到项目子路径，可以设置 `BASE_PATH=/仓库名` 后执行相同命令。工作流已经处理这项配置。

官方说明：[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[自动发布工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
