"use strict";

/*
 * World companion engine (obsidian-theme-forge assets/world-engine).
 * The variant file at the end of this bundle defines VARIANT and calls makePlugin(VARIANT).
 * Prefixes co- (theme classes, tokens) and cop- (plugin) are renamed per world at build time.
 * Icons are original drawings.
 */

const { ItemView, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, debounce } = require("obsidian");

const ICONS = {
	"ui/bar": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 12 200\" preserveAspectRatio=\"none\"><path fill=\"black\" d=\"M6.0 0.0 L5.1 4.0 L4.9 8.0 L4.8 12.0 L4.7 16.0 L4.6 20.0 L4.6 24.0 L4.5 28.0 L4.4 32.0 L4.3 36.0 L4.2 40.0 L4.1 44.0 L3.9 48.0 L3.8 52.0 L3.6 56.0 L3.4 60.0 L3.2 64.0 L3.0 68.0 L2.8 72.0 L2.7 76.0 L2.5 80.0 L2.4 84.0 L2.2 88.0 L2.1 92.0 L2.1 96.0 L2.0 100.0 L2.0 104.0 L2.0 108.0 L2.1 112.0 L2.1 116.0 L2.2 120.0 L2.4 124.0 L2.5 128.0 L2.7 132.0 L2.9 136.0 L3.1 140.0 L3.3 144.0 L3.5 148.0 L3.7 152.0 L3.9 156.0 L4.0 160.0 L4.2 164.0 L4.4 168.0 L4.5 172.0 L4.7 176.0 L4.8 180.0 L4.9 184.0 L5.0 188.0 L5.2 192.0 L5.4 196.0 L6.3 200.0 L5.7 200.1 L6.6 195.1 L6.8 192.2 L7.0 187.6 L7.1 184.2 L7.2 179.7 L7.3 175.6 L7.5 171.6 L7.6 167.7 L7.8 164.6 L8.0 159.4 L8.1 155.3 L8.3 152.4 L8.5 148.9 L8.7 143.4 L8.9 139.7 L9.1 135.9 L9.3 131.2 L9.5 129.0 L9.6 123.5 L9.8 120.3 L9.9 116.5 L9.9 112.1 L10.0 107.0 L10.0 103.1 L10.0 99.5 L9.9 95.5 L9.9 91.7 L9.8 88.0 L9.6 83.9 L9.5 80.8 L9.3 75.6 L9.2 71.8 L9.0 67.1 L8.8 64.4 L8.6 59.1 L8.4 56.8 L8.2 52.6 L8.1 47.2 L7.9 43.6 L7.8 39.7 L7.7 36.3 L7.6 31.7 L7.5 28.7 L7.4 24.2 L7.4 20.3 L7.3 16.6 L7.2 11.6 L7.1 8.1 L6.9 3.6 L6.0 -0.9 Z\"/></svg>",
	"ui/broken": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M20.5 3.5 L15 9 M12.5 11.5 L11 13 M9.5 12.5 L11.5 14.5 M13.6 8.4 L14.6 10.4 L12.6 10.6\"/><path fill=\"currentColor\" d=\"M8.6 13.4 C10.2 14 10.8 15.6 10 17.2 C8.8 19.6 5.6 20.6 2.5 20.8 C4 19.6 4.2 18.4 4.4 17 C4.7 14.8 6.6 12.8 8.6 13.4 Z\"/></svg>",
	"ui/brush-frame": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 200\" preserveAspectRatio=\"none\"><path fill=\"black\" d=\"M0.0 2.9 L6.0 3.2 L12.0 4.1 L18.0 1.4 L24.0 3.3 L30.0 4.5 L36.0 4.5 L42.0 0.9 L48.0 3.3 L54.0 3.1 L60.0 2.5 L66.0 4.8 L72.0 2.6 L78.0 2.2 L84.0 4.7 L90.0 3.2 L96.0 1.5 L102.0 1.5 L108.0 2.5 L114.0 0.3 L120.0 3.0 L126.0 3.7 L132.0 2.1 L138.0 4.2 L144.0 4.6 L150.0 2.8 L156.0 3.4 L162.0 0.6 L168.0 0.3 L174.0 4.9 L180.0 1.4 L186.0 1.1 L192.0 4.5 L198.0 3.7 L204.0 0.6 L210.0 1.6 L216.0 1.2 L222.0 1.4 L228.0 0.0 L234.0 2.6 L240.0 1.5 L246.0 2.0 L252.0 0.9 L258.0 0.6 L264.0 0.2 L270.0 4.4 L276.0 3.7 L282.0 2.8 L288.0 0.6 L294.0 0.7 L300.0 0.6 L306.0 1.6 L312.0 0.3 L318.0 1.4 L324.0 1.0 L330.0 1.0 L336.0 3.3 L342.0 2.3 L348.0 2.4 L354.0 1.8 L360.0 2.7 L366.0 3.9 L372.0 1.5 L378.0 0.4 L384.0 2.4 L390.0 1.9 L396.0 3.9 L399.4 0.0 L395.6 6.0 L399.9 12.0 L397.3 18.0 L397.8 24.0 L398.4 30.0 L395.6 36.0 L396.5 42.0 L399.2 48.0 L397.5 54.0 L396.9 60.0 L399.8 66.0 L399.6 72.0 L397.0 78.0 L396.4 84.0 L397.7 90.0 L397.9 96.0 L397.5 102.0 L398.7 108.0 L395.6 114.0 L395.2 120.0 L397.6 126.0 L399.9 132.0 L398.0 138.0 L396.0 144.0 L398.4 150.0 L399.5 156.0 L399.1 162.0 L396.4 168.0 L396.9 174.0 L398.6 180.0 L396.9 186.0 L396.2 192.0 L395.2 198.0 L400.0 195.8 L394.0 197.8 L388.0 196.0 L382.0 195.4 L376.0 195.7 L370.0 196.2 L364.0 197.1 L358.0 197.4 L352.0 195.7 L346.0 196.9 L340.0 196.4 L334.0 198.9 L328.0 199.5 L322.0 198.6 L316.0 197.1 L310.0 197.1 L304.0 199.0 L298.0 199.1 L292.0 195.2 L286.0 199.6 L280.0 195.4 L274.0 196.1 L268.0 197.1 L262.0 195.0 L256.0 196.6 L250.0 200.0 L244.0 195.3 L238.0 197.9 L232.0 195.4 L226.0 195.9 L220.0 199.3 L214.0 199.8 L208.0 199.9 L202.0 196.1 L196.0 196.0 L190.0 198.9 L184.0 199.4 L178.0 198.2 L172.0 196.0 L166.0 196.3 L160.0 195.7 L154.0 195.2 L148.0 196.2 L142.0 195.8 L136.0 199.9 L130.0 200.0 L124.0 195.7 L118.0 196.9 L112.0 198.4 L106.0 199.4 L100.0 198.3 L94.0 198.3 L88.0 197.5 L82.0 197.8 L76.0 199.0 L70.0 199.6 L64.0 199.0 L58.0 199.4 L52.0 199.5 L46.0 197.9 L40.0 199.3 L34.0 196.0 L28.0 197.3 L22.0 197.7 L16.0 196.8 L10.0 198.8 L4.0 199.9 L0.4 200.0 L1.7 194.0 L1.8 188.0 L1.3 182.0 L1.5 176.0 L4.2 170.0 L0.0 164.0 L2.2 158.0 L1.9 152.0 L1.4 146.0 L3.6 140.0 L1.1 134.0 L0.2 128.0 L0.8 122.0 L4.9 116.0 L1.7 110.0 L0.6 104.0 L4.9 98.0 L3.2 92.0 L4.8 86.0 L1.7 80.0 L4.0 74.0 L0.2 68.0 L1.2 62.0 L4.0 56.0 L2.6 50.0 L3.9 44.0 L1.9 38.0 L4.4 32.0 L0.4 26.0 L3.1 20.0 L0.9 14.0 L1.0 8.0 L4.4 2.0 Z\"/></svg>",
	"ui/brush": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M20.5 3.5 L11 13 M9.5 12.5 L11.5 14.5\"/><path fill=\"currentColor\" d=\"M8.6 13.4 C10.2 14 10.8 15.6 10 17.2 C8.8 19.6 5.6 20.6 2.5 20.8 C4 19.6 4.2 18.4 4.4 17 C4.7 14.8 6.6 12.8 8.6 13.4 Z\"/></svg>",
	"ui/compass": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><circle fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" cx=\"12\" cy=\"12\" r=\"9.5\"/><path fill=\"currentColor\" d=\"M12 4.5 L14 12 L12 19.5 L10 12 Z\"/><circle fill=\"currentColor\" cx=\"12\" cy=\"12\" r=\"1.2\"/></svg>",
	"ui/dab": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M22.1 12.0 L22.5 14.1 L20.2 15.4 L19.1 16.9 L17.3 17.7 L16.0 19.2 L14.1 19.8 L12.0 19.2 L10.0 19.5 L7.4 20.1 L6.9 17.5 L5.5 16.4 L4.4 15.1 L1.9 14.0 L3.6 12.0 L2.0 10.0 L2.5 8.1 L3.9 6.4 L5.7 5.2 L8.5 5.8 L10.0 4.5 L12.0 3.2 L13.8 5.1 L16.1 4.7 L18.5 5.0 L20.3 6.3 L19.7 8.8 L19.6 10.5 Z\"/></svg>",
	"ui/diamond": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12 4 L17.5 12 L12 20 L6.5 12 Z\"/></svg>",
	"ui/dot": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><circle fill=\"currentColor\" cx=\"12\" cy=\"12\" r=\"4.5\"/></svg>",
	"ui/emblem": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 400\"> <defs> <radialGradient id=\"halo\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#ffcf7a\" stop-opacity=\".42\"/><stop offset=\".45\" stop-color=\"#e8a848\" stop-opacity=\".16\"/><stop offset=\"1\" stop-color=\"#e8a848\" stop-opacity=\"0\"/></radialGradient> <radialGradient id=\"disc\" cx=\"50%\" cy=\"46%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#3a2a14\" stop-opacity=\".55\"/><stop offset=\"1\" stop-color=\"#0a0806\" stop-opacity=\".2\"/></radialGradient> <linearGradient id=\"gold\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fff7de\"/><stop offset=\".34\" stop-color=\"#f2cd7a\"/><stop offset=\".52\" stop-color=\"#9c6a26\"/><stop offset=\".66\" stop-color=\"#f7dda2\"/><stop offset=\"1\" stop-color=\"#c38f3e\"/></linearGradient> <linearGradient id=\"ring\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fff0c8\"/><stop offset=\".5\" stop-color=\"#c8963c\"/><stop offset=\"1\" stop-color=\"#f6d896\"/></linearGradient> <filter id=\"glow\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"5\" result=\"b\"/><feMerge><feMergeNode in=\"b\"/><feMergeNode in=\"SourceGraphic\"/></feMerge></filter> </defs> <circle cx=\"200\" cy=\"200\" r=\"200\" fill=\"url(#halo)\"/> <g stroke=\"#f0c878\" stroke-width=\".8\" stroke-linecap=\"round\" opacity=\".38\"><path d=\"M356.00 200.00 L396.00 200.00\"/><path d=\"M355.25 215.29 L377.14 217.45\"/><path d=\"M353.00 230.43 L392.23 238.24\"/><path d=\"M349.28 245.28 L370.34 251.67\"/><path d=\"M344.13 259.70 L381.08 275.01\"/><path d=\"M337.58 273.54 L356.98 283.91\"/><path d=\"M329.71 286.67 L362.97 308.89\"/><path d=\"M320.59 298.97 L337.60 312.92\"/><path d=\"M310.31 310.31 L338.59 338.59\"/><path d=\"M298.97 320.59 L312.92 337.60\"/><path d=\"M286.67 329.71 L308.89 362.97\"/><path d=\"M273.54 337.58 L283.91 356.98\"/><path d=\"M259.70 344.13 L275.01 381.08\"/><path d=\"M245.28 349.28 L251.67 370.34\"/><path d=\"M230.43 353.00 L238.24 392.23\"/><path d=\"M215.29 355.25 L217.45 377.14\"/><path d=\"M200.00 356.00 L200.00 396.00\"/><path d=\"M184.71 355.25 L182.55 377.14\"/><path d=\"M169.57 353.00 L161.76 392.23\"/><path d=\"M154.72 349.28 L148.33 370.34\"/><path d=\"M140.30 344.13 L124.99 381.08\"/><path d=\"M126.46 337.58 L116.09 356.98\"/><path d=\"M113.33 329.71 L91.11 362.97\"/><path d=\"M101.03 320.59 L87.08 337.60\"/><path d=\"M89.69 310.31 L61.41 338.59\"/><path d=\"M79.41 298.97 L62.40 312.92\"/><path d=\"M70.29 286.67 L37.03 308.89\"/><path d=\"M62.42 273.54 L43.02 283.91\"/><path d=\"M55.87 259.70 L18.92 275.01\"/><path d=\"M50.72 245.28 L29.66 251.67\"/><path d=\"M47.00 230.43 L7.77 238.24\"/><path d=\"M44.75 215.29 L22.86 217.45\"/><path d=\"M44.00 200.00 L4.00 200.00\"/><path d=\"M44.75 184.71 L22.86 182.55\"/><path d=\"M47.00 169.57 L7.77 161.76\"/><path d=\"M50.72 154.72 L29.66 148.33\"/><path d=\"M55.87 140.30 L18.92 124.99\"/><path d=\"M62.42 126.46 L43.02 116.09\"/><path d=\"M70.29 113.33 L37.03 91.11\"/><path d=\"M79.41 101.03 L62.40 87.08\"/><path d=\"M89.69 89.69 L61.41 61.41\"/><path d=\"M101.03 79.41 L87.08 62.40\"/><path d=\"M113.33 70.29 L91.11 37.03\"/><path d=\"M126.46 62.42 L116.09 43.02\"/><path d=\"M140.30 55.87 L124.99 18.92\"/><path d=\"M154.72 50.72 L148.33 29.66\"/><path d=\"M169.57 47.00 L161.76 7.77\"/><path d=\"M184.71 44.75 L182.55 22.86\"/><path d=\"M200.00 44.00 L200.00 4.00\"/><path d=\"M215.29 44.75 L217.45 22.86\"/><path d=\"M230.43 47.00 L238.24 7.77\"/><path d=\"M245.28 50.72 L251.67 29.66\"/><path d=\"M259.70 55.87 L275.01 18.92\"/><path d=\"M273.54 62.42 L283.91 43.02\"/><path d=\"M286.67 70.29 L308.89 37.03\"/><path d=\"M298.97 79.41 L312.92 62.40\"/><path d=\"M310.31 89.69 L338.59 61.41\"/><path d=\"M320.59 101.03 L337.60 87.08\"/><path d=\"M329.71 113.33 L362.97 91.11\"/><path d=\"M337.58 126.46 L356.98 116.09\"/><path d=\"M344.13 140.30 L381.08 124.99\"/><path d=\"M349.28 154.72 L370.34 148.33\"/><path d=\"M353.00 169.57 L392.23 161.76\"/><path d=\"M355.25 184.71 L377.14 182.55\"/></g> <circle cx=\"200\" cy=\"200\" r=\"132\" fill=\"url(#disc)\"/> <g fill=\"none\" stroke=\"url(#ring)\"> <circle cx=\"200\" cy=\"200\" r=\"150\" stroke-width=\"2.4\"/> <circle cx=\"200\" cy=\"200\" r=\"132\" stroke-width=\".9\" opacity=\".8\"/> <circle cx=\"200\" cy=\"200\" r=\"158\" stroke-width=\".6\" opacity=\".55\"/> </g> <g stroke=\"#f0c878\" stroke-width=\".7\" opacity=\".75\"><path d=\"M336.00 200.00 L346.00 200.00\"/><path d=\"M335.48 211.85 L342.46 212.46\"/><path d=\"M333.93 223.62 L340.83 224.83\"/><path d=\"M331.37 235.20 L338.13 237.01\"/><path d=\"M327.80 246.51 L334.38 248.91\"/><path d=\"M323.26 257.48 L329.60 260.43\"/><path d=\"M317.78 268.00 L326.44 273.00\"/><path d=\"M311.40 278.01 L317.14 282.02\"/><path d=\"M304.18 287.42 L309.54 291.92\"/><path d=\"M296.17 296.17 L301.12 301.12\"/><path d=\"M287.42 304.18 L291.92 309.54\"/><path d=\"M278.01 311.40 L282.02 317.14\"/><path d=\"M268.00 317.78 L273.00 326.44\"/><path d=\"M257.48 323.26 L260.43 329.60\"/><path d=\"M246.51 327.80 L248.91 334.38\"/><path d=\"M235.20 331.37 L237.01 338.13\"/><path d=\"M223.62 333.93 L224.83 340.83\"/><path d=\"M211.85 335.48 L212.46 342.46\"/><path d=\"M200.00 336.00 L200.00 346.00\"/><path d=\"M188.15 335.48 L187.54 342.46\"/><path d=\"M176.38 333.93 L175.17 340.83\"/><path d=\"M164.80 331.37 L162.99 338.13\"/><path d=\"M153.49 327.80 L151.09 334.38\"/><path d=\"M142.52 323.26 L139.57 329.60\"/><path d=\"M132.00 317.78 L127.00 326.44\"/><path d=\"M121.99 311.40 L117.98 317.14\"/><path d=\"M112.58 304.18 L108.08 309.54\"/><path d=\"M103.83 296.17 L98.88 301.12\"/><path d=\"M95.82 287.42 L90.46 291.92\"/><path d=\"M88.60 278.01 L82.86 282.02\"/><path d=\"M82.22 268.00 L73.56 273.00\"/><path d=\"M76.74 257.48 L70.40 260.43\"/><path d=\"M72.20 246.51 L65.62 248.91\"/><path d=\"M68.63 235.20 L61.87 237.01\"/><path d=\"M66.07 223.62 L59.17 224.83\"/><path d=\"M64.52 211.85 L57.54 212.46\"/><path d=\"M64.00 200.00 L54.00 200.00\"/><path d=\"M64.52 188.15 L57.54 187.54\"/><path d=\"M66.07 176.38 L59.17 175.17\"/><path d=\"M68.63 164.80 L61.87 162.99\"/><path d=\"M72.20 153.49 L65.62 151.09\"/><path d=\"M76.74 142.52 L70.40 139.57\"/><path d=\"M82.22 132.00 L73.56 127.00\"/><path d=\"M88.60 121.99 L82.86 117.98\"/><path d=\"M95.82 112.58 L90.46 108.08\"/><path d=\"M103.83 103.83 L98.88 98.88\"/><path d=\"M112.58 95.82 L108.08 90.46\"/><path d=\"M121.99 88.60 L117.98 82.86\"/><path d=\"M132.00 82.22 L127.00 73.56\"/><path d=\"M142.52 76.74 L139.57 70.40\"/><path d=\"M153.49 72.20 L151.09 65.62\"/><path d=\"M164.80 68.63 L162.99 61.87\"/><path d=\"M176.38 66.07 L175.17 59.17\"/><path d=\"M188.15 64.52 L187.54 57.54\"/><path d=\"M200.00 64.00 L200.00 54.00\"/><path d=\"M211.85 64.52 L212.46 57.54\"/><path d=\"M223.62 66.07 L224.83 59.17\"/><path d=\"M235.20 68.63 L237.01 61.87\"/><path d=\"M246.51 72.20 L248.91 65.62\"/><path d=\"M257.48 76.74 L260.43 70.40\"/><path d=\"M268.00 82.22 L273.00 73.56\"/><path d=\"M278.01 88.60 L282.02 82.86\"/><path d=\"M287.42 95.82 L291.92 90.46\"/><path d=\"M296.17 103.83 L301.12 98.88\"/><path d=\"M304.18 112.58 L309.54 108.08\"/><path d=\"M311.40 121.99 L317.14 117.98\"/><path d=\"M317.78 132.00 L326.44 127.00\"/><path d=\"M323.26 142.52 L329.60 139.57\"/><path d=\"M327.80 153.49 L334.38 151.09\"/><path d=\"M331.37 164.80 L338.13 162.99\"/><path d=\"M333.93 176.38 L340.83 175.17\"/><path d=\"M335.48 188.15 L342.46 187.54\"/></g> <g fill=\"url(#ring)\"><path d=\"M200.00 42.00 L205.60 50.00 L200.00 58.00 L194.40 50.00 Z\"/><path d=\"M306.07 89.43 L309.22 93.93 L306.07 98.43 L302.92 93.93 Z\"/><path d=\"M350.00 192.00 L355.60 200.00 L350.00 208.00 L344.40 200.00 Z\"/><path d=\"M306.07 301.57 L309.22 306.07 L306.07 310.57 L302.92 306.07 Z\"/><path d=\"M200.00 342.00 L205.60 350.00 L200.00 358.00 L194.40 350.00 Z\"/><path d=\"M93.93 301.57 L97.08 306.07 L93.93 310.57 L90.78 306.07 Z\"/><path d=\"M50.00 192.00 L55.60 200.00 L50.00 208.00 L44.40 200.00 Z\"/><path d=\"M93.93 89.43 L97.08 93.93 L93.93 98.43 L90.78 93.93 Z\"/></g> <path d=\"M161.10662251655629 158.60927152317882Q161.10662251655629 147.4834437086093 155.65960264900662 140.52980132450332Q150.21258278145697 133.57615894039736 139.55033112582782 133.57615894039736Q127.72913907284769 133.57615894039736 120.31192052980133 139.95033112582783Q112.89470198675497 146.3245033112583 108.7225165562914 160.9271523178808Q108.7225165562914 161.3907284768212 107.5635761589404 161.3907284768212Q106.8682119205298 161.3907284768212 106.28874172185431 161.0430463576159Q105.70927152317881 160.6953642384106 105.941059602649 160.46357615894038L114.98079470198677 125.2317880794702Q114.98079470198677 125.0 115.90794701986755 125.0Q118.22582781456954 125.0 117.76225165562914 125.6953642384106L117.29867549668874 128.47682119205297Q117.29867549668874 130.79470198675497 118.45761589403975 131.83774834437088Q119.61655629139074 132.88079470198676 121.23907284768212 132.88079470198676Q122.86158940397351 132.88079470198676 125.5271523178808 132.06953642384107Q128.1927152317881 131.25827814569539 129.11986754966887 131.02649006622516Q139.55033112582782 127.08609271523179 149.05364238410596 127.08609271523179Q162.96092715231788 127.08609271523179 172.69602649006623 134.15562913907286Q182.43112582781458 141.2251655629139 182.43112582781458 152.58278145695365Q182.43112582781458 162.5496688741722 173.97086092715233 171.82119205298014Q165.51059602649008 181.09271523178808 148.35827814569538 190.82781456953643L144.417880794702 189.66887417218544Q153.92119205298013 181.09271523178808 157.5139072847682 174.25496688741723Q161.10662251655629 167.41721854304637 161.10662251655629 158.60927152317882ZM166.43774834437087 221.42384105960267Q166.43774834437087 210.0662251655629 159.9476821192053 201.83774834437088Q153.45761589403975 193.60927152317882 141.40463576158942 193.60927152317882Q133.75562913907285 193.60927152317882 127.9609271523179 195.9271523178808L127.4973509933775 196.158940397351Q126.5701986754967 196.158940397351 126.1066225165563 195.2317880794702Q125.6430463576159 194.3046357615894 126.3384105960265 193.841059602649Q130.27880794701989 191.2913907284768 137.23245033112585 189.55298013245033Q144.18609271523178 187.81456953642385 152.06688741721854 187.81456953642385Q169.21920529801326 187.81456953642385 179.1860927152318 196.73841059602648Q189.15298013245035 205.66225165562915 189.15298013245035 218.87417218543047Q189.15298013245035 236.02649006622516 169.45099337748346 251.2086092715232Q149.74900662251656 266.3907284768212 111.50397350993379 274.9668874172186Q110.57682119205299 275.19867549668874 110.22913907284769 273.8079470198676Q109.88145695364238 272.4172185430464 110.57682119205299 272.18543046357615Q140.7092715231788 264.76821192052984 153.57350993377486 250.8609271523179Q166.43774834437087 236.95364238410596 166.43774834437087 221.42384105960267ZM266.07880794701987 158.60927152317882Q266.07880794701987 147.4834437086093 260.6317880794702 140.52980132450332Q255.18476821192056 133.57615894039736 244.5225165562914 133.57615894039736Q232.7013245033113 133.57615894039736 225.28410596026492 139.95033112582783Q217.86688741721858 146.3245033112583 213.69470198675498 160.9271523178808Q213.69470198675498 161.3907284768212 212.535761589404 161.3907284768212Q211.8403973509934 161.3907284768212 211.2609271523179 161.0430463576159Q210.6814569536424 160.6953642384106 210.91324503311262 160.46357615894038L219.95298013245036 125.2317880794702Q219.95298013245036 125.0 220.88013245033116 125.0Q223.19801324503314 125.0 222.73443708609275 125.6953642384106L222.27086092715234 128.47682119205297Q222.27086092715234 130.79470198675497 223.42980132450333 131.83774834437088Q224.58874172185432 132.88079470198676 226.21125827814572 132.88079470198676Q227.83377483443712 132.88079470198676 230.4993377483444 132.06953642384107Q233.16490066225168 131.25827814569539 234.09205298013248 131.02649006622516Q244.5225165562914 127.08609271523179 254.02582781456957 127.08609271523179Q267.9331125827815 127.08609271523179 277.66821192052987 134.15562913907286Q287.40331125827817 141.2251655629139 287.40331125827817 152.58278145695365Q287.40331125827817 162.5496688741722 278.9430463576159 171.82119205298014Q270.48278145695366 181.09271523178808 253.33046357615896 190.82781456953643L249.39006622516558 189.66887417218544Q258.8933774834437 181.09271523178808 262.4860927152318 174.25496688741723Q266.07880794701987 167.41721854304637 266.07880794701987 158.60927152317882ZM271.4099337748345 221.42384105960267Q271.4099337748345 210.0662251655629 264.9198675496689 201.83774834437088Q258.42980132450333 193.60927152317882 246.376821192053 193.60927152317882Q238.72781456953646 193.60927152317882 232.9331125827815 195.9271523178808L232.46953642384108 196.158940397351Q231.54238410596028 196.158940397351 231.07880794701987 195.2317880794702Q230.61523178807948 194.3046357615894 231.3105960264901 193.841059602649Q235.25099337748347 191.2913907284768 242.20463576158943 189.55298013245033Q249.1582781456954 187.81456953642385 257.0390728476822 187.81456953642385Q274.19139072847685 187.81456953642385 284.15827814569536 196.73841059602648Q294.12516556291393 205.66225165562915 294.12516556291393 218.87417218543047Q294.12516556291393 236.02649006622516 274.42317880794707 251.2086092715232Q254.72119205298017 266.3907284768212 216.47615894039737 274.9668874172186Q215.54900662251657 275.19867549668874 215.2013245033113 273.8079470198676Q214.853642384106 272.4172185430464 215.54900662251657 272.18543046357615Q245.6814569536424 264.76821192052984 258.54569536423844 250.8609271523179Q271.4099337748345 236.95364238410596 271.4099337748345 221.42384105960267Z\" fill=\"url(#gold)\" stroke=\"#fff4d6\" stroke-width=\".7\" stroke-opacity=\".55\" filter=\"url(#glow)\"/> </svg>",
	"ui/flag": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M5 22 V2.5\"/><path fill=\"currentColor\" d=\"M5.6 3 C9 1.6 12 5.2 15.5 3.6 C17 3 18.4 3.2 19.5 3.8 V12.2 C18.4 11.6 17 11.4 15.5 12 C12 13.6 9 10 5.6 11.4 Z\"/></svg>",
	"ui/flower": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><circle fill=\"currentColor\" cx=\"12\" cy=\"9\" r=\"2\"/><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 7 C10 3 14 3 12 7 Z M14 9 C18 7 18 11 14 9 Z M10 9 C6 7 6 11 10 9 Z M13.2 10.6 C15.5 14 12 14.5 12 11 M10.8 10.6 C8.5 14 12 14.5 12 11 M12 11 V22 M12 17 C14 15.5 16 16 17 17\"/></svg>",
	"ui/folder": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M3 19.5 V6.5 C3 5.7 3.7 5 4.5 5 H9.5 L11.5 7 H19.5 C20.3 7 21 7.7 21 8.5 V19.5 Z M3 10 H21\"/></svg>",
	"ui/list": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M3 4.5 L5.4 7 L3 9.5 L0.6 7 Z M3 14.5 L5.4 17 L3 19.5 L0.6 17 Z\"/><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 7 H21 M9 17 H21 M9 12 H17\"/></svg>",
	"ui/mask": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M3 6 C7 4.5 17 4.5 21 6 C21 12 18 18.5 12 19.5 C6 18.5 3 12 3 6 Z\"/><path fill=\"currentColor\" d=\"M6.5 10 C7.5 8.8 9.6 8.8 10.5 10.2 C9.4 11.4 7.6 11.4 6.5 10 Z M17.5 10 C16.5 8.8 14.4 8.8 13.5 10.2 C14.6 11.4 16.4 11.4 17.5 10 Z\"/></svg>",
	"ui/monolith": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M9 2 L15.5 3 L16.5 20 H7.5 Z\"/><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M3 21.5 H21\"/></svg>",
	"ui/ornament": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 120\" width=\"240\" height=\"240\"><g fill=\"none\" stroke=\"#d8b060\" stroke-width=\".5\" stroke-linecap=\"round\" opacity=\".2\"><path d=\"M18.00 0.00 A18 18 0 0 1 0.00 18.00\" /><path d=\"M26.00 0.00 A26 26 0 0 1 0.00 26.00\" /><path d=\"M34.00 0.00 A34 34 0 0 1 0.00 34.00\" /><path d=\"M7.73 2.07 L32.84 8.80\" /><path d=\"M6.93 4.00 L29.44 17.00\" /><path d=\"M5.66 5.66 L24.04 24.04\" /><path d=\"M4.00 6.93 L17.00 29.44\" /><path d=\"M2.07 7.73 L8.80 32.84\" /><path d=\"M120.00 18.00 A18 18 0 0 1 102.00 0.00\" /><path d=\"M120.00 26.00 A26 26 0 0 1 94.00 0.00\" /><path d=\"M120.00 34.00 A34 34 0 0 1 86.00 0.00\" /><path d=\"M117.93 7.73 L111.20 32.84\" /><path d=\"M116.00 6.93 L103.00 29.44\" /><path d=\"M114.34 5.66 L95.96 24.04\" /><path d=\"M113.07 4.00 L90.56 17.00\" /><path d=\"M112.27 2.07 L87.16 8.80\" /><path d=\"M102.00 120.00 A18 18 0 0 1 120.00 102.00\" /><path d=\"M94.00 120.00 A26 26 0 0 1 120.00 94.00\" /><path d=\"M86.00 120.00 A34 34 0 0 1 120.00 86.00\" /><path d=\"M112.27 117.93 L87.16 111.20\" /><path d=\"M113.07 116.00 L90.56 103.00\" /><path d=\"M114.34 114.34 L95.96 95.96\" /><path d=\"M116.00 113.07 L103.00 90.56\" /><path d=\"M117.93 112.27 L111.20 87.16\" /><path d=\"M-0.00 102.00 A18 18 0 0 1 18.00 120.00\" /><path d=\"M-0.00 94.00 A26 26 0 0 1 26.00 120.00\" /><path d=\"M-0.00 86.00 A34 34 0 0 1 34.00 120.00\" /><path d=\"M2.07 112.27 L8.80 87.16\" /><path d=\"M4.00 113.07 L17.00 90.56\" /><path d=\"M5.66 114.34 L24.04 95.96\" /><path d=\"M6.93 116.00 L29.44 103.00\" /><path d=\"M7.73 117.93 L32.84 111.20\" /><path d=\"M60.0 42.0 L78.0 60.0 L60.0 78.0 L42.0 60.0 Z\" /><path d=\"M60.0 38.0 L82.0 60.0 L60.0 82.0 L38.0 60.0 Z\" /><path d=\"M60.0 54.0 L60.0 66.0 M54.0 60.0 L66.0 60.0\" /><path d=\"M0 58.5 L34.0 58.5 M86.0 58.5 L120 58.5\" /><path d=\"M0 61.5 L34.0 61.5 M86.0 61.5 L120 61.5\" /></g></svg>",
	"ui/page": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6 2.5 H14.5 L19 7 V21.5 H6 Z M14.5 2.5 V7 H19 M9 11 H16 M9 14 H16 M9 17 H13\"/></svg>",
	"ui/petal": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12 2 C17 7 17.5 14 12 22 C6.5 14 7 7 12 2 Z\"/></svg>",
	"ui/question": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><circle fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" cx=\"12\" cy=\"12\" r=\"9\"/><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9.4 9.4 A2.7 2.7 0 1 1 13.2 11.8 C12.4 12.3 12 12.8 12 13.8\"/><circle fill=\"currentColor\" cx=\"12\" cy=\"17\" r=\"1.1\"/></svg>",
	"ui/quill": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4 20 C8 16 10 12 20.5 3.5 C19.5 11 16 15.5 9 16.5 M4 20 L9 15 M12.5 11 L15 8.5\"/></svg>",
	"ui/quote": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M4 18 C4 13 5.5 9.2 9.5 6.5 L10.5 8 C8.4 9.8 7.6 11.4 7.5 13 H10.5 V18 Z M13.5 18 C13.5 13 15 9.2 19 6.5 L20 8 C17.9 9.8 17.1 11.4 17 13 H20 V18 Z\"/></svg>",
	"ui/sparkle": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12 2 C12.8 8.5 15.5 11.2 22 12 C15.5 12.8 12.8 15.5 12 22 C11.2 15.5 8.5 12.8 2 12 C8.5 11.2 11.2 8.5 12 2 Z\"/></svg>",
	"ui/stroke": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 20\" preserveAspectRatio=\"none\"><path fill=\"black\" opacity=\"0.88\" d=\"M19.9 3.0 L34.5 2.7 L49.0 2.6 L63.6 2.6 L78.2 2.5 L92.8 2.4 L107.3 2.2 L121.9 2.0 L136.5 1.8 L151.1 1.6 L165.6 1.5 L180.2 1.4 L194.8 1.4 L209.4 1.5 L223.9 1.8 L238.5 2.0 L253.1 2.4 L267.7 3.0 L282.2 3.3 L282.2 3.3 L267.7 3.4 L253.1 3.5 L238.5 3.5 L223.9 3.5 L209.4 3.5 L194.8 3.6 L180.2 3.7 L165.6 3.8 L151.1 4.0 L136.5 4.2 L121.9 4.4 L107.3 4.5 L92.8 4.5 L78.2 4.5 L63.6 4.3 L49.0 4.1 L34.5 3.7 L19.9 3.0 Z\"/><path fill=\"black\" opacity=\"0.85\" d=\"M15.8 5.0 L30.5 4.4 L45.3 4.1 L60.0 3.8 L74.8 3.6 L89.5 3.3 L104.2 3.0 L119.0 2.7 L133.7 2.6 L148.5 2.5 L163.2 2.5 L178.0 2.6 L192.7 2.9 L207.4 3.1 L222.2 3.5 L236.9 3.9 L251.7 4.3 L266.4 4.8 L281.2 5.1 L281.2 5.1 L266.4 5.3 L251.7 5.7 L236.9 5.9 L222.2 5.9 L207.4 5.8 L192.7 5.8 L178.0 5.7 L163.2 5.7 L148.5 5.7 L133.7 5.8 L119.0 5.9 L104.2 6.0 L89.5 6.1 L74.8 6.2 L60.0 6.2 L45.3 6.1 L30.5 5.8 L15.8 5.0 Z\"/><path fill=\"black\" opacity=\"0.73\" d=\"M19.6 6.7 L34.4 5.8 L49.2 5.4 L64.0 5.0 L78.8 4.6 L93.6 4.4 L108.3 4.2 L123.1 4.1 L137.9 4.1 L152.7 4.2 L167.5 4.4 L182.3 4.6 L197.1 4.9 L211.8 5.2 L226.6 5.4 L241.4 5.7 L256.2 5.9 L271.0 6.3 L285.8 6.4 L285.8 6.4 L271.0 6.8 L256.2 7.4 L241.4 7.7 L226.6 7.9 L211.8 7.9 L197.1 7.9 L182.3 7.8 L167.5 7.6 L152.7 7.5 L137.9 7.4 L123.1 7.3 L108.3 7.3 L93.6 7.3 L78.8 7.4 L64.0 7.4 L49.2 7.4 L34.4 7.2 L19.6 6.7 Z\"/><path fill=\"black\" opacity=\"0.65\" d=\"M18.9 7.9 L33.4 7.3 L47.9 7.0 L62.3 6.7 L76.8 6.6 L91.3 6.5 L105.8 6.6 L120.2 6.7 L134.7 6.8 L149.2 7.0 L163.7 7.2 L178.1 7.4 L192.6 7.5 L207.1 7.6 L221.6 7.6 L236.1 7.5 L250.5 7.5 L265.0 7.6 L279.5 7.5 L279.5 7.5 L265.0 7.9 L250.5 8.3 L236.1 8.6 L221.6 8.9 L207.1 9.0 L192.6 9.1 L178.1 9.1 L163.7 9.0 L149.2 8.8 L134.7 8.6 L120.2 8.4 L105.8 8.2 L91.3 8.1 L76.8 8.0 L62.3 8.0 L47.9 8.0 L33.4 8.1 L18.9 7.9 Z\"/><path fill=\"black\" opacity=\"0.76\" d=\"M5.6 9.0 L21.1 8.6 L36.6 8.4 L52.1 8.4 L67.6 8.4 L83.1 8.5 L98.6 8.6 L114.0 8.8 L129.5 8.9 L145.0 9.0 L160.5 9.1 L176.0 9.1 L191.5 9.0 L207.0 8.9 L222.5 8.8 L238.0 8.7 L253.5 8.7 L269.0 8.8 L284.4 8.9 L284.4 8.9 L269.0 9.1 L253.5 9.4 L238.0 9.7 L222.5 10.0 L207.0 10.3 L191.5 10.5 L176.0 10.6 L160.5 10.7 L145.0 10.7 L129.5 10.6 L114.0 10.4 L98.6 10.2 L83.1 10.0 L67.6 9.7 L52.1 9.6 L36.6 9.4 L21.1 9.3 L5.6 9.0 Z\"/><path fill=\"black\" opacity=\"0.59\" d=\"M11.3 10.5 L27.0 10.2 L42.6 10.2 L58.2 10.2 L73.9 10.4 L89.5 10.5 L105.1 10.5 L120.7 10.6 L136.4 10.5 L152.0 10.4 L167.6 10.3 L183.3 10.2 L198.9 10.0 L214.5 9.9 L230.2 9.9 L245.8 9.9 L261.4 10.1 L277.0 10.4 L292.7 10.7 L292.7 10.7 L277.0 10.7 L261.4 10.9 L245.8 11.1 L230.2 11.3 L214.5 11.5 L198.9 11.7 L183.3 12.0 L167.6 12.2 L152.0 12.4 L136.4 12.4 L120.7 12.4 L105.1 12.3 L89.5 12.2 L73.9 11.9 L58.2 11.6 L42.6 11.3 L27.0 11.0 L11.3 10.5 Z\"/><path fill=\"black\" opacity=\"0.96\" d=\"M13.5 12.5 L29.2 12.3 L44.9 12.3 L60.6 12.3 L76.2 12.3 L91.9 12.3 L107.6 12.2 L123.3 12.0 L139.0 11.8 L154.7 11.6 L170.4 11.5 L186.1 11.3 L201.8 11.3 L217.4 11.3 L233.1 11.5 L248.8 11.7 L264.5 12.0 L280.2 12.5 L295.9 12.8 L295.9 12.8 L280.2 12.8 L264.5 12.9 L248.8 12.8 L233.1 12.8 L217.4 12.9 L201.8 13.0 L186.1 13.1 L170.4 13.3 L154.7 13.5 L139.0 13.7 L123.3 13.8 L107.6 13.9 L91.9 13.9 L76.2 13.8 L60.6 13.7 L44.9 13.4 L29.2 13.0 L13.5 12.5 Z\"/><path fill=\"black\" opacity=\"1.00\" d=\"M4.0 14.5 L20.2 14.1 L36.4 13.9 L52.6 13.7 L68.7 13.5 L84.9 13.3 L101.1 13.0 L117.3 12.8 L133.4 12.6 L149.6 12.4 L165.8 12.4 L182.0 12.5 L198.2 12.6 L214.3 12.9 L230.5 13.2 L246.7 13.5 L262.9 13.9 L279.0 14.4 L295.2 14.7 L295.2 14.7 L279.0 14.8 L262.9 15.1 L246.7 15.1 L230.5 15.1 L214.3 15.0 L198.2 15.0 L182.0 15.0 L165.8 15.0 L149.6 15.1 L133.4 15.2 L117.3 15.3 L101.1 15.5 L84.9 15.6 L68.7 15.7 L52.6 15.6 L36.4 15.5 L20.2 15.2 L4.0 14.5 Z\"/><path fill=\"black\" opacity=\"0.81\" d=\"M13.7 16.3 L28.7 15.5 L43.8 15.1 L58.8 14.8 L73.8 14.4 L88.9 14.1 L103.9 13.9 L119.0 13.7 L134.0 13.7 L149.0 13.8 L164.1 13.9 L179.1 14.1 L194.2 14.4 L209.2 14.7 L224.3 15.0 L239.3 15.3 L254.3 15.6 L269.4 16.0 L284.4 16.1 L284.4 16.1 L269.4 16.5 L254.3 17.0 L239.3 17.3 L224.3 17.4 L209.2 17.4 L194.2 17.3 L179.1 17.2 L164.1 17.1 L149.0 17.0 L134.0 16.9 L119.0 16.9 L103.9 16.9 L88.9 17.0 L73.8 17.1 L58.8 17.1 L43.8 17.1 L28.7 16.9 L13.7 16.3 Z\"/></svg>",
	"ui/warning": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 3 L22 20 H2 Z M12 9.5 V14\"/><circle fill=\"currentColor\" cx=\"12\" cy=\"17\" r=\"1.1\"/></svg>"
};

