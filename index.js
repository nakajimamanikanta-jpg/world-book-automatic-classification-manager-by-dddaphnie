(function() {
    console.log("🚀 [世界书分类器] 正在尝试启动...");

    const MODULE_NAME = "wi_organizer_final";

    function getSettings() {
        if (!window.extension_settings) window.extension_settings = {};
        if (!window.extension_settings[MODULE_NAME]) {
            window.extension_settings[MODULE_NAME] = { customCategories: [], collapsed: {} };
        }
        return window.extension_settings[MODULE_NAME];
    }

    function injectUI() {
        // 如果已经有了就不再刷了
        if (document.getElementById('st-wi-org-panel')) return;

        // 尝试寻找酒馆世界书面板的几个可能容器
        const $target = $('#world_info_contents, .world-info-editor, #world_info_window').first();
        
        if ($target.length > 0 && $target.is(':visible')) {
            console.log("🎯 [世界书分类器] 找到目标容器，开始注入 UI...");
            
            const settings = getSettings();
            const currentWI = window.selected_character_world_info || "未检测到绑定";

            const html = `
                <div id="st-wi-org-panel" style="background: rgba(0,0,0,0.6); border: 2px solid #f0ad4e; padding: 15px; margin: 10px; border-radius: 10px; color: white; z-index: 9999;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <strong style="color: #f0ad4e; font-size: 16px;">🗂️ 世界书分类管理</strong>
                        <button id="wi-btn-add-new" style="background:#444; color:white; border:1px solid #777; padding:2px 10px; cursor:pointer;">+ 新建分类</button>
                    </div>
                    <div style="background:rgba(255,255,255,0.1); padding:8px; border-radius:5px; margin-bottom:5px;">
                        ⭐ 角色绑定：${currentWI}
                    </div>
                    <div id="custom-cats-list">
                        ${settings.customCategories.map(cat => `
                            <div style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid #333;">
                                <span>📂 ${cat.name}</span>
                                <span class="del-cat" data-id="${cat.id}" style="cursor:pointer; color:#ff4d4d;">🗑️</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            $target.prepend(html);

            // 绑定新建事件
            $('#wi-btn-add-new').on('click', function() {
                const name = prompt("请输入分类名称：");
                if (name) {
                    settings.customCategories.push({ id: Date.now(), name: name });
                    $('#st-wi-org-panel').remove();
                    injectUI();
                }
            });

            // 绑定删除事件
            $('.del-cat').on('click', function() {
                const id = $(this).data('id');
                settings.customCategories = settings.customCategories.filter(c => c.id != id);
                $('#st-wi-org-panel').remove();
                injectUI();
            });
        }
    }

    // 每秒狂刷一次检测，直到面板出来为止
    setInterval(injectUI, 1000);
    console.log("✅ [世界书分类器] 逻辑挂载完成，等待面板打开...");
})();
