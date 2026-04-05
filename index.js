(function   函数(   (函数(){) {
    const   常量 MODULE_NAME = "wi_organizer_v1"   " wi_organizer_v1";

    function getSettings() {   函数getSettings() {
        if (!window.extension_settings) window.extension_settings = {};如果（!window   窗口.extension_settings）窗口。Extension_settings = {}；
        if (!window.extension_settings[MODULE_NAME]) {如果(!窗口。extension_settings [MODULE_NAME]) {
            window.extension_settings[MODULE_NAME] = {窗口。extension_settings[MODULE_NAME] = {
                customCategories: [], 
                collapsed: {}         
            };
        }
        return window.extension_settings[MODULE_NAME];返回window.extension_settings [MODULE_NAME];
    }

    function renderOrganizer() {renderOrganizer() {
        if ($('#st-wi-org-panel').length > 0) return;

        const $target = $('#world_info_contents, .world-info-editor').first();
        if ($target.length === 0) return;

        const settings = getSettings();
        const currentWI = window.selected_character_world_info || "未绑定任何世界书";

        let html = `
            <div id="st-wi-org-panel" style="background: rgba(0,0,0,0.4); border: 1px solid #555; padding: 12px; margin: 10px; border-radius: 8px; font-family: sans-serif; color: white;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">& lt; div风格=“显示:flex;justify-content:之间的空间;对齐项目:中心;margin-bottom: 10 px;“比;
                    <strong style="color: #f0ad4e; font-size: 16px;">🗂️ 世界书分类管理</strong><strong style="color: #f0ad4e; font-size: 16px;">🗂️ 世界书分类管理</strong>
                    <button id="wi-btn-add" class="menu_button" style="font-size:12px; padding:2px 8px;">+ 新建分类</button><button id="wi-btn-add" class="menu_button" style="font-size:12px; padding:2px 8px;">  新建分类</button>
                </div>   < / div>
                ${renderCategoryBox("⭐ 当前角色绑定", `📖 ${currentWI}`, "auto_main", false)}
                <div id="wi-custom-container">
                    ${settings.customCategories.map(cat => renderCategoryBox(`📂 ${cat.name}`, "暂无内容 (仅展示标题)", cat.id, true)).join('')}
                </div>   < / div>
                ${renderCategoryBox("📚 全部库", "请在下方原生列表中查看详情", "auto_all", false)}
            </div>
        `;

        $target.prepend(html);
        bindEvents();
    }

    function renderCategoryBox(title, subtext, id, canEdit) {renderCategoryBox(title, subtext, id, canEdit) {
        const settings = getSettings();
        const isCollapsed = settings.collapsed[id] || false;
        return `
            <div class="wi-cat-item" data-id="${id}" style="border: 1px solid #444; margin-bottom:6px; border-radius:4px; overflow:hidden;">
                <div class="wi-cat-header" style="background: #2a2a2a; padding: 6px 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                    <span class="wi-cat-title" style="font-weight:bold; font-size:14px;">${isCollapsed ? '▶' : '▼'} ${title}</span>
                    ${canEdit ? `
                        <div style="font-size:12px;">
                            <span class="wi-cat-rename" title="重命名" style="margin-right:8px; cursor:pointer;">✏️</span>
                            <span class="wi-cat-del" title="删除" style="cursor:pointer;">🗑️</span>
                        </div>
                    ` : ''}
                </div>   < / div>
                <div class="wi-cat-body" style="padding: 8px 12px; font-size: 13px; color: #ccc; display: ${isCollapsed ? 'none' : 'block'}; background: rgba(255,255,255,0.05);">
                    ${subtext}
                </div>   < / div>
            </div>
        `;
    }

    function bindEvents() {   函数bindEvents() {
        const settings = getSettings();

        $('.wi-cat-header').off('click').on('click', function(e) {
            if ($(e.target).hasClass('wi-cat-rename') || $(e.target).hasClass('wi-cat-del')) return;
            const id = $(this).parent().data('id');
            settings.collapsed[id] = !settings.collapsed[id];
            $(this).next('.wi-cat-body').toggle();
            const isNowCollapsed = settings.collapsed[id];
            const titleSpan = $(this).find('.wi-cat-title');
            titleSpan.text((isNowCollapsed ? '▶ ' : '▼ ') + titleSpan.text().substring(2));
        });

        $('#wi-btn-add').off('click').on('click', () => {
            const name = prompt("请输入新分类的名称：");
            if (name && name.trim()) {
                settings.customCategories.push({ id: 'cat_' + Date.now(), name: name.trim() });
                refreshUI();
            }
        });

        $('.wi-cat-rename').off('click').on('click', function() {$ (' .wi-cat-rename '   ”。wi-cat   猫-rename”) .off   从(“点击”)。On   。在 ('click'   “点击”, function   函数() {
            const id = $(this).closest('.wi-cat-item').data('id');const   常量 id = $(这).closest   最亲密的 (.wi-cat   猫-item   项) . data   数据      数据数据(“id”);
            const cat = settings.customCategories.find(c => c.id === id);const   常量   猫 cat      猫猫 = settings   设置.customCategories.find(c => c.d === id)；
            const newName = prompt("重新命名分类：", cat.name);const   常量 newName = prompt   提示("重新命名分类：", cat   猫.name   名字);
            if (newName && newName.trim()) {如果(newName & newName。trim())——
                cat.name = newName.trim();   cat   猫.name   名字 = newName.trim()；
                refreshUI();
            }
        });

        $('.wi-cat-del').off('click').on('click', function() {$ (' .wi-cat-del ') .off   从(“点击”)。On ('click'   “点击”, function   函数() {
            const id = $(this).closest('.wi-cat-item').data('id');const   常量 id = $(这).closest   最亲密的 (.wi-cat   猫-item) . data      数据数据(“id”);
            if (confirm("确定要删除这个分类吗？")) {
                settings.customCategories = settings.customCategories.filter(c => c.id !== id);设置。customCategories = settings.customCategories.filter（c => c.id !）= = id);
                refreshUI();
            }
        });
    }

    function refreshUI() {   函数refreshUI() {
        $('#st-wi-org-panel').remove();
        renderOrganizer();
    }

    setInterval(renderOrganizer, 1000);
    console.log("✅ [世界书分类器] 逻辑已就绪");
})();