/* Set by makePlugin. ItemView calls getViewType() inside super(), before fields exist. */
let VIEW_TYPE = "world-title";

/* ------------------------------------------------------------------ helpers */

const bodyHas = (name) => document.body.classList.contains(name);
const reducedMotion = () =>
	bodyHas("co-still") || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const lowPower = () => bodyHas("co-low-power");

function cssVar(name, fallback) {
	const value = getComputedStyle(document.body).getPropertyValue(name).trim();
	return value || fallback;
}
function cssNumber(name, fallback) {
	const value = parseFloat(cssVar(name, ""));
	return Number.isFinite(value) ? value : fallback;
}
function rgb(name, fallback) {
	return cssVar(name, fallback).replace(/\s+/g, "");
}

const SVG_PARSER = new DOMParser();
function svgNode(markup) {
	if (!markup) {
		return null;
	}
	const source = markup.includes("xmlns=") ? markup : markup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
	const root = SVG_PARSER.parseFromString(source, "image/svg+xml").documentElement;
	if (!root || root.nodeName === "parsererror" || root.querySelector("parsererror")) {
		return null;
	}
	return document.importNode(root, true);
}
function icon(parent, name, cls) {
	const span = parent.createSpan({ cls: "cop-icon" + (cls ? " " + cls : ""), attr: { "aria-hidden": "true" } });
	const node = svgNode(ICONS["ui/" + name]);
	if (node) {
		node.setAttribute("width", "1em"); // sane size even if the stylesheet is gone
		node.setAttribute("height", "1em");
		span.appendChild(node);
	}
	return span;
}
const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs, parent) {
	const el = document.createElementNS(SVG_NS, tag);
	for (const [key, value] of Object.entries(attrs || {})) {
		el.setAttribute(key, String(value));
	}
	if (parent) {
		parent.appendChild(el);
	}
	return el;
}

