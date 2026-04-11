<template>
  <section class="guide">
    <h2 class="guide__heading">中獎發票領取方式</h2>

    <h3 class="guide__method">方式1：財政部ＡＰＰ領獎</h3>
    <ol class="guide__steps">
      <li>
        <strong>步驟一：下載ＡＰＰ</strong>
        <p>手機下載ＡＰＰ「統一發票兌獎」(財政部印刷廠)</p>
      </li>
      <li><strong>步驟二：申請手機載具並登入</strong></li>
      <li>
        <strong>步驟三：設定領款帳號</strong>
        <p>請於「系統設定」→「個人資料設定」→「領款資料」(右下角)，填寫帳戶資訊</p>
      </li>
      <li>
        <strong>步驟四：掃描中獎發票</strong>
        <p>請於「我要領獎」→「快速領獎」(下方) → 掃描中獎發票</p>
      </li>
    </ol>

    <h3 class="guide__method">方式２：非金融機構領取</h3>
    <p>
      依照我國財政部的公告，若你中了六獎（200元）、五獎（1000元）、雲端發票百元獎（500或800元），可以到下方介紹的非金融機構地點，進行發票獎金兌換，如：
    </p>
    <ul class="guide__list">
      <li>全家便利商店（FamilyMart）</li>
      <li>統一超商（7-Eleven）</li>
      <li>萊爾富便利商店</li>
      <li>全聯福利中心</li>
      <li>OK超商</li>
      <li>美廉社</li>
    </ul>
    <ol class="guide__steps">
      <li>
        <strong>步驟一：</strong>
        <p>
          將下載的 PDF 檔上傳至 7-11 的 ibon 列印，上傳網址為
          <a href="https://print.ibon.com.tw/ibonprinter" target="_blank">
            https://print.ibon.com.tw/ibonprinter
          </a>
          ，上傳後會取得 QR Code，請先截圖後，可至 7-11 ibon 列印發票，需使用雙面列印
        </p>
      </li>
      <li>
        <strong>步驟二：</strong>
        <p>列印的發票請帶身份證至非金融機構地點兌換</p>
      </li>
    </ol>

    <h3 class="guide__method">方式３：2026 統一發票領獎地點（銀行等金融機構）</h3>
    <p>
      同樣根據財政部的規定，若你中了六獎（200元）、五獎（1,000元）、四獎（4,000元）、三獎（1萬元）、二獎（4萬元）、頭獎（20萬元）、特獎（200萬元）、特別獎（1,000萬元）、雲端發票百元獎（500或800元）、雲端發票千元獎（2,000元）、雲端發票百萬元獎（100萬元），可以至以下金融機構進行發票領獎，如：
    </p>
    <ul class="guide__list">
      <li>彰化銀行</li>
      <li>第一銀行</li>
      <li>全國農業金庫</li>
      <li>農會／漁會信用部及信用合作社</li>
    </ul>
    <ol class="guide__steps">
      <li>
        <strong>步驟一：</strong>
        <p>
          將下載的 PDF 檔上傳至 7-11 的 ibon 列印，上傳網址為
          <a href="https://print.ibon.com.tw/ibonprinter" target="_blank">
            https://print.ibon.com.tw/ibonprinter
          </a>
          ，上傳後會取得 QR Code，請先截圖後，可至 7-11 ibon 列印發票，需使用雙面列印
        </p>
      </li>
      <li>
        <strong>步驟二：</strong>
        <p>列印的發票請帶身份證至金融機構地點兌換</p>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.guide { border-top: 1px solid #ccc; padding-top: 24px; }
.guide__heading { font-size: 1.2rem; font-weight: 700; color: #333; margin-bottom: 20px; }
.guide__method { font-size: 1rem; font-weight: 700; color: #333; margin-top: 20px; margin-bottom: 8px; }
.guide__steps { padding-left: 24px; margin-bottom: 12px; line-height: 1.8; }
.guide__steps li { margin-bottom: 6px; }
.guide__steps p { font-weight: 400; margin-top: 2px; }
.guide__list { padding-left: 24px; margin: 8px 0 12px; line-height: 1.8; }
.guide a { color: #1565c0; word-break: break-all; }
</style>
