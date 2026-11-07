/*==========================================================================
 NLM_MetallicText.js
----------------------------------------------------------------------------
 (C)2026 NoLimits
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0  2026/11/06 初稿
============================================================================*/

/*:
 * @target MZ
 * @plugindesc メタリックテキスト・プラグイン（v1.0.0）
 * @author ノリミツ (NoLimits)
 * @url https://github.com/nolimits-tukool
 * 
 * @param stripeInc
 * @text 縞模様の間隔
 * @desc 金属調の暗い部分の縞模様の間隔ドット（デフォルト：10）
 * @type number
 * @min 1
 * @default 10
 * 
 * @param stripeAlpha
 * @text 暗部アルファ
 * @desc 縞模様の暗部のアルファ（0-255、デフォルト：130）　　　　（値が小さいほど黒化するがフォントが太いと透過する時あり)
 * @type number
 * @max 255
 * @default 130
 * 
 * @help
 * 
 * 【RPGツクールMZ用プラグイン】
 * 全てのテキスト文字に金属調グラデーションをつけます
 * 
 * 　UIで独自性を出したい時や、SFスチームパンク系ゲームを作る時などに使えるかも
 * 知れません
 * 
 * プラグインコマンドはありません
 * 利用規約はMITライセンスの通りです
 * 実験用に作成したものなので、自由に改造して頂いて構いません
 * 
 * 
 * （MV利用者のみへの補足）
 * 　MVでも一応動作しますが、文字幅調整が行なわれると、なぜかグラデーションが
 * 外れてしまう謎仕様があります
 */

(() => {
    "use strict";

    const pluginName = "NLM_MetallicText";
    const NMTXparam  = PluginManager.parameters(pluginName);

    Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align, tr) {
        const context = this.context;
        const alpha = context.globalAlpha;
        maxWidth = maxWidth || 0xffffffff;
        let tx = x;
        let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
        if (align === "center") {
            tx += maxWidth / 2;
        }
        if (align === "right") {
            tx += maxWidth;
        }
        context.save();
        context.font = this._makeFontNameText();
        context.textAlign = align;
        context.textBaseline = "alphabetic";
        context.globalAlpha = 1;
        this._drawTextOutline(text, tx, ty, maxWidth);
        context.globalAlpha = alpha;
        this._drawTextBody(text, tx, ty, maxWidth, tr);
        context.restore();
        this._baseTexture.update();
    }; // core.js の写し（trのみ追加）

    const _Bitmap_drawTextBody = Bitmap.prototype._drawTextBody;
    Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth, tr) {
        if (tr) {
            _Bitmap_drawTextBody.apply(this, arguments);
        } else { // trがtrueでない時、金属調グラデーションをつける
            const context = this.context;
            const h   = Graphics.height;
            const inc = Number(NMTXparam.stripeInc)   || 10;
            const dec = Number(NMTXparam.stripeAlpha) || 0;
            const alp = dec.toString(16).padStart(2, "0");
            const grd = context.createLinearGradient(0, 0, 0, h);
            const gColor = this.textColor + alp;
            for (let i = 0; i < h - inc * 2; i += inc * 2) {
                grd.addColorStop( i      / h, this.textColor);
                grd.addColorStop((i+inc) / h, gColor);
            }
            context.fillStyle = grd;
            context.fillText(text, tx, ty, maxWidth);
        }
    };
})();