function today() {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function dayDiff(a, b) {
	return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);
}
function countWords(text) {
	const body = text.replace(/^---\n[\s\S]*?\n---\n?/, "").replace(/```[\s\S]*?```/g, " ");
	const match = body.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu);
	return match ? match.length : 0;
}
const fmt = (n) => Math.round(n).toLocaleString();

/* ---------------------------------------------------------------- particles */

/* Three depth layers, pre-rendered sprites, 30 fps cap (15 on low power), pixel ratio cap 1.5,
   paused while hidden, blurred or scrolled away.
   Kinds: rain, motes, grain, laser, sand, embers, ash, petals, glyph, snow.
   Color: --cop-particle-rgb (falls back to the frame color). */
const KINDS = {
	rain: { vx: 0, vy: 9, density: 1.3, shape: "streak" },
	motes: { vx: 0, vy: -0.35, density: 0.35, shape: "glow", drift: 1 },
	grain: { vx: 0, vy: -0.35, density: 0.8, shape: "square", drift: 1 },
	laser: { vx: 0.9, vy: 0, density: 0.35, shape: "glow", wave: 0.15 },
	sand: { vx: 1.6, vy: 0.12, density: 1.1, shape: "dot", wave: 0.5 },
	embers: { vx: 0.15, vy: -0.9, density: 0.45, shape: "glow", wave: 0.4, flicker: 1 },
	ash: { vx: 0.2, vy: 0.45, density: 0.6, shape: "dot", wave: 0.6 },
	petals: { vx: 0.35, vy: 0.7, density: 0.25, shape: "petal", wave: 0.9 },
	glyph: { vx: 0, vy: 3.2, density: 0.9, shape: "glyph" },
	snow: { vx: 0.1, vy: 0.6, density: 0.7, shape: "dot", wave: 0.7 },
};
class Ambience {
	constructor(canvas, kind) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.kind = KINDS[kind] ? kind : "motes";
		this.k = KINDS[this.kind];
		this.items = [];
		this.raf = 0;
		this.last = 0;
		this.visible = true;
		this.sprites = {};
		this.resize = this.resize.bind(this);
		this.frame = this.frame.bind(this);
		this.observer = new ResizeObserver(this.resize);
		this.observer.observe(canvas.parentElement);
		this.io = new IntersectionObserver((entries) => {
			this.visible = entries.some((e) => e.isIntersecting);
			this.kick();
		});
		this.io.observe(canvas);
		this.resize();
	}
	color() {
		return rgb("--cop-particle-rgb", "") || rgb("--co-particle-rgb", "") || rgb("--co-frame-rgb", "200,170,110");
	}
	sprite(size, alpha) {
		const key = `${size}-${alpha}-${this.color()}`;
		if (this.sprites[key]) {
			return this.sprites[key];
		}
		const c = document.createElement("canvas");
		const s = Math.ceil(size * 4);
		c.width = c.height = s;
		const g = c.getContext("2d");
		const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
		grad.addColorStop(0, `rgba(${this.color()},${alpha})`);
		grad.addColorStop(0.35, `rgba(${this.color()},${alpha * 0.35})`);
		grad.addColorStop(1, `rgba(${this.color()},0)`);
		g.fillStyle = grad;
		g.fillRect(0, 0, s, s);
		this.sprites[key] = c;
		return c;
	}
	resize() {
		const box = this.canvas.parentElement.getBoundingClientRect();
		const ratio = Math.min(1.5, window.devicePixelRatio || 1);
		this.w = Math.max(1, box.width);
		this.h = Math.max(1, box.height);
		this.canvas.width = Math.round(this.w * ratio);
		this.canvas.height = Math.round(this.h * ratio);
		this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
		this.sprites = {};
		this.seed();
		this.kick();
	}
	seed() {
		const area = (this.w * this.h) / 9000;
		const count = Math.round(Math.min(220, area * this.k.density) * (lowPower() ? 0.5 : 1) * cssNumber("--co-particle-density", 1));
		this.items = [];
		for (let i = 0; i < count; i++) {
			this.items.push(this.spawn(true));
		}
	}
	spawn(anywhere) {
		const r = Math.random();
		const depth = r < 0.7 ? 0 : r < 0.92 ? 1 : 2; // 70 % far
		const speed = [0.35, 0.65, 1][depth];
		const k = this.k;
		let x = Math.random() * this.w;
		let y = Math.random() * this.h;
		if (!anywhere) {
			// enter from the edge the flow comes from
			if (Math.abs(k.vx) > Math.abs(k.vy)) {
				x = k.vx > 0 ? -10 : this.w + 10;
			} else {
				y = k.vy > 0 ? -20 : this.h + 10;
			}
		}
		return {
			depth,
			x,
			y,
			v: speed,
			drift: (Math.random() - 0.5) * 0.3,
			size: [1.2, 2, 3.2][depth] * (0.7 + Math.random() * 0.6),
			alpha: [0.25, 0.45, 0.7][depth] * (0.6 + Math.random() * 0.4),
			phase: Math.random() * Math.PI * 2,
			spin: (Math.random() - 0.5) * 0.06,
			len: 4 + Math.floor(Math.random() * 10),
		};
	}
	kick() {
		const run = this.visible && !document.hidden && document.hasFocus() && !reducedMotion() && !bodyHas("co-no-particles");
		if (run && !this.raf) {
			this.raf = window.requestAnimationFrame(this.frame);
		}
		if (!run) {
			this.stop();
			this.draw(0); // one still frame
		}
	}
	stop() {
		if (this.raf) {
			window.cancelAnimationFrame(this.raf);
			this.raf = 0;
		}
	}
	frame(t) {
		this.raf = 0;
		const budget = lowPower() ? 66 : 33;
		if (t - this.last >= budget) {
			const dt = Math.min(3, (t - this.last) / 16.7 || 1);
			this.last = t;
			this.step(dt);
			this.draw(t);
		}
		this.kick();
	}
	step(dt) {
		const k = this.k;
		const slant = this.kind === "rain" ? cssNumber("--cop-rain-slant", 0.18) : 0;
		for (const p of this.items) {
			p.phase += 0.02 * dt;
			p.x += (k.vx * p.v + (k.drift ? p.drift : 0) + (this.kind === "rain" ? k.vy * p.v * slant : 0)) * dt;
			p.y += k.vy * p.v * dt + (k.wave ? Math.sin(p.phase) * k.wave * 0.3 : 0);
			if (k.wave && k.vy && !k.vx) {
				p.x += Math.cos(p.phase) * k.wave * 0.3;
			}
			if (p.y > this.h + 24 || p.y < -30 || p.x > this.w + 24 || p.x < -24) {
				Object.assign(p, this.spawn(false));
			}
		}
	}
	draw() {
		const g = this.ctx;
		g.clearRect(0, 0, this.w, this.h);
		const color = this.color();
		const shape = this.k.shape;
		for (const p of this.items) {
			const a = this.k.flicker ? p.alpha * (0.6 + 0.4 * Math.sin(p.phase * 7)) : p.alpha;
			if (shape === "streak") {
				const len = 6 + p.depth * 8;
				const slant = cssNumber("--cop-rain-slant", 0.18);
				g.strokeStyle = `rgba(${color},${a * 0.55})`;
				g.lineWidth = 0.6 + p.depth * 0.5;
				g.beginPath();
				g.moveTo(p.x, p.y);
				g.lineTo(p.x - len * slant, p.y - len);
				g.stroke();
			} else if (shape === "square") {
				g.fillStyle = `rgba(${color},${a * 0.5})`;
				g.fillRect(p.x, p.y, p.size * 0.7, p.size * 0.7);
			} else if (shape === "dot") {
				// tiny squares read as dots at this size and cost far less than arcs
				g.fillStyle = `rgba(${color},${a * 0.8})`;
				g.fillRect(p.x, p.y, p.size * 0.8, p.size * 0.8);
			} else if (shape === "petal") {
				g.save();
				g.translate(p.x, p.y);
				g.rotate(p.phase * 2 + p.spin * 40);
				g.fillStyle = `rgba(${color},${a * 0.85})`;
				g.beginPath();
				g.ellipse(0, 0, p.size * 1.6, p.size * 0.7 * Math.abs(Math.sin(p.phase * 1.5)) + 0.4, 0, 0, Math.PI * 2);
				g.fill();
				g.restore();
			} else if (shape === "glyph") {
				g.fillStyle = `rgba(${color},${a * 0.7})`;
				const cell = 3 + p.depth;
				for (let i = 0; i < p.len; i++) {
					if ((i + Math.floor(p.phase * 3)) % 3 === 0) {
						continue;
					}
					g.globalAlpha = 1 - i / p.len;
					g.fillRect(p.x, p.y - i * (cell + 2), cell, cell);
				}
				g.globalAlpha = 1;
			} else {
				const s = this.sprite(p.size, a);
				const d = p.size * 4;
				g.drawImage(s, p.x - d / 2, p.y - d / 2, d, d);
			}
		}
	}
	destroy() {
		this.stop();
		this.observer.disconnect();
		this.io.disconnect();
	}
}

