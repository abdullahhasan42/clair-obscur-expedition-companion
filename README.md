<h1 align="center">Clair Obscur Expedition 33 Companion</h1>

<p align="center">
<a href="https://github.com/abdullahhasan42/clair-obscur-expedition-33-theme"><img src="https://img.shields.io/badge/Get_the-Clair_Obscur_theme-c8963c" alt="Get the theme"></a>
<img src="https://img.shields.io/badge/version-1.0.0-d6283a" alt="Version 1.0.0">
<img src="https://img.shields.io/badge/Obsidian-1.5.8%2B-7c3aed" alt="Obsidian 1.5.8+">
<img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="MIT license">
</p>

<p align="center">The companion for the <a href="https://github.com/abdullahhasan42/clair-obscur-expedition-33-theme">Clair Obscur Expedition 33 theme</a>. Every empty tab becomes a title screen with diamond command tiles after the game's Pictos and skill tree. Saving parries, deleting is the Gommage, and reaching your daily goal is a VICTORY. Three styles: <b>Lumière at night</b>, <b>Gommage</b> and <b>Expedition 33</b>.</p>

<p align="center"><img src="screenshots/showcase.gif" width="100%" alt="Title screens, navigation and the save animations in all three styles"></p>
<p align="center"><sub>Title screens, clicking and keys through the diamonds, "Parry it!" and the rising Gommage petals.</sub></p>

<p align="center">
<a href="#title-screens">Title screens</a> ·
<a href="#menu-layouts">Menu layouts</a> ·
<a href="#saving">Saving</a> ·
<a href="#area-titles-and-dialogue">Area titles</a> ·
<a href="#victory-and-pause">VICTORY and Pause</a> ·
<a href="#commands">Commands</a> ·
<a href="#install">Install</a>
</p>

<h2 align="center" id="title-screens">Title screens</h2>

<p align="center"><img src="screenshots/title-lumiere.jpg" width="100%" alt="Lumière at night title screen"></p>
<p align="center"><sub><b>Lumière at night.</b> Your vault name in brushed gold over the boulevard, six diamond commands, and a line from the game at the foot.</sub></p>

<p align="center"><img src="screenshots/title-gommage.jpg" width="49%" alt="Gommage title screen"> <img src="screenshots/title-expedition.jpg" width="49%" alt="Expedition 33 title screen"></p>
<p align="center"><sub><b>Gommage</b>, your name on a brush stroke &nbsp;·&nbsp; <b>Expedition 33</b>, the emblem dead centre with the diamonds around it</sub></p>

Commands: **Continue** (your last note), **Map** (graph), **Commands** (palette), **Today** (daily note), **Items** (quick switcher), **New page**. Use the mouse, the arrow keys, Home, End, Enter or 1 to 6.

<h2 align="center" id="menu-layouts">Menu layouts</h2>

<p align="center"><img src="screenshots/title-lumiere-arc.jpg" width="49%" alt="Diamonds on an arc"> <img src="screenshots/title-gommage-row.jpg" width="49%" alt="Diamond row with caption"></p>
<p align="center"><sub><b>Diamonds on an arc</b> &nbsp;·&nbsp; <b>Diamond row</b> with one large caption</sub></p>

<p align="center"><img src="screenshots/title-expedition-right.jpg" width="49%" alt="Expedition 33, commands on the right"></p>
<p align="center"><sub><b>Expedition 33</b> with every command on the right of the emblem (or split left and right, the default)</sub></p>

<h2 align="center" id="saving">Saving</h2>

<p align="center"><img src="screenshots/parry-it.jpg" width="49%" alt="Parry it!"> <img src="screenshots/gommage-save.jpg" width="49%" alt="Gommage petals"></p>
<p align="center"><sub><b>Parry it!</b> Two gold glints meet and the words land (Lumière and Expedition) &nbsp;·&nbsp; <b>Gommage</b>, red petals rise from a bottom corner across the page</sub></p>

The classic "Parry" ring stays available under **Save effect** in Style Settings. The first save of a vault gets Maelle's "Parry it!"; three quick saves get "Parry it! (No, not Harriet.)".

<h2 align="center" id="area-titles-and-dialogue">Area titles and dialogue</h2>

<p align="center"><img src="screenshots/area-title.jpg" width="49%" alt="Area title"> <img src="screenshots/dialogue.jpg" width="49%" alt="Dialogue"></p>
<p align="center"><sub><b>Area title</b> at the bottom left when a note opens, with its first open task &nbsp;·&nbsp; <b>Dialogue</b> lines from the cast</sub></p>

<h2 align="center" id="victory-and-pause">VICTORY and Pause</h2>

<p align="center"><img src="screenshots/victory.jpg" width="49%" alt="VICTORY"> <img src="screenshots/pause.jpg" width="49%" alt="Pause and the expedition journal"></p>
<p align="center"><sub><b>VICTORY</b> when today's word goal is reached &nbsp;·&nbsp; <b>Pause</b> with the expedition journal</sub></p>

<p align="center"><img src="screenshots/hud.jpg" width="60%" alt="Party plate HUD"></p>
<p align="center"><sub><b>Party plate HUD</b>: today's words against your goal, in the status bar</sub></p>

Also: **Dodge** on undo, **EXPEDITION FAILED** when a streak breaks, and the **Gommage** in petals when a note is deleted. Every effect has a switch and respects reduced motion.

<h2 align="center" id="commands">Commands</h2>

| Command | What it does |
| --- | --- |
| Save (parry it) | Saves the note with the style's save effect |
| Return to the title screen | Opens the title screen |
| Switch world | Cycles the three styles |
| Pause | Opens the pause screen |
| Show the area title | Shows the current note's area title |
| Open the expedition journal | Opens the journal |

<h2 align="center" id="settings">Settings</h2>

With the theme and **Style Settings**: world, texture, menu layout, Expedition placement, quote mode, save effect, painting behind notes, and a switch for every effect.

In **Settings → Clair Obscur Expedition 33 Companion**: title text (empty = your vault name), daily word goal, and the menu entries.

<h2 align="center" id="install">Install</h2>

- **Community plugins:** search **Clair Obscur Expedition 33 Companion**, install, enable.
- **BRAT (beta):** install BRAT, run **BRAT: Add a beta plugin**, enter `abdullahhasan42/clair-obscur-expedition-33-plugin`, then enable it.
- **Manual:** download `main.js`, `manifest.json` and `styles.css` from the latest release into `<vault>/.obsidian/plugins/clair-obscur-expedition-33-companion/`.

Everything lives in `main.js` and `styles.css`; the art is embedded. Static art, about 0 % GPU on the title screens, about 1 % while the Gommage petals move.

<h2 align="center" id="license">License</h2>

MIT (see `LICENSE`). The plugin embeds Cormorant SC and Cormorant Garamond in `styles.css`, so it keeps its look under any theme; they are under the SIL Open Font License (`fonts/OFL-Cormorant.txt`).

> Unofficial fan project, made out of love for Clair Obscur: Expedition 33. Not affiliated with or endorsed by Sandfall Interactive or Kepler Interactive. No game art, logos or fonts are included; every image is an original render or drawing. Quoted lines are short excerpts used for commentary.
