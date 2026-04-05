(function() {
    // 模块名称，用于存储设置
    const MODULE_NAME = "wi_organizer_v1";

    // 1. 获取或初始化设置（存放在酒馆本地）
    function getSettings() {
        if (!window.extension_settings) window.extension_settings = {};
        if (!window.extension_settings[MODULE_NAME]) {
            window.extension_settings[MODULE_NAME] = {
                customCategories: [], // 格式: {id: '123', name: '我的分类'}
                collapsed: {}         // 格式: {id: true/false}
            };
        }
        return window.extension_settings[MODULE_NAME];
    }

    // 2. 核心渲染函数
    function renderOrganizer() {
        // 如果已经渲染过，且面板还在，就不重复渲染
        if ($('#st-wi-org-panel').length > 0) return;

        // 寻找注入位置：世界书编辑器的容器
        const $target = $('#world_info_contents, .world-info-editor').first();
        if ($target.length === 0) return;

        const settings = getSettings();
        const currentWI = window.selected_character_world_info || "未绑定任何世界书";

        // 构建 HTML 结构
        let html = `
            <div id="st-wi-org-panel" style="background: rgba(0,0,0,0.4); border: 1px solid #555; padding: 12px; margin: 10px; border-radius: 8px; font-family: sans-serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <strong style="color: #f0ad4e; font-size: 16px;">🗂️ 世界书分类管理</strong>
                    <button id="wi-btn-add" class="menu_button" style="font-size:12px; padding:2px 8px;">+ 新建分类</button>
                </div>

                ${renderCategoryBox("⭐ 当前角色绑定", `📖 ${currentWI}`, "auto_main", false)}

                <div id="wi-custom-container">
                    ${settings.customCategories.map(cat => renderCategoryBox(`📂 ${cat.name}`, "暂无内容 (仅展示标题)", cat.id, true)).join('')}
                </div>

                ${renderCategoryBox("📚 全部库", "请在下方原生列表中查看详情", "auto_all", false)}
            </div>
        `;

        $target.prepend(html);
        bindEvents();
    }

    // 生成单个分类方框的 HTML
    function renderCategoryBox(title, subtext, id, canEdit) {
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
                </div>
                <div class="wi-cat-body" style="padding: 8px 12px; font-size: 13px; color: #ccc; display: ${isCollapsed ? 'none' : 'block'}; background: rgba(255,255,255,0.05);">
                    ${subtext}
                </div>
            </div>
        `;
    }

    // 3. 事件绑定
    function bindEvents() {
        const settings = getSettings();

        // A. 点击折叠/展开
        $('.wi-cat-header').off('click').on('click', function(e) {
            if ($(e.target).hasClass('wi-cat-rename') || $(e.target).hasClass('wi-cat-del')) return;
            
            const id = $(this).parent().data('id');
            settings.collapsed[id] = !settings.collapsed[id];
            $(this).next('.wi-cat-body').toggle();
            // 刷新箭头
            const isNowCollapsed = settings.collapsed[id];
            const titleSpan = $(this).find('.wi-cat-title');
            titleSpan.text((isNowCollapsed ? '▶ ' : '▼ ') + titleSpan.text().substring(2));
        });

        // B. 新建分类
        $('#wi-btn-add').off('click').on('click', () => {
            const name = prompt("请输入新分类的名称：");
            if (name && name.trim()) {
                settings.customCategories.push({ id: 'cat_' + Date.now(), name: name.trim() });
                refreshUI();
            }
        });

        // C. 重命名分类
        $('.wi-cat-rename').off('click').on('click', function() {
            const id = $(this).closest('.wi-cat-item').data('id');
            const cat = settings.customCategories.find(c => c.id === id);
            const newName = prompt("重新命名分类：", cat.name);
            if (newName && newName.trim()) {
                cat.name = newName.trim();
                refreshUI();
            }
        });

        // D. 删除分类
        $('.wi-cat-del').off('click').on('click', function() {
            const id = $(this).closest('.wi-cat-item').data('id');
            if (confirm("确定要删除这个分类吗？")) {
                settings.customCategories = settings.customCategories.filter(c => c.id !== id);
                refreshUI();
            }
        });
    }

    function refreshUI() {
        $('#st-wi-org-panel').remove();
        renderOrganizer();
    }

    // 4. 定时检测器：确保面板打开时能加载 UI
    setInterval(renderOrganizer, 1000);

    console.log("✅ [世界书分类器] 完整逻辑已加载成功！");
})();