/* ----------------------------------------------------------- title view base */

class TitleView extends ItemView {
	constructor(leaf, plugin) {
		super(leaf);
		this.plugin = plugin;
		this.ambience = null;
		this.clock = 0;
		this.selected = 0;
		this.tab = 0;
	}
	getViewType() {
		return VIEW_TYPE;
	}
	getDisplayText() {
		return this.plugin ? this.plugin.titleName() : "Title";
	}
	getIcon() {
		return (this.plugin && this.plugin.V.icon) || "home";
	}
	async onOpen() {
		// Leaving a pane for the title screen and coming back is entering again: allow a card.
		if (this.plugin && this.plugin.leafFiles) {
			this.plugin.leafFiles.delete(this.leaf);
		}
		this.render();
	}
	async onClose() {
		this.teardown();
		this.contentEl.empty();
		if (this.plugin) {
			window.setTimeout(() => this.plugin.syncBodyState(), 0);
		}
	}
	teardown() {
		if (this.ambience) {
			this.ambience.destroy();
			this.ambience = null;
		}
		if (this.clock) {
			window.clearInterval(this.clock);
			this.clock = 0;
		}
	}
	world() {
		return this.plugin.world();
	}
	render() {
		this.teardown();
		const root = this.contentEl;
		root.empty();
		root.addClass("cop-title-root");
		root.setAttribute("data-world", this.world());
		root.setAttribute("data-variant", this.plugin.V.key);
		this.plugin.syncBodyState();

		const scene = root.createDiv({ cls: "cop-scene", attr: { "aria-hidden": "true" } });
		const drawSvg = () => {
			// unique ids: a hidden tab holding another copy would otherwise own the gradients (they render blank)
			const uid = "s" + Math.random().toString(36).slice(2, 7);
			const raw = ICONS["scenes/" + this.world()] || "";
			const svg = svgNode(raw.replace(/id="([\w-]+)"/g, `id="${uid}-$1"`).replace(/url\(#([\w-]+)\)/g, `url(#${uid}-$1)`).replace(/href="#([\w-]+)"/g, `href="#${uid}-$1"`));
			if (svg) {
				scene.appendChild(svg);
			}
		};
		// a baked painting embedded in the plugin's styles.css (community installs ship no extra files); the vector scene is the fallback
		const baked = this.plugin.V.backdrop ? this.plugin.V.backdrop(this.world()) : "";
		if (baked) {
			scene.addClass("is-baked", "is-bd-" + baked);
		} else {
			drawSvg();
		}
		const kind = this.plugin.V.worlds[this.world()].ambience;
		const canvas = kind && kind !== "none" ? root.createEl("canvas", { cls: "cop-ambience", attr: { "aria-hidden": "true" } }) : null;
		root.createDiv({ cls: "cop-scanlines", attr: { "aria-hidden": "true" } });

		const frame = root.createDiv({ cls: "cop-title-frame" });
		const mark = frame.createDiv({ cls: "cop-wordmark" });
		const name = this.plugin.titleName();
		mark.style.setProperty("--cop-len", String(Math.max(6, name.length)));
		mark.createSpan({ cls: "cop-wordmark-text", text: name });
		const sub = frame.createDiv({ cls: "cop-subline" });
		const tick = () =>
			sub.setText(
				this.plugin.V.noClock
					? this.plugin.V.worlds[this.world()].place
					: `${this.plugin.V.worlds[this.world()].place}  //  ${new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`
			);
		tick();
		this.clock = window.setInterval(tick, 20000);

		this.plugin.V.renderMenu(this, frame);

		this.ambience = canvas ? new Ambience(canvas, kind) : null;
		if (this.plugin.V.titleIn) {
			this.plugin.V.titleIn(this, mark);
		} else if (!reducedMotion() && typeof frame.animate === "function") {
			mark.animate(
				[{ opacity: 0 }, { opacity: 0.8, offset: 0.1 }, { opacity: 0.1, offset: 0.16 }, { opacity: 1, offset: 0.3 }, { opacity: 0.4, offset: 0.36 }, { opacity: 1 }],
				{ duration: 900, easing: "steps(12, end)" }
			);
		}
	}
	/* run a menu entry */
	run(entry) {
		this.plugin.runEntry(entry);
	}
	focusSoon(el) {
		window.setTimeout(() => {
			const doc = this.contentEl.ownerDocument;
			const active = doc.activeElement;
			const idle = !active || active === doc.body || this.contentEl.contains(active);
			if (el && el.isConnected && idle && doc.hasFocus() && this.app.workspace.getActiveViewOfType(TitleView) === this) {
				el.focus({ preventScroll: true });
			}
		}, 60);
	}
}

/* ------------------------------------------------------------------ tally */

class TallyModal extends Modal {
	constructor(app, plugin) {
		super(app);
		this.plugin = plugin;
	}
	onOpen() {
		const p = this.plugin;
		const V = p.V;
		this.modalEl.addClass("cop-tally");
		this.titleEl.setText(V.tallyTitle);
		const grid = this.contentEl.createDiv({ cls: "cop-tally-grid" });
		const rows = [
			[V.labels.goal, `${fmt(p.data.added)} / ${fmt(p.settings.dailyGoal)} words`],
			[V.labels.streak, `${p.data.streak} day${p.data.streak === 1 ? "" : "s"}`],
			[V.labels.total, `${fmt(p.totalWords)} words`],
			["Notes in the vault", fmt(this.app.vault.getMarkdownFiles().length)],
			["Notes created today", fmt(p.data.createdToday)],
			[V.labels.saves || "Saves today", fmt(p.data.saves)],
		];
		for (const [k, v] of rows) {
			grid.createDiv({ cls: "cop-tally-k", text: k });
			grid.createDiv({ cls: "cop-tally-v", text: v });
		}
		if (V.tallyExtra) {
			V.tallyExtra(this.contentEl, p);
		}
	}
	onClose() {
		this.contentEl.empty();
	}
}

/* ------------------------------------------------------------------ plugin */

function makePlugin(V) {
	VIEW_TYPE = V.viewType;
	const DEFAULTS = {
		title: "",
		dailyGoal: 500,
		entries: V.defaultEntries.map((e) => Object.assign({ show: true }, e)),
		settingsVersion: 1,
	};

	class WorldPlugin extends Plugin {
		async onload() {
			this.V = V;
			await this.loadSettings();
			this.wordCounts = new Map();
			this.totalWords = 0;
			this.leafFiles = new WeakMap();
			this.lastSaveFx = 0;
			this.lastComms = 0;
			this.typingTimer = 0;
			this.opening = false;

			this.registerView(V.viewType, (leaf) => new TitleView(leaf, this));
			this.addSettingTab(new WorldSettingTab(this.app, this));

			this.addCommand({ id: "open-title", name: "Return to the title screen", callback: () => void this.openTitle() });
			this.addCommand({ id: "save-fx", name: V.labels.saveCommand, callback: () => this.saveCommand() });
			this.addCommand({ id: "show-card", name: V.labels.cardCommand, callback: () => this.cardForActive(true) });
			this.addCommand({ id: "show-tally", name: V.labels.tallyCommand || "Show the tally", callback: () => new TallyModal(this.app, this).open() });
			this.addCommand({ id: "cycle-world", name: "Switch world", callback: () => this.cycleWorld() });

			this.registerEvent(this.app.workspace.on("layout-change", () => this.onLayout()));
			this.registerEvent(this.app.workspace.on("layout-change", () => this.syncBodyState()));
			this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.syncBodyState()));
			this.registerEvent(this.app.workspace.on("css-change", () => this.refresh()));
			this.registerEvent(this.app.workspace.on("file-open", (file) => this.onFileOpen(file)));
			this.registerEvent(this.app.workspace.on("editor-change", () => this.onTyping()));
			this.registerEvent(this.app.vault.on("modify", (file) => this.onModify(file)));
			this.registerEvent(this.app.vault.on("create", (file) => this.onCreate(file)));
			this.registerEvent(this.app.vault.on("delete", (file) => this.onDelete(file)));

			this.worldKey = this.world();
			this.bodyKey = this.bodySignature();
			this.bodyWatch = new MutationObserver(() => {
				const now = this.bodySignature();
				if (now !== this.bodyKey) {
					this.bodyKey = now;
					this.refresh();
				}
			});
			this.bodyWatch.observe(document.body, { attributes: true, attributeFilter: ["class"] });
			// modals are appended to the body; the HUD dims while one is open (a class instead of :has())
			this.modalWatch = new MutationObserver(() => this.syncBodyState());
			this.modalWatch.observe(document.body, { childList: true });

			this.setVaultVars();
			this.syncIdle();
			this.registerDomEvent(window, "blur", () => this.syncIdle());
			this.registerDomEvent(window, "focus", () => this.syncIdle());
			this.registerDomEvent(document, "visibilitychange", () => this.syncIdle());

			this.app.workspace.onLayoutReady(() => {
				this.wrapSave();
				this.buildHud();
				this.onLayout();
				this.rollDay();
				window.setTimeout(() => void this.scanVault(), 1200);
				if (V.hooks && V.hooks.ready) {
					V.hooks.ready(this);
				}
				const other = V.otherId && this.app.plugins && this.app.plugins.enabledPlugins && this.app.plugins.enabledPlugins.has(V.otherId);
				if (other) {
					new Notice(`${V.name}: ${V.otherName || "the other companion"} is also on. Turn one off; they draw the same screens.`, 8000);
				}
			});
		}

		setVaultVars() {
			const name = this.titleName();
			document.body.style.setProperty("--co-vault-name", JSON.stringify(name));
			document.body.style.setProperty("--co-vault-len", String(Math.max(6, name.length)));
		}
		onunload() {
			document.body.style.removeProperty("--co-vault-name");
			document.body.style.removeProperty("--co-vault-len");
			if (this.bodyWatch) {
				this.bodyWatch.disconnect();
			}
			if (this.modalWatch) {
				this.modalWatch.disconnect();
			}
			if (this.saveWrapped) {
				const { save, original } = this.saveWrapped;
				for (const key of Object.keys(original)) {
					save[key] = original[key];
				}
				this.saveWrapped = null;
			}
			document.body.classList.remove("cop-idle", "cop-typing", "cop-modal-open", "cop-title-active");
			if (V.hooks && V.hooks.unload) {
				V.hooks.unload(this);
			}
			document.querySelectorAll(".cop-hud-corner, .cop-card, .cop-savefx").forEach((el) => el.remove());
		}

		/* ---- state ---- */
		world() {
			for (const key of Object.keys(V.worlds)) {
				if (bodyHas("co-world-" + key)) {
					return key;
				}
			}
			return V.defaultWorld;
		}
		bodySignature() {
			const keep = Array.from(document.body.classList).filter((c) => c.startsWith("co-") || c === "theme-dark" || c === "theme-light");
			return keep.sort().join(" ");
		}
		cycleWorld() {
			const keys = Object.keys(V.worlds);
			const next = keys[(keys.indexOf(this.world()) + 1) % keys.length];
			const ss = this.app.plugins && this.app.plugins.plugins && this.app.plugins.plugins["obsidian-style-settings"];
			const manager = ss && ss.settingsManager;
			if (manager && typeof manager.setSetting === "function") {
				manager.setSetting(V.themeId, "co-world", "co-world-" + next);
				if (typeof manager.removeClasses === "function" && typeof manager.initClasses === "function") {
					manager.removeClasses();
					manager.initClasses();
				}
			} else {
				for (const key of keys) {
					document.body.classList.remove("co-world-" + key);
				}
				document.body.classList.add("co-world-" + next);
			}
			this.comms(V.worlds[next].switchLine, true);
		}
		/* A file shipped in the plugin's own assets/ folder, as a URL the app can load. */
		assetUrl(file) {
			const name = /\.\w+$/.test(file) ? file : `${file}.webp`;
			return this.app.vault.adapter.getResourcePath(`${this.manifest.dir}/assets/${name}`);
		}
		titleName() {
			const text = (this.settings.title || "").trim();
			return text || this.app.vault.getName();
		}
		syncBodyState() {
			document.body.classList.toggle("cop-modal-open", !!document.querySelector(".modal-container"));
			document.body.classList.toggle("cop-title-active", !!document.querySelector(".workspace-leaf.mod-active .cop-title-root"));
		}
		syncIdle() {
			const idle = document.hidden || !document.hasFocus();
			document.body.classList.toggle("cop-idle", idle);
			for (const leaf of this.app.workspace.getLeavesOfType(V.viewType)) {
				if (leaf.view instanceof TitleView && leaf.view.ambience) {
					leaf.view.ambience.kick();
				}
			}
		}

		/* ---- title screen on empty tabs ---- */
		onLayout() {
			if (this.opening) {
				return;
			}
			const leaf = this.app.workspace.getMostRecentLeaf();
			if (!leaf || leaf.getViewState().type !== "empty") {
				return;
			}
			this.opening = true;
			leaf.setViewState({ type: V.viewType, active: true }).finally(() => {
				this.opening = false;
			});
		}
		async openTitle() {
			const leaf = this.app.workspace.getLeaf(false);
			await leaf.setViewState({ type: V.viewType, active: true });
			this.app.workspace.revealLeaf(leaf);
		}
		refresh() {
			if (!this.refreshSoon) {
				this.refreshSoon = debounce(() => this.refreshNow(), 300, true);
			}
			this.refreshSoon();
		}
		refreshNow() {
			const was = this.worldKey;
			this.worldKey = this.world();
			if (was && was !== this.worldKey && V.hooks && V.hooks.world) {
				V.hooks.world(this, was, this.worldKey);
			}
			for (const leaf of this.app.workspace.getLeavesOfType(V.viewType)) {
				if (leaf.view instanceof TitleView) {
					leaf.view.render();
				}
			}
			this.buildHud();
			this.updateHud();
		}

		/* ---- menu entries ---- */
		lastNote() {
			const recent = this.app.workspace.getLastOpenFiles ? this.app.workspace.getLastOpenFiles() : [];
			for (const path of recent) {
				const file = this.app.vault.getAbstractFileByPath(path);
				if (file instanceof TFile && file.extension === "md") {
					return file;
				}
			}
			return null;
		}
		recentFiles(n) {
			const out = [];
			const recent = this.app.workspace.getLastOpenFiles ? this.app.workspace.getLastOpenFiles() : [];
			for (const path of recent) {
				const file = this.app.vault.getAbstractFileByPath(path);
				if (file instanceof TFile && file.extension === "md") {
					out.push(file);
				}
				if (out.length >= n) {
					break;
				}
			}
			return out;
		}
		entries() {
			return this.settings.entries.filter((e) => e.show);
		}
		async runEntry(entry) {
			const target = (entry.target || "").trim();
			if (target === "@last") {
				const file = this.lastNote();
				if (file) {
					await this.app.workspace.getLeaf(false).openFile(file);
				} else {
					this.comms(V.lines.noLast || "No notes yet. Make a new one and start there.", true);
				}
				return;
			}
			if (target.startsWith("note:")) {
				const file = this.app.metadataCache.getFirstLinkpathDest(target.slice(5), "");
				if (file) {
					await this.app.workspace.getLeaf(false).openFile(file);
				} else {
					new Notice(`No note named ${target.slice(5)}`);
				}
				return;
			}
			if (target) {
				const ok = this.app.commands.executeCommandById(target);
				if (!ok) {
					new Notice(`That command is not available: ${target}`);
				}
			}
		}
		/* open tasks of a note, for the Objectives page */
		async openTasks(file, limit) {
			if (!file) {
				return [];
			}
			const cache = this.app.metadataCache.getFileCache(file);
			const items = (cache && cache.listItems) || [];
			const tasks = items.filter((i) => i.task === " ");
			if (!tasks.length) {
				return [];
			}
			const text = await this.app.vault.cachedRead(file);
			const lines = text.split("\n");
			return tasks.slice(0, limit).map((t) => ({
				file,
				line: t.position.start.line,
				text: (lines[t.position.start.line] || "").replace(/^\s*[-*+]\s*\[.\]\s*/, "").trim(),
			}));
		}
		dailyNote() {
			const daily = this.app.internalPlugins && this.app.internalPlugins.getPluginById && this.app.internalPlugins.getPluginById("daily-notes");
			const opts = (daily && daily.instance && daily.instance.options) || {};
			const format = opts.format || "YYYY-MM-DD";
			const name = window.moment ? window.moment().format(format) : today();
			const folder = (opts.folder || "").replace(/\/$/, "");
			const path = (folder ? folder + "/" : "") + name + ".md";
			const file = this.app.vault.getAbstractFileByPath(path);
			return file instanceof TFile ? file : null;
		}

		/* ---- word tracking ---- */
		async loadSettings() {
			const stored = (await this.loadData()) || {};
			this.settings = Object.assign({}, DEFAULTS, stored.settings || {});
			if (!Array.isArray(this.settings.entries) || !this.settings.entries.length) {
				this.settings.entries = DEFAULTS.entries.map((e) => Object.assign({}, e));
			}
			this.data = Object.assign({ date: today(), added: 0, saves: 0, createdToday: 0, streak: 0, lastWrite: "", milestones: 0 }, stored.data || {});
		}
		async saveAll() {
			await this.saveData({ settings: this.settings, data: this.data });
		}
		saveSoon() {
			if (!this.saveDebounced) {
				this.saveDebounced = debounce(() => void this.saveAll(), 1500, true);
			}
			this.saveDebounced();
		}
		rollDay() {
			const now = today();
			if (this.data.date !== now) {
				this.data.date = now;
				this.data.added = 0;
				this.data.saves = 0;
				this.data.createdToday = 0;
				this.data.milestones = 0;
				if (this.data.lastWrite && dayDiff(this.data.lastWrite, now) > 1) {
					this.data.streak = 0;
				}
				this.saveSoon();
			}
		}
		async scanVault() {
			let total = 0;
			const files = this.app.vault.getMarkdownFiles();
			for (let i = 0; i < files.length; i++) {
				const text = await this.app.vault.cachedRead(files[i]);
				const n = countWords(text);
				this.wordCounts.set(files[i].path, n);
				total += n;
				if (i % 40 === 39) {
					await new Promise((r) => window.setTimeout(r, 0));
				}
			}
			this.totalWords = total;
			this.updateHud();
		}
		async onModify(file) {
			if (!(file instanceof TFile) || file.extension !== "md") {
				return;
			}
			const text = await this.app.vault.cachedRead(file);
			const n = countWords(text);
			const before = this.wordCounts.has(file.path) ? this.wordCounts.get(file.path) : n;
			this.wordCounts.set(file.path, n);
			this.totalWords += n - before;
			const delta = n - before;
			if (delta > 0) {
				this.rollDay();
				const wasBelow = this.data.added < this.settings.dailyGoal;
				this.data.added += delta;
				const now = today();
				if (this.data.lastWrite !== now) {
					this.data.streak = this.data.lastWrite && dayDiff(this.data.lastWrite, now) === 1 ? this.data.streak + 1 : 1;
					this.data.lastWrite = now;
					if (V.hooks && V.hooks.gain) {
						V.hooks.gain(this, "streak", this.data.streak);
					}
				}
				if (wasBelow && this.data.added >= this.settings.dailyGoal) {
					this.comms(V.lines.goal, true);
					if (V.hooks && V.hooks.gain) {
						V.hooks.gain(this, "goal", this.data.added);
					}
				} else {
					const step = Math.floor(this.data.added / 250);
					if (step > this.data.milestones) {
						this.data.milestones = step;
						this.comms(V.lines.milestone[step % V.lines.milestone.length]);
					}
				}
				this.saveSoon();
			}
			this.updateHud();
		}
		onCreate(file) {
			if (file instanceof TFile && file.extension === "md" && this.app.workspace.layoutReady) {
				this.rollDay();
				this.data.createdToday += 1;
				this.wordCounts.set(file.path, 0);
				this.saveSoon();
			}
		}
		onDelete(file) {
			if (file instanceof TFile && file.extension === "md" && V.lines.deleted) {
				this.comms(V.lines.deleted[Math.floor(Math.random() * V.lines.deleted.length)], true);
			}
			if (V.hooks && V.hooks.delete) {
				V.hooks.delete(this, file);
			}
			if (file instanceof TFile && this.wordCounts.has(file.path)) {
				this.totalWords -= this.wordCounts.get(file.path);
				this.wordCounts.delete(file.path);
				this.updateHud();
			}
		}
		onTyping() {
			if (V.hooks && V.hooks.typing) {
				V.hooks.typing(this);
			}
			document.body.classList.add("cop-typing");
			window.clearTimeout(this.typingTimer);
			this.typingTimer = window.setTimeout(() => document.body.classList.remove("cop-typing"), 1600);
			if (!this.miniSoon) {
				this.miniSoon = debounce(() => this.updateMinimap(), 600, true);
			}
			this.miniSoon();
		}

		/* ---- cards ---- */
		onFileOpen(file) {
			if (!(file instanceof TFile) || file.extension !== "md") {
				this.updateHud();
				return;
			}
			this.cardWhenReady(file, 0);
			this.updateHud();
			if (V.hooks && V.hooks.open) {
				V.hooks.open(this, file);
			}
			const mtimeDays = (Date.now() - file.stat.mtime) / 86400000;
			if (mtimeDays > 30) {
				this.comms(V.lines.cold);
			}
		}
		cardWhenReady(file, tries) {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view || view.file !== file) {
				if (tries < 6) {
					window.requestAnimationFrame(() => this.cardWhenReady(file, tries + 1));
				}
				return;
			}
			if (this.leafFiles.get(view.leaf) === file.path) {
				return;
			}
			this.leafFiles.set(view.leaf, file.path);
			this.showCard(file, view);
		}
		cardForActive() {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view && view.file) {
				this.showCard(view.file, view, true);
			}
		}
		showCard(file, view, force) {
			if (bodyHas("co-no-cards") && !force) {
				return;
			}
			const host = view.containerEl;
			host.querySelectorAll(".cop-card").forEach((el) => el.remove());
			const still = reducedMotion();
			const hold = Math.min(10, Math.max(0.2, cssNumber("--co-card-hold", 0.9)));
			const fadeIn = still ? 0.12 : 0.32;
			const fadeOut = still ? 0.15 : 0.45;
			const total = fadeIn + hold + fadeOut;
			const card = host.createDiv({ cls: "cop-card", attr: { "aria-hidden": "true", "data-variant": V.key } });
			card.dataset.hold = String(hold);
			const parent = file.parent && file.parent.path !== "/" ? file.parent.name : this.app.vault.getName();
			V.fillCard(card, file, parent);
			const remove = () => card.remove();
			if (typeof card.animate !== "function") {
				window.setTimeout(remove, total * 1000);
				return;
			}
			const steps = still
				? [{ opacity: 0, offset: 0 }, { opacity: 1, offset: fadeIn / total }, { opacity: 1, offset: (fadeIn + hold) / total }, { opacity: 0, offset: 1 }]
				: [
						{ opacity: 0, offset: 0 },
						{ opacity: 0.85, offset: (fadeIn * 0.3) / total },
						{ opacity: 0.15, offset: (fadeIn * 0.5) / total },
						{ opacity: 1, offset: fadeIn / total },
						{ opacity: 1, offset: (fadeIn + hold) / total },
						{ opacity: 0, offset: 1 },
				  ];
			const animation = card.animate(steps, { duration: total * 1000, easing: "linear", fill: "forwards" });
			animation.onfinish = remove;
			animation.oncancel = remove;
			window.setTimeout(remove, total * 1000 + 500);
		}

