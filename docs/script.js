const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbytBzooXxJI45BAAm-nuvVGriHGDdSuBjVcX2PK1n9xL81n5wGlCsWmSTKwRYHn4hjN/exec';

document.addEventListener('DOMContentLoaded', () => {
    // 開発中の場合は一旦ダミーデータを使いたい場合はここをコメントアウトしてテストできます
    if (GAS_API_URL === 'YOUR_GAS_WEB_APP_URL_HERE') {
        document.getElementById('loading').innerHTML = '<p style="color:red">GAS_API_URL が設定されていません。script.jsを編集してください。</p>';
        return;
    }

    fetch(GAS_API_URL)
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                renderNotices(result.data.notices);
                renderPresidents(result.data.presidents);
                renderHistory(result.data.history);
                renderSchedules(result.data.schedules);
                
                // ローディングを隠してコンテンツを表示
                document.getElementById('loading').style.display = 'none';
                document.getElementById('content').style.display = 'block';
            } else {
                console.error('API Error:', result.message);
                document.getElementById('loading').innerHTML = '<p style="color:red">データの読み込みに失敗しました。</p>';
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            document.getElementById('loading').innerHTML = '<p style="color:red">通信エラーが発生しました。</p>';
        });
});

function renderNotices(notices) {
    if (!notices || notices.length === 0) return;
    
    const container = document.getElementById('notices-container');
    let html = '<div class="notice-bar"><div class="notice-bar-inner">';
    
    notices.forEach(notice => {
        let deadlineStr = '';
        if (notice['表示期限']) {
            const d = new Date(notice['表示期限']);
            if (!isNaN(d.getTime())) {
                deadlineStr = `${d.getMonth() + 1}月${d.getDate()}日`;
            }
        }
        
        html += `
            <div class="notice-item">
                <span class="notice-badge">お知らせ</span>
                <div>
                    <div class="notice-title">${escapeHtml(notice['タイトル'])}</div>
                    ${notice['内容'] ? `<div class="notice-body">${escapeHtml(notice['内容'])}</div>` : ''}
                </div>
                ${deadlineStr ? `<span class="notice-deadline">${deadlineStr}まで</span>` : ''}
            </div>
        `;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
}

function renderPresidents(presidents) {
    const container = document.getElementById('presidents-grid');
    if (!presidents || presidents.length === 0) {
        container.innerHTML = '<p>データがありません</p>';
        return;
    }

    let html = '';
    presidents.forEach(p => {
        const thumbUrl = driveThumbUrl(p['顔写真のDriveファイルID']);
        html += `
            <div class="card">
                ${thumbUrl ? `<img src="${thumbUrl}" alt="写真" class="card-img">` : `<div class="card-img" style="background:#e9ecef;display:flex;align-items:center;justify-content:center;color:#6c757d">No Image</div>`}
                <div class="card-body">
                    <div class="card-title">${escapeHtml(p['お名前'])}</div>
                    <div class="card-meta">第${escapeHtml(p['代'])}代 (${escapeHtml(p['就任年'])}年就任)</div>
                    ${p['ひとこと'] ? `<div class="card-text">"${escapeHtml(p['ひとこと'])}"</div>` : ''}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderHistory(history) {
    const container = document.getElementById('history-timeline');
    if (!history || history.length === 0) {
        container.innerHTML = '<p>データがありません</p>';
        return;
    }

    let html = '';
    history.forEach(h => {
        html += `
            <div class="timeline-item">
                <div class="year">${escapeHtml(h['年度'])}</div>
                <div class="content">
                    <div class="event-title">${escapeHtml(h['出来事'])}</div>
                    ${h['詳細'] ? `<div class="event-detail">${escapeHtml(h['詳細'])}</div>` : ''}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderSchedules(schedules) {
    const container = document.getElementById('schedules-list');
    if (!schedules || schedules.length === 0) {
        container.innerHTML = '<p>予定はありません</p>';
        return;
    }

    let html = '';
    schedules.forEach(s => {
        let dateStr = '';
        if (s['日付']) {
            const d = new Date(s['日付']);
            if (!isNaN(d.getTime())) {
                const days = ['日', '月', '火', '水', '木', '金', '土'];
                dateStr = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`;
            }
        }

        html += `
            <div class="event">
                <div class="date">${dateStr}</div>
                <div class="title">${escapeHtml(s['イベント名'])}</div>
                ${s['場所'] ? `<div class="place">📍 ${escapeHtml(s['場所'])}</div>` : ''}
            </div>
        `;
    });
    container.innerHTML = html;
}

// ユーティリティ関数
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function driveThumbUrl(fileId, size = 400) {
    if (!fileId) return '';
    return 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w' + size;
}