		/* ---- HUD ---- */
		hudMode() {
			if (bodyHas("co-hud-off")) {
				return "off";
			}
			if (bodyHas("co-hud-bar")) {
				return "bar";
			}
			return "corner";
		}
		buildHud() {
			if (!this.bar) {
				this.bar = this.addStatusBarItem();
				this.bar.addClass("cop-hud-bar");
				this.bar.setAttribute("data-tooltip-position", "top");
				this.bar.setAttribute("aria-label", V.tallyTitle);
				this.registerDomEvent(this.bar, "click", () => new TallyModal(this.app, this).open());
			}
			this.bar.empty();
			this.bar.toggle(this.hudMode() !== "off");
			this.bar.createSpan({ cls: "cop-hud-bar-label", text: V.labels.barMeter });
			const meter = this.bar.createSpan({ cls: "cop-hud-bar-meter" });
			this.barFill = meter.createSpan({ cls: "cop-hud-bar-fill" });
			this.barText = this.bar.createSpan({ cls: "cop-hud-bar-text" });

			document.querySelectorAll(".cop-hud-corner").forEach((el) => el.remove());
			this.corner = null;
			if (this.hudMode() !== "corner") {
				return;
			}
			// The root split lays out its children itself, so the HUD is a fixed overlay
			// placed from the root split's rectangle (and re-placed on resize).
			const corner = document.body.createDiv({ cls: "cop-hud-corner", attr: { "data-variant": V.key, "aria-hidden": "true" } });
			this.corner = corner;
			V.buildCorner(this, corner);
			this.registerDomEvent(corner, "click", () => new TallyModal(this.app, this).open());
			if (!this.placeHooked) {
				this.placeHooked = true;
				this.registerEvent(this.app.workspace.on("resize", () => this.placeCorner()));
				this.registerEvent(this.app.workspace.on("layout-change", () => this.placeCorner()));
				this.registerDomEvent(window, "resize", () => this.placeCorner());
			}
			this.placeCorner();
		}
		placeCorner() {
			const root = document.querySelector(".workspace-split.mod-root");
			if (!this.corner || !root) {
				return;
			}
			const r = root.getBoundingClientRect();
			const bar = document.querySelector(".status-bar");
			const barH = bar ? bar.getBoundingClientRect().height : 0;
			if (V.cornerSide === "left") {
				this.corner.style.left = `${Math.max(0, r.left) + 20}px`;
				this.corner.style.right = "auto";
			} else {
				this.corner.style.right = `${Math.max(0, window.innerWidth - r.right) + 20}px`;
			}
			if (V.cornerTop) {
				// under the tab header, like a game HUD in the top corner
				const head = root.querySelector(".workspace-tab-header-container");
				const top = head ? head.getBoundingClientRect().bottom : r.top;
				this.corner.style.top = `${top + 44}px`;
				this.corner.style.bottom = "auto";
			} else {
				this.corner.style.bottom = `${Math.max(0, window.innerHeight - r.bottom) + barH + 14}px`;
			}
		}
		updateHud() {
			const goal = Math.max(1, this.settings.dailyGoal);
			const pct = Math.min(1, this.data.added / goal);
			if (this.barFill) {
				this.barFill.style.setProperty("--cop-fill", String(pct));
				this.barText.setText(`${Math.round(pct * 100)}%  //  ${V.labels.barTotal} ${fmt(this.totalWords)}`);
			}
			if (this.corner) {
				V.updateCorner(this, this.corner, pct);
				this.updateMinimap();
			}
		}
		updateMinimap() {
			if (!this.corner || !V.minimap) {
				return;
			}
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			const box = this.corner.querySelector(".cop-minimap");
			if (!box) {
				return;
			}
			box.empty();
			if (!view || !view.file) {
				box.createDiv({ cls: "cop-minimap-empty", text: V.labels.noSignal || "No note" });
				return;
			}
			const cache = this.app.metadataCache.getFileCache(view.file);
			const heads = (cache && cache.headings) || [];
			const cursor = view.editor ? view.editor.getCursor().line : 0;
			const lines = Math.max(1, view.editor ? view.editor.lineCount() : 1);
			const sections = heads.length ? heads : [{ heading: view.file.basename, level: 1, position: { start: { line: 0 } } }];
			sections.forEach((h, i) => {
				const start = h.position.start.line;
				const end = i + 1 < sections.length ? sections[i + 1].position.start.line : lines;
				const room = box.createDiv({ cls: "cop-room" });
				room.style.setProperty("--cop-h", String(Math.max(0.04, (end - start) / lines)));
				room.style.setProperty("--cop-indent", String(Math.min(3, h.level - 1)));
				if (cursor >= start && cursor < end) {
					room.addClass("is-here");
				}
			});
		}

		/* ---- save feedback ---- */
		wrapSave() {
			const commands = this.app.commands && this.app.commands.commands;
			const save = commands && commands["editor:save-file"];
			if (!save || this.saveWrapped) {
				return;
			}
			const plugin = this;
			const original = {};
			for (const key of ["callback", "checkCallback", "editorCallback", "editorCheckCallback"]) {
				if (typeof save[key] !== "function") {
					continue;
				}
				original[key] = save[key];
				const isCheck = key === "checkCallback" || key === "editorCheckCallback";
				save[key] = function (...args) {
					const result = original[key].apply(this, args);
					const checking = isCheck && args[0] === true;
					if (!checking && (!isCheck || result !== false)) {
						plugin.onSave();
					}
					return result;
				};
			}
			this.saveWrapped = { save, original };
		}
		saveCommand() {
			const ran = this.app.commands.executeCommandById("editor:save-file");
			if (!ran || !this.saveWrapped) {
				this.onSave();
			}
		}
		onSave() {
			this.rollDay();
			this.data.saves += 1;
			this.saveSoon();
			if (this.data.saves === 1) {
				this.comms(V.lines.firstSave);
			}
			if (bodyHas("co-no-savefx")) {
				return;
			}
			const now = Date.now();
			if (now - this.lastSaveFx < 2500) {
				return;
			}
			this.lastSaveFx = now;
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			const host = (view && view.containerEl) || document.querySelector(".workspace-split.mod-root");
			if (host) {
				V.saveFx(this, host);
			}
		}

		/* ---- earpiece comms ---- */
		comms(text, force) {
			if (!text || bodyHas("co-no-comms")) {
				return;
			}
			const now = Date.now();
			if (!force && now - this.lastComms < 45000) {
				return;
			}
			this.lastComms = now;
			if (V.speak) {
				V.speak(this, text);
				return;
			}
			const frag = document.createDocumentFragment();
			const wrap = document.createElement("div");
			wrap.className = "cop-comms";
			const head = wrap.appendChild(document.createElement("div"));
			head.className = "cop-comms-head";
			if (V.labels.commsIcon) {
				icon(head, V.labels.commsIcon, "cop-comms-icon");
			} else {
				const wave = head.appendChild(document.createElement("span"));
				wave.className = "cop-wave";
				wave.setAttribute("aria-hidden", "true");
				for (let i = 0; i < 5; i++) {
					wave.appendChild(document.createElement("i"));
				}
			}
			head.appendChild(document.createTextNode(V.labels.caller));
			const body = wrap.appendChild(document.createElement("div"));
			body.className = "cop-comms-text";
			body.textContent = text;
			frag.appendChild(wrap);
			const notice = new Notice(frag, 5200);
			const el = notice.noticeEl || notice.messageEl;
			if (el) {
				el.addClass("cop-comms-notice");
			}
		}
	}

	/* ---- settings ---- */
	class WorldSettingTab extends PluginSettingTab {
		constructor(app, plugin) {
			super(app, plugin);
			this.plugin = plugin;
		}
		display() {
			const { containerEl } = this;
			const plugin = this.plugin;
			containerEl.empty();
			new Setting(containerEl).setName("Title screen").setHeading();
			new Setting(containerEl)
				.setName("Title")
				.setDesc("The title screen text. Leave empty to show the vault name.")
				.addText((text) =>
					text.setValue(plugin.settings.title).onChange(async (value) => {
						plugin.settings.title = value;
						await plugin.saveAll();
						plugin.setVaultVars();
						plugin.refresh();
					})
				);
			new Setting(containerEl)
				.setName("Daily word goal")
				.setDesc(`Fills the ${V.labels.goal.toLowerCase()} in the HUD.`)
				.addText((text) =>
					text.setValue(String(plugin.settings.dailyGoal)).onChange(async (value) => {
						const n = parseInt(value, 10);
						if (Number.isFinite(n) && n > 0) {
							plugin.settings.dailyGoal = n;
							await plugin.saveAll();
							plugin.updateHud();
						}
					})
				);
			new Setting(containerEl).setName("Menu").setHeading();
			containerEl.createEl("p", {
				cls: "setting-item-description",
				text: "Each entry opens a command (its id, for example graph:open), a note (note:Name) or your last note (@last). Visual switches live in Style Settings.",
			});
			plugin.settings.entries.forEach((entry, i) => {
				const s = new Setting(containerEl).setName(`Entry ${i + 1}`);
				s.addToggle((t) =>
					t.setValue(entry.show).onChange(async (v) => {
						entry.show = v;
						await plugin.saveAll();
						plugin.refresh();
					})
				);
				s.addText((t) =>
					t.setPlaceholder("Label").setValue(entry.label).onChange(async (v) => {
						entry.label = v;
						await plugin.saveAll();
						plugin.refresh();
					})
				);
				s.addText((t) =>
					t.setPlaceholder("Opens").setValue(entry.target).onChange(async (v) => {
						entry.target = v;
						await plugin.saveAll();
					})
				);
				s.addText((t) =>
					t.setPlaceholder("Description").setValue(entry.desc).onChange(async (v) => {
						entry.desc = v;
						await plugin.saveAll();
						plugin.refresh();
					})
				);
			});
			new Setting(containerEl).addButton((b) =>
				b.setButtonText("Restore the default menu").onClick(async () => {
					plugin.settings.entries = V.defaultEntries.map((e) => Object.assign({ show: true }, e));
					await plugin.saveAll();
					plugin.refresh();
					this.display();
				})
			);
		}
	}

	return WorldPlugin;
}

/* ======================================================================
   Clair Obscur: Expedition 33 shared plugin layer (both variations).
   Fan-made, not affiliated with Sandfall Interactive or Kepler Interactive. All art is original.
   Screens read from captures: docs/references/analysis.md
   ====================================================================== */

/* Arrow keys move between buttons, Home and End jump, 1-9 pick and run an entry. */
function menuKeys(view, container, buttons, onSelect, axis) {
	container.addEventListener("keydown", (evt) => {
		const back = axis === "x" ? ["ArrowLeft", "ArrowUp"] : ["ArrowUp", "ArrowLeft"];
		const next = axis === "x" ? ["ArrowRight", "ArrowDown"] : ["ArrowDown", "ArrowRight"];
		const now = Math.max(0, buttons.indexOf(container.ownerDocument.activeElement));
		let to = -1;
		if (back.includes(evt.key)) {
			to = (now - 1 + buttons.length) % buttons.length;
		} else if (next.includes(evt.key)) {
			to = (now + 1) % buttons.length;
		} else if (evt.key === "Home") {
			to = 0;
		} else if (evt.key === "End") {
			to = buttons.length - 1;
		} else if (/^[1-9]$/.test(evt.key) && buttons[Number(evt.key) - 1]) {
			evt.preventDefault();
			buttons[Number(evt.key) - 1].click();
			return;
		}
		if (to >= 0 && buttons[to]) {
			evt.preventDefault();
			buttons[to].focus();
		}
	});
	buttons.forEach((b, i) => {
		b.addEventListener("focus", () => onSelect(i));
		b.addEventListener("mouseenter", () => b.focus({ preventScroll: true }));
	});
}
/* Menu lines fade in one by one, as the captured menus do. */
function menuEnter(buttons, delay, dx) {
	if (reducedMotion()) {
		return;
	}
	buttons.forEach((b, i) => b.animate([{ opacity: 0, transform: `translate(${dx || 0}px, 8px)`, filter: "blur(2px)" }], { duration: 560, delay: (delay || 500) + i * 70, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" }));
}

/* Inline SVG art from ICONS, ids made unique so two copies never share gradients. */
function art(parent, name, cls) {
	const markup = ICONS["ui/" + name] || ICONS["scenes/" + name];
	const wrap = parent.createDiv({ cls: "cop-art " + (cls || ""), attr: { "aria-hidden": "true" } });
	if (!markup) {
		return wrap;
	}
	const uid = "a" + Math.random().toString(36).slice(2, 7);
	const node = svgNode(markup.replace(/id="([\w-]+)"/g, `id="${uid}-$1"`).replace(/url\(#([\w-]+)\)/g, `url(#${uid}-$1)`).replace(/href="#([\w-]+)"/g, `href="#${uid}-$1"`));
	if (node) {
		wrap.appendChild(node);
	}
	return wrap;
}
/* A baked image from the plugin's assets folder. */
function baked(parent, plugin, name, cls) {
	const img = parent.createEl("img", { cls: "cop-baked " + (cls || ""), attr: { alt: "", draggable: "false", decoding: "async", "aria-hidden": "true" } });
	img.addEventListener("error", () => img.addClass("is-missing"), { once: true });
	img.src = plugin.assetUrl(name);
	return img;
}

/* An overlay pinned over an element's box, so nothing in the note's layout moves. */
function overlayOn(host, cls) {
	if (!host) {
		return null;
	}
	const r = host.getBoundingClientRect();
	if (r.width < 2 || r.height < 2) {
		return null;
	}
	const el = document.body.createDiv({ cls, attr: { "aria-hidden": "true" } });
	Object.assign(el.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
	return el;
}
function activePane(plugin) {
	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	return view ? view.containerEl.querySelector(".view-content") : null;
}
const rootSplit = () => document.querySelector(".workspace-split.mod-root");

/* ---- petals: the Gommage, and the drift on the title screen ---- */
/* burst: petals tear off a box and blow away (a note erased). drop: a soft fall across the host. */
function petalFx(host, mode, opts) {
	const o = Object.assign({ ms: 1600, box: null }, opts || {});
	if (!host || reducedMotion() || bodyHas("co-no-petals")) {
		return null;
	}
	const box = host.getBoundingClientRect();
	if (box.width < 2 || box.height < 2) {
		return null;
	}
	const canvas = document.body.createEl("canvas", { cls: "cop-petalfx", attr: { "aria-hidden": "true" } });
	const ratio = Math.min(1.5, window.devicePixelRatio || 1);
	Object.assign(canvas.style, { left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px`, height: `${box.height}px` });
	canvas.width = Math.round(box.width * ratio);
	canvas.height = Math.round(box.height * ratio);
	const g = canvas.getContext("2d");
	g.setTransform(ratio, 0, 0, ratio, 0, 0);
	const W = box.width;
	const H = box.height;
	const n = Math.round((mode === "burst" ? 150 : 70) * (lowPower() ? 0.5 : 1));
	const cols = ["#d6283a", "#b01828", "#e8404e", "#7a0c18", "#f2e6d0"];
	const b = o.box || { x: W * 0.2, y: H * 0.3, w: W * 0.6, h: H * 0.3 };
	const ps = [];
	for (let i = 0; i < n; i++) {
		const burst = mode === "burst";
		ps.push({
			x: burst ? b.x + Math.random() * b.w : Math.random() * W,
			y: burst ? b.y + Math.random() * b.h : -20 - Math.random() * H * 0.5,
			vx: burst ? 1 + Math.random() * 4 : (Math.random() - 0.3) * 1.2,
			vy: burst ? -1.5 + Math.random() * 1.5 : 0.8 + Math.random() * 1.4,
			r: Math.random() * 6.28,
			vr: (Math.random() - 0.5) * 0.2,
			s: 4 + Math.random() * 6,
			c: cols[Math.floor(Math.random() * cols.length)],
			d: burst ? Math.random() * 0.35 : 0,
		});
	}
	const start = performance.now();
	let last = start;
	const frame = (t) => {
		const k = (t - start) / o.ms;
		if (k >= 1 || !canvas.isConnected) {
			canvas.remove();
			return;
		}
		const dt = Math.min(3, (t - last) / 16.7);
		last = t;
		g.clearRect(0, 0, W, H);
		const fade = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1;
		for (const p of ps) {
			if (k < p.d) {
				continue;
			}
			p.vx += 0.04 * dt;
			p.vy += (mode === "burst" ? -0.02 : 0.01) * dt;
			p.x += p.vx * dt + Math.sin(t / 300 + p.r) * 0.6;
			p.y += p.vy * dt;
			p.r += p.vr * dt;
			g.save();
			g.translate(p.x, p.y);
			g.rotate(p.r);
			g.globalAlpha = 0.9 * fade;
			g.fillStyle = p.c;
			g.beginPath();
			g.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2);
			g.fill();
			g.restore();
		}
		window.requestAnimationFrame(frame);
	};
	window.requestAnimationFrame(frame);
	return canvas;
}

/* ---- dialogue: the speaker's name in small caps, the line below, bottom left ---- */
/* Lines are written "Speaker|Line"; a line without a speaker belongs to the Expedition. */
function dialogue(text) {
	if (!text) {
		return;
	}
	const [who, line] = text.includes("|") ? text.split("|") : ["Expedition 33", text];
	document.querySelectorAll(".cop-dialogue").forEach((e) => e.remove());
	const el = document.body.createDiv({ cls: "cop-dialogue", attr: { role: "status", "aria-live": "polite" } });
	el.createDiv({ cls: "cop-dialogue-name", text: who });
	el.createDiv({ cls: "cop-dialogue-line", text: line });
	el.createDiv({ cls: "cop-dialogue-next", text: "Next ▸" });
	const hold = Math.min(7000, 2800 + line.length * 45);
	window.setTimeout(() => el.addClass("is-leaving"), hold);
	window.setTimeout(() => el.remove(), hold + 600);
}

/* ---- the parry, calm: a soft gold ring breathes out once, "Parry" settles in, the autosave ring turns ---- */
function parryFx(plugin, host) {
	document.querySelectorAll(".cop-parry, .cop-autosave").forEach((e) => e.remove());
	const still = reducedMotion();
	if (!bodyHas("co-no-savefx")) {
		const el = overlayOn(host, "cop-parry");
		if (el && bodyHas("co-parry-classic")) {
			// the classic v3.1 effect, unchanged
			if (!still) {
				el.createDiv({ cls: "cop-parry-ring" });
			}
			el.createDiv({ cls: "cop-parry-word", text: "Parry" });
			window.setTimeout(() => el.remove(), still ? 700 : 1300);
		} else if (el) {
			// "Parry it!": two gold glints meet at the centre (blade meets blade), the ring breathes out,
			// "Parry" settles, "it!" lands a beat later over a gold rule drawn outward from the centre
			el.addClass("is-parry-it");
			if (!still) {
				el.createDiv({ cls: "cop-parry-glint is-left" });
				el.createDiv({ cls: "cop-parry-glint is-right" });
				el.createDiv({ cls: "cop-parry-ring" });
			}
			const word = el.createDiv({ cls: "cop-parry-word cop-parry-itword" });
			word.createSpan({ cls: "cop-parry-p", text: "Parry" });
			word.createSpan({ cls: "cop-parry-it", text: "it!" });
			el.createDiv({ cls: "cop-parry-rule" });
			window.setTimeout(() => el.remove(), still ? 900 : 1450);
		}
	}
	autosaveRing();
	// three saves in quick succession: the fandom's favourite mishearing
	plugin.saveTimes = (plugin.saveTimes || []).filter((t) => Date.now() - t < 9000).concat([Date.now()]);
	if (plugin.saveTimes.length >= 3) {
		plugin.saveTimes = [];
		plugin.comms("Expedition 33|Parry it! (No, not Harriet.)", true);
	}
}
function autosaveRing() {
	const ring = document.body.createDiv({ cls: "cop-autosave", attr: { "aria-hidden": "true" } });
	ring.createSpan({ cls: "cop-autosave-ring" });
	ring.createSpan({ text: "Save in progress…" });
	window.setTimeout(() => ring.addClass("is-leaving"), 1400);
	window.setTimeout(() => ring.remove(), 1900);
}

/* ---- the Gommage save: petals rise from a bottom corner to the opposite top corner ---- */
function petalSweep(plugin, host) {
	autosaveRing();
	if (!host || reducedMotion() || bodyHas("co-no-savefx") || bodyHas("co-no-petals")) {
		return;
	}
	const box = host.getBoundingClientRect();
	if (box.width < 2 || box.height < 2) {
		return;
	}
	plugin.sweepDir = plugin.sweepDir === 1 ? -1 : 1; // alternate: bottom left -> top right, then bottom right -> top left
	const dir = plugin.sweepDir;
	const canvas = document.body.createEl("canvas", { cls: "cop-petalfx", attr: { "aria-hidden": "true" } });
	const ratio = Math.min(1.5, window.devicePixelRatio || 1);
	Object.assign(canvas.style, { left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px`, height: `${box.height}px` });
	canvas.width = Math.round(box.width * ratio);
	canvas.height = Math.round(box.height * ratio);
	const g = canvas.getContext("2d");
	g.setTransform(ratio, 0, 0, ratio, 0, 0);
	const W = box.width;
	const H = box.height;
	const x0 = dir > 0 ? -40 : W + 40;
	const x1 = dir > 0 ? W + 60 : -60;
	const y0 = H + 30; // the petals rise, as in the Gommage
	const y1 = -30;
	const lp = lowPower() ? 0.5 : 1;
	const cols = ["#d6283a", "#b01828", "#e8404e", "#8a1020", "#f2e6d0"];
	const petals = [];
	// a wide band across the page: about 60 % of the diagonal, perpendicular to the flow
	const dxp = x1 - x0;
	const dyp = y1 - y0;
	const len = Math.hypot(dxp, dyp);
	const nx = -dyp / len;
	const ny = dxp / len;
	const band = len * 0.6;
	const n = Math.round(230 * lp);
	for (let i = 0; i < n; i++) {
		const d = Math.random() * 0.55; // staggered launches make a flowing ribbon
		const spread = Math.random() - 0.5;
		petals.push({ d, spread, s: 4 + Math.random() * 6, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.18, c: cols[Math.floor(Math.random() * cols.length)], wob: Math.random() * 6.28, speed: 0.75 + Math.random() * 0.5 });
	}
	const ms = 2000;
	const start = performance.now();
	const frame = (now) => {
		const k = (now - start) / ms;
		if (k >= 1 || !canvas.isConnected) {
			canvas.remove();
			return;
		}
		g.clearRect(0, 0, W, H);
		for (const p of petals) {
			const t = (k - p.d) * 1.6 * p.speed;
			if (t <= 0 || t >= 1.15) {
				continue;
			}
			const along = Math.min(1.1, t);
			const x = x0 + (x1 - x0) * along + Math.sin(t * 9 + p.wob) * 18 + nx * p.spread * band;
			const y = y0 + (y1 - y0) * along + Math.cos(t * 7 + p.wob) * 14 + ny * p.spread * band;
			g.save();
			g.translate(x, y);
			g.rotate(p.r + t * 8 * p.vr * 10);
			g.globalAlpha = Math.min(1, t * 6) * Math.min(1, (1.15 - t) * 4) * 0.9;
			g.fillStyle = p.c;
			g.beginPath();
			g.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2);
			g.fill();
			g.restore();
		}
		window.requestAnimationFrame(frame);
	};
	window.requestAnimationFrame(frame);
}

/* Undo is a dodge: a sideways blur streak and the word. */
function dodgeFx(plugin, host) {
	const now = Date.now();
	if (now - (plugin.lastDodge || 0) < 380 || reducedMotion() || bodyHas("co-no-dodge")) {
		return;
	}
	plugin.lastDodge = now;
	document.querySelectorAll(".cop-dodge").forEach((e) => e.remove());
	const el = overlayOn(host, "cop-dodge");
	if (el) {
		el.createDiv({ cls: "cop-dodge-word", text: "Dodge" });
		window.setTimeout(() => el.remove(), 700);
	}
}
/* A brush stroke of paint sweeps across and away (switching worlds, opening a note from a jump). */
function paintWipe(host, tone) {
	if (reducedMotion() || bodyHas("co-no-wipe")) {
		return;
	}
	const el = overlayOn(host, `cop-wipe is-${tone || "ink"}`);
	if (el) {
		el.createDiv({ cls: "cop-wipe-stroke" });
		window.setTimeout(() => el.remove(), 1300);
	}
}

/* ---- VICTORY: the daily goal is reached. Today's figures, and We Continue. ---- */
function victoryScreen(plugin) {
	if (bodyHas("co-no-victory") || document.querySelector(".cop-victory")) {
		return;
	}
	const d = plugin.data;
	const el = document.body.createDiv({ cls: "cop-victory", attr: { role: "dialog", "aria-label": "Victory" } });
	const head = el.createDiv({ cls: "cop-victory-head" });
	head.createDiv({ cls: "cop-victory-title", text: "Victory" });
	const loot = head.createDiv({ cls: "cop-victory-loot" });
	loot.createSpan({ text: "Battle loot" });
	loot.createSpan({ cls: "cop-victory-loot-n", text: `${fmt(d.added)} words` });
	const xp = el.createDiv({ cls: "cop-victory-xp" });
	xp.createDiv({ cls: "cop-victory-xp-n", text: `${fmt(d.added)} XP` });
	xp.createDiv({ cls: "cop-victory-xp-sub", text: `Day ${d.streak || 1} of the Expedition` });
	const grid = el.createDiv({ cls: "cop-victory-grid" });
	const now = new Date();
	for (const [k, v] of [
		["Damage dealt", fmt(d.added)],
		["Successful parries", fmt(d.saves || 0)],
		["Notes painted", fmt(d.createdToday || 0)],
		["Words in all", fmt(plugin.totalWords)],
		["Days in a row", fmt(d.streak || 0)],
		["Time", now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })],
	]) {
		const r = grid.createDiv({ cls: "cop-victory-row" });
		r.createSpan({ cls: "cop-victory-k", text: k });
		r.createSpan({ cls: "cop-victory-v", text: v });
	}
	const go = el.createEl("button", { cls: "cop-victory-go", attr: { type: "button" } });
	go.createSpan({ cls: "cop-key", text: "↵" });
	go.createSpan({ text: "We Continue" });
	closeOnKey(plugin, el, go);
}
/* EXPEDITION FAILED: a streak is broken. Thin red lines draw in; then, Tomorrow comes. */
function failedScreen(plugin) {
	if (bodyHas("co-no-victory") || document.querySelector(".cop-failed")) {
		return;
	}
	const el = document.body.createDiv({ cls: "cop-failed", attr: { role: "dialog", "aria-label": "Expedition failed" } });
	const lines = el.createDiv({ cls: "cop-failed-lines", attr: { "aria-hidden": "true" } });
	for (let i = 0; i < 22; i++) {
		const l = lines.createDiv({ cls: "cop-failed-line" });
		l.style.setProperty("--x", `${(i / 21) * 100}%`);
		l.style.setProperty("--h", `${30 + ((i * 37) % 50)}%`);
		l.style.setProperty("--t", `${(i % 2 ? 0 : 1) * (8 + ((i * 13) % 20))}%`);
		l.style.setProperty("--d", `${(i % 7) * 60}ms`);
	}
	el.createDiv({ cls: "cop-failed-title", text: "Expedition Failed" });
	el.createDiv({ cls: "cop-failed-sub", text: "Tomorrow comes." });
	const go = el.createEl("button", { cls: "cop-victory-go", attr: { type: "button" } });
	go.createSpan({ cls: "cop-key", text: "↵" });
	go.createSpan({ text: "We Continue" });
	closeOnKey(plugin, el, go);
}
function closeOnKey(plugin, el, button) {
	const shown = Date.now();
	const still = reducedMotion();
	const close = (evt) => {
		if (Date.now() - shown < 700) {
			return; // a key already held down should not skip the screen
		}
		if (evt && evt.type === "keydown") {
			evt.preventDefault();
			evt.stopPropagation();
		}
		document.removeEventListener("keydown", close, true);
		el.addClass("is-leaving");
		window.setTimeout(() => el.remove(), still ? 0 : 500);
	};
	document.addEventListener("keydown", close, true);
	el.addEventListener("click", close);
	button.addEventListener("click", close);
	window.setTimeout(() => button.isConnected && button.focus({ preventScroll: true }), 750);
	plugin.register(() => {
		document.removeEventListener("keydown", close, true);
		el.remove();
	});
}
/* Screens wait until the pen rests, so they never eat a typed letter. */
function queueScreen(plugin, key, fn) {
	plugin.data.coShown = plugin.data.coShown || [];
	if (plugin.data.coShown.includes(key)) {
		return;
	}
	plugin.data.coShown.push(key);
	plugin.data.coShown = plugin.data.coShown.slice(-40);
	plugin.saveSoon();
	plugin.pendingScreens = (plugin.pendingScreens || []).concat([fn]);
}
function flushScreens(plugin) {
	if (!plugin.pendingScreens || !plugin.pendingScreens.length || document.querySelector(".cop-victory, .cop-failed")) {
		return;
	}
	if (Date.now() - (plugin.lastTyped || 0) < 2500 || document.hidden) {
		return;
	}
	plugin.pendingScreens.shift()(plugin);
}

/* ---- Pause: the slanted plates at the top left over the frozen note; the journal beside them ---- */
class PauseModal extends Modal {
	constructor(plugin) {
		super(plugin.app);
		this.plugin = plugin;
	}
	onOpen() {
		const p = this.plugin;
		this.containerEl.addClass("cop-pause-wrap");
		this.modalEl.addClass("cop-pause");
		const x = this.modalEl.querySelector(".modal-close-button, .modal-header-button");
		if (x) {
			x.remove();
		}
		const body = this.contentEl;
		const list = body.createDiv({ cls: "cop-pause-menu", attr: { role: "navigation" } });
		const journal = body.createDiv({ cls: "cop-pause-journal" });
		journal.createDiv({ cls: "cop-pause-journal-head", text: "Expedition journal" });
		const pct = Math.min(1, p.data.added / Math.max(1, p.settings.dailyGoal));
		const bar = journal.createDiv({ cls: "cop-pause-hp" });
		bar.createDiv({ cls: "cop-pause-hp-fill" }).style.setProperty("--cop-fill", String(pct));
		const figs = journal.createDiv({ cls: "cop-pause-figures" });
		for (const [k, v] of [
			["Today", `${fmt(p.data.added)} / ${fmt(p.settings.dailyGoal)} words`],
			["Days in a row", fmt(p.data.streak || 0)],
			["Parries today", fmt(p.data.saves || 0)],
			["Words in all", fmt(p.totalWords)],
		]) {
			const r = figs.createDiv({ cls: "cop-pause-fig" });
			r.createSpan({ cls: "cop-pause-k", text: k });
			r.createSpan({ cls: "cop-pause-v", text: v });
		}
		journal.createDiv({ cls: "cop-pause-motto", text: "For those who come after." });
		const go = (fn) => () => {
			this.close();
			window.setTimeout(fn, 60);
		};
		const items = [
			["Resume", () => this.close()],
			["Today", go(() => void p.runEntry({ target: "daily-notes" }))],
			["Map", go(() => void p.runEntry({ target: "graph:open" }))],
			["Commands", go(() => void p.runEntry({ target: "command-palette:open" }))],
			["Save", go(() => p.saveCommand())],
			["Return to Title Screen", go(() => void p.openTitle())],
		];
		const buttons = items.map(([label, fn]) => {
			const b = list.createEl("button", { cls: "cop-pause-item", attr: { type: "button" } });
			b.createSpan({ cls: "cop-pause-diamond", attr: { "aria-hidden": "true" } });
			b.createSpan({ text: label });
			b.addEventListener("click", fn);
			return b;
		});
		menuKeys(this, list, buttons, (i) => buttons.forEach((b, k) => b.toggleClass("is-selected", k === i)), "y");
		menuEnter(buttons, 60, -24);
		window.setTimeout(() => buttons[0] && buttons[0].focus(), 30);
	}
	onClose() {
		this.contentEl.empty();
	}
}

/* ---- the HUD: a party plate at the bottom right. Diamond emblem, health = today's words, AP = days in a row. ---- */
function buildPlate(plugin, corner, name) {
	corner.addClass("is-co");
	const plate = corner.createDiv({ cls: "cop-plate" });
	const gem = plate.createDiv({ cls: "cop-plate-gem" });
	art(gem, "flag", "cop-plate-icon");
	const right = plate.createDiv({ cls: "cop-plate-right" });
	right.createDiv({ cls: "cop-plate-name", text: name });
	const hp = right.createDiv({ cls: "cop-plate-hp" });
	hp.createDiv({ cls: "cop-plate-hp-fill" });
	const row = right.createDiv({ cls: "cop-plate-row" });
	const ap = row.createDiv({ cls: "cop-plate-ap" });
	for (let i = 0; i < 9; i++) {
		ap.createDiv({ cls: "cop-plate-pip" });
	}
	row.createDiv({ cls: "cop-plate-num" });
}
function updatePlate(plugin, corner, pct) {
	const fill = corner.querySelector(".cop-plate-hp-fill");
	if (fill) {
		fill.style.setProperty("--cop-fill", String(pct));
	}
	const lit = Math.min(9, plugin.data.streak || 0);
	corner.querySelectorAll(".cop-plate-pip").forEach((p, i) => p.toggleClass("is-lit", i < lit));
	const num = corner.querySelector(".cop-plate-num");
	if (num) {
		num.setText(`${fmt(plugin.data.added)} / ${fmt(plugin.settings.dailyGoal)}`);
	}
}

/* ---- wiring shared by both variations ---- */
function worldFx(plugin) {
	plugin.addCommand({ id: "pause", name: "Pause", callback: () => new PauseModal(plugin).open() });
	plugin.registerDomEvent(document, "keydown", (evt) => {
		if (evt.key === "Enter" && document.querySelector(".prompt")) {
			plugin.jumpAt = Date.now();
		}
		const undo = (evt.ctrlKey || evt.metaKey) && !evt.shiftKey && !evt.altKey && evt.key.toLowerCase() === "z";
		const t = evt.target;
		if (undo && t instanceof HTMLElement && t.closest(".cm-editor")) {
			dodgeFx(plugin, t.closest(".view-content"));
		}
	}, true);
	plugin.registerDomEvent(document, "click", (evt) => {
		if (evt.target instanceof HTMLElement && evt.target.closest(".prompt .suggestion-item")) {
			plugin.jumpAt = Date.now();
		}
	}, true);
	plugin.screenTimer = window.setInterval(() => flushScreens(plugin), 1500);
	plugin.register(() => window.clearInterval(plugin.screenTimer));
}
const SHARED_HOOKS = {
	open(plugin) {
		if (Date.now() - (plugin.jumpAt || 0) < 2500) {
			plugin.jumpAt = 0;
			window.requestAnimationFrame(() => paintWipe(activePane(plugin), "ink"));
		}
	},
	world(plugin, from, to) {
		paintWipe(rootSplit(), `to-${to}`);
	},
	gain(plugin, kind, value) {
		if (kind === "goal") {
			queueScreen(plugin, `victory:${today()}`, victoryScreen);
		} else if (kind === "streak") {
			const prev = plugin.data.coPrevStreak || 0;
			plugin.data.coPrevStreak = value;
			if (value === 1 && prev >= 2) {
				queueScreen(plugin, `failed:${today()}`, failedScreen);
			}
		}
	},
	delete(plugin) {
		// the Gommage: the pane flakes into petals
		const pane = activePane(plugin) || rootSplit();
		if (pane) {
			const r = pane.getBoundingClientRect();
			petalFx(pane, "burst", { ms: 1900, box: { x: r.width * 0.15, y: r.height * 0.15, w: r.width * 0.6, h: r.height * 0.5 } });
		}
	},
	unload() {
		document.querySelectorAll(".cop-dialogue, .cop-parry, .cop-autosave, .cop-dodge, .cop-wipe, .cop-victory, .cop-failed, .cop-petalfx").forEach((e) => e.remove());
	},
};

/* The cast's lines (each checked against a published quote list; see docs/references/analysis.md). */
const CAST = {
	firstSave: "Maelle|Parry it!",
	goal: "Gustave|We'll break the cycle.",
	cold: "Monoco|Sometimes I wish things could go back to how they were before.",
	noLast: "Gustave|For those who come after.",
	milestone: [
		"Maelle|Time to spill some ink.",
		"Esquie|Wheeee!",
		"Sophie|Stubborn people change the world.",
		"Monoco|My, what lovely feet.",
		"Esquie|The Whee balances out the Whoo.",
		"Esquie|Men trip not on mountains; they stumble upon stones.",
		"Gustave|Learn from the ones that came before.",
	],
	deleted: ["Expedition 33|When one falls, we continue.", "Esquie|Losing a rock is better than never having a rock."],
};

/* ---- the area title: name over a rule at the top left, the objective below with a diamond ---- */
function areaTitle(plugin, card, file, parent) {
	card.addClass("is-co");
	const plate = card.createDiv({ cls: "cop-area" });
	plate.createDiv({ cls: "cop-area-name", text: file.basename });
	plate.createDiv({ cls: "cop-area-rule" });
	const obj = plate.createDiv({ cls: "cop-area-obj" });
	obj.createSpan({ cls: "cop-area-gem", attr: { "aria-hidden": "true" } });
	const text = obj.createSpan({ text: parent });
	if (plugin && plugin.openTasks) {
		plugin.openTasks(file, 1).then((tasks) => {
			if (tasks && tasks.length && tasks[0].text) {
				text.setText(tasks[0].text);
			}
		});
	}
}

/* ======================================================================
   CLAIR OBSCUR -> one companion, three styles:
   Lumière at night (royal), the Gommage (painted), Expedition 33 (painted camp under the glowing 33).
   The command menu is a set of diamond tiles after the game's Pictos, Lumina and skill tree,
   in three layouts (lattice, arc, row with caption) chosen in Style Settings.
   ====================================================================== */

let E33_PLUGIN = null;
const isPainted = (world) => world === "gommage" || world === "expedition";

/* ---- quotes: a staple at the foot of every title screen ---- */
const QUOTES = [
	["For those who come after.", "The Expedition's motto"],
	["When one falls, we continue.", "The Expeditioners' oath"],
	["Tomorrow comes.", "The send-off"],
	["Learn from the ones that came before.", "The Expedition"],
	["We'll break the cycle.", "Gustave"],
	["Stubborn people change the world.", "Sophie"],
	["Time to spill some ink.", "Maelle"],
	["Men trip not on mountains; they stumble upon stones.", "Esquie"],
	["Losing a rock is better than never having a rock.", "Esquie"],
	["The Whee balances out the Whoo.", "Esquie"],
];
function titleQuote(view) {
	const plugin = view.plugin;
	let line;
	let credit = "";
	if (bodyHas("co-quote-fixed")) {
		line = cssVar("--co-quote-text", "").replace(/^["']|["']$/g, "").trim() || QUOTES[0][0];
		const known = QUOTES.find((q) => q[0] === line);
		credit = known ? known[1] : "";
	} else {
		let i = Math.floor(Math.random() * QUOTES.length);
		if (i === plugin.lastQuote) {
			i = (i + 1) % QUOTES.length;
		}
		plugin.lastQuote = i;
		[line, credit] = QUOTES[i];
	}
	const q = view.contentEl.createDiv({ cls: "cop-quote" });
	q.createDiv({ cls: "cop-quote-line", text: line });
	if (credit) {
		q.createDiv({ cls: "cop-quote-credit", text: credit });
	}
}

/* ---- the diamond command tiles ---- */
const iconFor = (target) => {
	const t = target || "";
	if (t === "@last") return "flag";
	if (t.startsWith("graph")) return "compass";
	if (t.startsWith("command-palette")) return "sparkle";
	if (t.startsWith("daily")) return "flower";
	if (t.startsWith("switcher")) return "page";
	if (t.includes("new-file")) return "quill";
	return "diamond";
};
const menuLayout = () => (bodyHas("co-menu-arc") ? "arc" : bodyHas("co-menu-row") ? "row" : "lattice");

/* Tile positions in units of the tile size T (x right, y down), for a group of n tiles.
   side: 0 = a centred group under the title; -1 / 1 = a column beside the Expedition emblem (left / right). */
function tilePositions(n, layout, side) {
	const out = [];
	if (side && n > 4) {
		// all tiles on one side: two staggered columns, so the group never outgrows the screen
		for (let j = 0; j < n; j++) {
			const col = j % 2;
			const row = Math.floor(j / 2);
			out.push([col * 1.3 + (layout === "arc" ? -Math.abs(row - (Math.ceil(n / 2) - 1) / 2) * 0.35 : 0), row * 1.34 + col * (layout === "row" ? 0 : 0.67)]);
		}
		return out;
	}
	if (side) {
		// a column hugging the emblem: on a circle around it (arc), zig-zag (lattice) or straight (row)
		for (let j = 0; j < n; j++) {
			const m = j - (n - 1) / 2;
			if (layout === "arc") {
				const a = (m / Math.max(1, (n - 1) / 2)) * 0.62;
				out.push([side * (Math.cos(a) - 1) * 2.4, Math.sin(a) * 2.9]);
			} else if (layout === "lattice") {
				out.push([side * (j % 2 ? 0.62 : 0), m * 1.22]);
			} else {
				out.push([0, m * 1.42]);
			}
		}
		return out;
	}
	if (layout === "arc") {
		for (let j = 0; j < n; j++) {
			const a = ((j - (n - 1) / 2) / Math.max(1, (n - 1) / 2)) * 0.7;
			out.push([Math.sin(a) * 6, (1 - Math.cos(a)) * 6 * 0.55]);
		}
	} else if (layout === "row") {
		for (let j = 0; j < n; j++) {
			out.push([(j - (n - 1) / 2) * 1.32, 0]);
		}
	} else {
		const top = Math.ceil(n / 2);
		for (let j = 0; j < n; j++) {
			const row = j < top ? 0 : 1;
			const k = row ? j - top : j;
			const count = row ? n - top : top;
			out.push([(k - (count - 1) / 2) * 1.5 + (row && count === top ? 0.75 : 0), row * 1.32]);
		}
	}
	return out;
}

/* Build one or two groups of tiles in host; returns the buttons in reading order. */
function diamondMenu(view, host, groups) {
	const plugin = view.plugin;
	const entries = plugin.entries();
	const layout = menuLayout();
	host.toggleClass("has-row", layout === "row");
	const caption = host.createDiv({ cls: "cop-dm-caption" });
	const capName = caption.createDiv({ cls: "cop-dm-caption-name" });
	const capDesc = caption.createDiv({ cls: "cop-dm-caption-desc" });
	const buttons = [];
	let index = 0;
	for (const g of groups) {
		const group = host.createDiv({ cls: `cop-dm-group is-${layout} ${g.cls || ""}`, attr: { role: "navigation" } });
		const slice = entries.slice(index, index + g.count);
		const pos = tilePositions(slice.length, layout, g.side || 0);
		const xs = pos.map((p) => p[0]);
		const ys = pos.map((p) => p[1]);
		const minX = Math.min(...xs);
		const minY = Math.min(...ys);
		group.style.setProperty("--w", String(Math.max(...xs) - minX + 1));
		group.style.setProperty("--h", String(Math.max(...ys) - minY + 1));
		slice.forEach((e, k) => {
			const b = group.createEl("button", { cls: "cop-dm-tile", attr: { type: "button" } });
			b.style.setProperty("--x", String(pos[k][0] - minX));
			b.style.setProperty("--y", String(pos[k][1] - minY));
			const gem = b.createSpan({ cls: "cop-dm-gem", attr: { "aria-hidden": "true" } });
			art(gem, iconFor(e.target), "cop-dm-icon");
			b.createSpan({ cls: "cop-dm-key", text: String(index + k + 1) });
			b.createSpan({ cls: "cop-dm-label", text: e.label });
			b.addEventListener("click", () => {
				plugin.jumpAt = Date.now();
				view.run(e);
			});
			buttons.push(b);
		});
		index += slice.length;
	}
	const select = (i) => {
		view.selected = i;
		buttons.forEach((b, k) => b.toggleClass("is-selected", k === i));
		capName.setText(entries[i] ? entries[i].label : "");
		capDesc.setText(entries[i] ? entries[i].desc || "" : "");
	};
	if (!entries.length) {
		host.createDiv({ cls: "cop-obj-empty", text: "Nothing to choose. Show some entries in the plugin settings." });
	}
	if (!reducedMotion()) {
		buttons.forEach((b, i) => b.animate([{ opacity: 0, transform: "scale(.85)" }], { duration: 520, delay: 600 + i * 70, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" }));
	}
	menuKeys(view, host, buttons, select, "x");
	select(Math.min(view.selected, Math.max(0, entries.length - 1)));
	view.focusSoon(buttons[view.selected]);
	return buttons;
}

/* Lumière: CLAIR OBSCUR over a hairline, the name in brushed gold, the diamonds beneath. */
function lumiereMenu(view, frame) {
	frame.prepend(createDiv({ cls: "cop-co-kicker", text: "Clair Obscur" }));
	const n = view.plugin.entries().length;
	diamondMenu(view, frame.createDiv({ cls: "cop-dm-host" }), [{ count: n }]);
}

/* The Gommage: the name brushed in gold on the painted canvas, a stroke of paint, petals drifting away. */
function gommageMenu(view, frame) {
	frame.createDiv({ cls: "cop-gm-stroke", attr: { "aria-hidden": "true" } });
	const n = view.plugin.entries().length;
	diamondMenu(view, frame.createDiv({ cls: "cop-dm-host" }), [{ count: n }]);
}

/* Expedition 33: the area title top left, the emblem dead centre with its reflection, the moon; diamonds beside the emblem. */
function expeditionMenu(view, frame) {
	const plugin = view.plugin;
	const root = view.contentEl;
	// the moon is screened straight onto the backdrop, so it sits outside the emblem's layer
	root.createDiv({ cls: "cop-e33-moon", attr: { "aria-hidden": "true" } });
	const sky = root.createDiv({ cls: "cop-e33-sky", attr: { "aria-hidden": "true" } });
	const em = sky.createDiv({ cls: "cop-e33-emblem" });
	art(em, "emblem", "cop-e33-art");
	const re = sky.createDiv({ cls: "cop-e33-reflect" });
	art(re, "emblem", "cop-e33-art");
	sky.createDiv({ cls: "cop-e33-ripple" });
	const obj = createDiv({ cls: "cop-exp-obj" });
	obj.createSpan({ cls: "cop-area-gem", attr: { "aria-hidden": "true" } });
	const objText = obj.createSpan({ text: "Lay the trail, for the ones who come after." });
	frame.querySelector(".cop-subline")?.after(obj);
	const last = plugin.lastNote();
	if (last) {
		plugin.openTasks(last, 1).then((t) => t && t.length && t[0].text && objText.setText(t[0].text));
	}
	const n = plugin.entries().length;
	const host = root.createDiv({ cls: "cop-dm-host is-e33" });
	if (bodyHas("co-e33-right")) {
		host.addClass("no-left");
		diamondMenu(view, host, [{ count: n, side: 1, cls: "is-right" }]);
	} else {
		const left = Math.ceil(n / 2);
		diamondMenu(view, host, [{ count: left, side: -1, cls: "is-left" }, { count: n - left, side: 1, cls: "is-right" }]);
	}
}

const VARIANT = {
	key: "e33",
	name: "Clair Obscur Expedition 33 Companion",
	viewType: "clairobscur-title",
	themeId: "clairobscur",
	otherId: "",
	icon: "flower",
	defaultWorld: "lumiere",
	noClock: true,
	backdrop: (world) => world,
	speak: (plugin, text) => dialogue(text),
	worlds: {
		lumiere: { place: "Lumière", ambience: "none", switchLine: "Expedition 33|Once a year, the Paintress wakes and paints upon her monolith." },
		gommage: { place: "The Gommage", ambience: "petals", switchLine: "Expedition 33|When one falls, we continue." },
		expedition: { place: "Camp", ambience: "none", switchLine: "Gustave|Learn from the ones that came before." },
	},
	tallyTitle: "Expedition journal",
	labels: {
		goal: "Health (daily goal)",
		streak: "AP (days in a row)",
		total: "Words in all",
		saves: "Parries today",
		barMeter: "HP",
		barTotal: "WORDS",
		caller: "Expedition 33",
		commsIcon: "flower",
		saveCommand: "Save (parry it)",
		cardCommand: "Show the area title",
		tallyCommand: "Open the expedition journal",
		noSignal: "No area",
	},
	lines: CAST,
	defaultEntries: [
		{ label: "Continue", target: "@last", desc: "Back to where you left off. Opens your last note." },
		{ label: "Map", target: "graph:open", desc: "Every page and how they connect. Opens the graph." },
		{ label: "Commands", target: "command-palette:open", desc: "Every command at hand. Opens the command palette." },
		{ label: "Today", target: "daily-notes", desc: "Today's page of the journal. Opens the daily note." },
		{ label: "Items", target: "switcher:open", desc: "Reach for any page you carry. Opens the quick switcher." },
		{ label: "New page", target: "file-explorer:new-file", desc: "Lay the trail for those who come after. Creates a note." },
	],
	minimap: false,

	titleIn(view, mark) {
		if (reducedMotion() || typeof mark.animate !== "function") {
			return;
		}
		const world = view.plugin.world();
		if (world === "gommage") {
			mark.animate([{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }, { clipPath: "inset(0 0 0 0)", opacity: 1 }], { duration: 1400, easing: "cubic-bezier(.3,.6,.2,1)", fill: "backwards" });
		} else if (world === "expedition") {
			mark.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, easing: "ease", fill: "backwards" });
		} else {
			mark.animate([{ opacity: 0, letterSpacing: ".3em", filter: "blur(5px)" }, { opacity: 1, letterSpacing: ".08em", filter: "blur(0)" }], { duration: 1600, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
		}
	},

	renderMenu(view, frame) {
		const world = view.plugin.world();
		view.contentEl.toggleClass("is-painted", isPainted(world));
		if (world === "gommage") {
			gommageMenu(view, frame);
		} else if (world === "expedition") {
			expeditionMenu(view, frame);
		} else {
			lumiereMenu(view, frame);
		}
		titleQuote(view);
	},

	/* The area title, bottom left: the note's name over a rule, its first open task as the objective, all on one centre axis. */
	fillCard(card, file, parent) {
		areaTitle(E33_PLUGIN, card, file, parent);
		card.toggleClass("is-painted", E33_PLUGIN ? isPainted(E33_PLUGIN.world()) : false);
	},

	buildCorner(plugin, corner) {
		buildPlate(plugin, corner, "Expedition 33");
	},
	updateCorner(plugin, corner, pct) {
		updatePlate(plugin, corner, pct);
	},
	/* Saving: petals sweep across in the Gommage; a calm parry elsewhere. */
	saveFx(plugin, host) {
		if (plugin.world() === "gommage") {
			petalSweep(plugin, host);
		} else {
			parryFx(plugin, host);
		}
	},

	hooks: Object.assign({}, SHARED_HOOKS, {
		ready(plugin) {
			E33_PLUGIN = plugin;
			plugin.lastTyped = Date.now();
			worldFx(plugin);
		},
		typing(plugin) {
			plugin.lastTyped = Date.now();
		},
	}),
};

module.exports = makePlugin(VARIANT);
