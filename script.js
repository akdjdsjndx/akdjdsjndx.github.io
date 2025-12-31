// script.js - 异物表档案库交互脚本

/**
 * 1. 卡片悬停动画与点击效果
 * 为主页的档案卡片添加视觉反馈
 */
function initializeCardInteractions() {
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) return;

    cards.forEach(card => {
        // 鼠标悬停时轻微上浮并加深阴影
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
            // 为Keter级档案添加红色边框提示
            if (this.querySelector('.card-content').innerHTML.includes('Keter')) {
                this.style.borderTop = '4px solid #e74c3c';
            }
        });

        // 鼠标离开时恢复原状
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            // 恢复原有边框色
            if (this.querySelector('.card-content').innerHTML.includes('Keter')) {
                this.style.borderTop = '4px solid #8b0000';
            }
        });

        // 点击卡片时的反馈（跳转前）
        card.addEventListener('click', function(e) {
            // 防止误触链接内的其他元素
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            
            const link = this.querySelector('.card-link');
            if (link) {
                // 添加点击反馈
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                // 可以在这里添加其他效果，如声音
            }
        });
    });
}

/**
 * 2. 滚动时页面元素的淡入效果
 * 用于档案详情页的章节内容
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.description-box, .warning-box, .info-table, .schedule-item, .logic-item, .feature-item');
    
    if (animatedElements.length === 0) return;

    // 创建观察器来监控元素是否进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口时添加淡入类
                entry.target.classList.add('fade-in-visible');
                // 可选：停止观察已动画过的元素以提升性能
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // 元素出现10%时触发
        rootMargin: '0px 0px -50px 0px' // 底部提前50px触发
    });

    // 为每个元素添加初始状态并开始观察
    animatedElements.forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });
}

/**
 * 3. 档案分类筛选功能
 * 为主页添加按等级、状态等筛选卡片的能力
 */
function initializeFiltering() {
    const filterContainer = document.querySelector('.card-container');
    if (!filterContainer) return;

    // 创建筛选按钮组（可添加到页面现有标题下方）
    const filterButtons = [
        { label: '全部', filter: 'all' },
        { label: 'Euclid级', filter: 'euclid' },
        { label: 'Keter级', filter: 'keter' },
        { label: '待定', filter: 'pending' }
    ];

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'filter-buttons';
    buttonContainer.style.cssText = 'text-align: center; margin: 20px 0;';

    filterButtons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.label;
        button.className = 'filter-btn';
        button.setAttribute('data-filter', btn.filter);
        button.style.cssText = 'margin: 5px; padding: 8px 16px; background: #2a2a4a; color: #e0e0e0; border: 1px solid #444; border-radius: 4px; cursor: pointer; transition: all 0.3s;';
        button.addEventListener('mouseenter', () => {
            button.style.background = '#3a3a5a';
        });
        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('active')) {
                button.style.background = '#2a2a4a';
            }
        });
        button.addEventListener('click', () => {
            // 更新按钮状态
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.style.background = '#2a2a4a';
                b.style.borderColor = '#444';
            });
            button.classList.add('active');
            button.style.background = '#8b0000';
            button.style.borderColor = '#8b0000';
            
            // 执行筛选
            filterCards(btn.filter);
        });
        buttonContainer.appendChild(button);
    });

    // 将筛选按钮插入到卡片容器前
    filterContainer.parentNode.insertBefore(buttonContainer, filterContainer);

    // 默认激活“全部”按钮
    buttonContainer.querySelector('.filter-btn').click();

    // 筛选函数
    function filterCards(filter) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const levelText = card.querySelector('.meta-info').textContent;
            const shouldShow = 
                filter === 'all' ||
                (filter === 'euclid' && levelText.includes('Euclid')) ||
                (filter === 'keter' && levelText.includes('Keter')) ||
                (filter === 'pending' && levelText.includes('待定'));
            
            if (shouldShow) {
                card.style.display = 'block';
                // 触发重排以允许后续动画
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

/**
 * 4. 返回顶部按钮
 * 为长页面（如档案详情页）提供便捷的返回顶部功能
 */
function initializeBackToTop() {
    // 仅当页面足够长时添加此功能
    if (document.body.scrollHeight < 1500) return;

    const backBtn = document.createElement('button');
    backBtn.id = 'back-to-top';
    backBtn.innerHTML = '↑';
    backBtn.title = '返回顶部';
    backBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(139, 0, 0, 0.8);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s, transform 0.3s, background 0.3s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(backBtn);

    // 滚动显示/隐藏按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backBtn.style.opacity = '1';
            backBtn.style.transform = 'translateY(0)';
        } else {
            backBtn.style.opacity = '0';
            backBtn.style.transform = 'translateY(20px)';
        }
    });

    // 点击返回顶部
    backBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 鼠标悬停效果
    backBtn.addEventListener('mouseenter', () => {
        backBtn.style.background = 'rgba(200, 0, 0, 0.9)';
        backBtn.style.transform = 'translateY(0) scale(1.1)';
    });
    backBtn.addEventListener('mouseleave', () => {
        backBtn.style.background = 'rgba(139, 0, 0, 0.8)';
        backBtn.style.transform = 'translateY(0) scale(1)';
    });
}

/**
 * 5. 档案内容类型切换器（实验记录、附录等）
 * 用于档案详情页，切换查看不同部分内容
 */
function initializeContentToggler() {
    const sections = document.querySelectorAll('.content-section > section');
    if (sections.length < 3) return; // 仅当有足够多章节时启用

    // 创建切换器容器
    const togglerContainer = document.createElement('div');
    togglerContainer.className = 'content-toggler';
    togglerContainer.style.cssText = `
        position: sticky;
        top: 20px;
        background: rgba(18, 18, 32, 0.9);
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        z-index: 100;
        backdrop-filter: blur(5px);
        border: 1px solid #2a2a4a;
    `;

    const togglerTitle = document.createElement('h3');
    togglerTitle.textContent = '📖 档案导航';
    togglerTitle.style.cssText = 'margin-top: 0; margin-bottom: 10px; color: #8ab4f8; font-size: 1.1em;';
    togglerContainer.appendChild(togglerTitle);

    // 为每个主要章节创建按钮
    sections.forEach((section, index) => {
        const titleElement = section.querySelector('h2, h3');
        if (!titleElement) return;
        
        const button = document.createElement('button');
        button.textContent = titleElement.textContent.replace(/[📝⚠️🔒🔄📋✨🕸️]/g, '').trim();
        button.className = 'section-toggle-btn';
        button.setAttribute('data-section-index', index);
        button.style.cssText = `
            display: block;
            width: 100%;
            text-align: left;
            margin: 5px 0;
            padding: 8px 12px;
            background: transparent;
            color: #aaa;
            border: none;
            border-left: 3px solid transparent;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 0 4px 4px 0;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.color = '#fff';
            button.style.background = 'rgba(74, 108, 248, 0.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('active')) {
                button.style.color = '#aaa';
                button.style.background = 'transparent';
            }
        });
        
        button.addEventListener('click', () => {
            // 滚动到对应章节
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // 更新按钮状态
            document.querySelectorAll('.section-toggle-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.style.color = '#aaa';
                btn.style.borderLeftColor = 'transparent';
            });
            button.classList.add('active');
            button.style.color = '#8ab4f8';
            button.style.borderLeftColor = '#8ab4f8';
        });
        
        togglerContainer.appendChild(button);
    });

    // 将导航插入到第一个章节之前
    if (sections[0]) {
        sections[0].parentNode.insertBefore(togglerContainer, sections[0]);
    }

    // 监听滚动，高亮当前章节
    const sectionButtons = document.querySelectorAll('.section-toggle-btn');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);
                const correspondingButton = document.querySelector(`.section-toggle-btn[data-section-index="${index}"]`);
                if (correspondingButton) {
                    sectionButtons.forEach(btn => {
                        btn.classList.remove('active');
                        btn.style.color = '#aaa';
                        btn.style.borderLeftColor = 'transparent';
                    });
                    correspondingButton.classList.add('active');
                    correspondingButton.style.color = '#8ab4f8';
                    correspondingButton.style.borderLeftColor = '#8ab4f8';
                }
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
}

/**
 * 6. 主题切换功能（明亮/暗黑模式）
 * 允许用户在两种视觉主题间切换
 */
function initializeThemeSwitcher() {
    // 仅当有多个档案页面时提供此功能
    const themeSwitcher = document.createElement('div');
    themeSwitcher.id = 'theme-switcher';
    themeSwitcher.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
    `;

    const themeButton = document.createElement('button');
    themeButton.id = 'theme-toggle';
    themeButton.innerHTML = '🌙';
    themeButton.title = '切换主题';
    themeButton.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(30, 30, 50, 0.8);
        color: white;
        border: 1px solid #444;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s;
        backdrop-filter: blur(5px);
    `;

    themeSwitcher.appendChild(themeButton);
    document.body.appendChild(themeSwitcher);

    // 检查是否有保存的主题偏好
    const currentTheme = localStorage.getItem('archive-theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeButton.innerHTML = '☀️';
    }

    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            themeButton.innerHTML = '☀️';
            localStorage.setItem('archive-theme', 'light');
        } else {
            themeButton.innerHTML = '🌙';
            localStorage.setItem('archive-theme', 'dark');
        }
    });
}

/**
 * 7. 页面加载动画
 * 显示加载状态，提升用户体验
 */
function initializeLoadingAnimation() {
    // 仅当页面内容较多时显示加载动画
    if (document.querySelectorAll('.archive-card, .card').length < 2) return;

    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a14;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: opacity 0.5s;
    `;

    const loader = document.createElement('div');
    loader.className = 'archive-loader';
    loader.style.cssText = `
        width: 60px;
        height: 60px;
        border: 5px solid rgba(139, 0, 0, 0.3);
        border-top: 5px solid #8b0000;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    `;

    const loadingText = document.createElement('p');
    loadingText.textContent = '异物表档案加载中...';
    loadingText.style.cssText = 'color: #aaa; font-size: 14px;';

    loadingOverlay.appendChild(loader);
    loadingOverlay.appendChild(loadingText);
    document.body.appendChild(loadingOverlay);

    // 添加旋转动画关键帧
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // 页面加载完成后淡出
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 500);
        }, 500);
    });
}

/**
 * 8. 字体大小调整功能
 * 为档案详情页提供阅读便利性
 */
function initializeFontSizeControls() {
    // 仅档案详情页添加此功能
    if (!document.querySelector('.archive-card')) return;

    const controls = document.createElement('div');
    controls.id = 'font-size-controls';
    controls.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        background: rgba(18, 18, 32, 0.8);
        border-radius: 8px;
        padding: 10px;
        z-index: 1000;
        display: flex;
        gap: 10px;
        border: 1px solid #2a2a4a;
        backdrop-filter: blur(5px);
    `;

    const decreaseBtn = document.createElement('button');
    decreaseBtn.innerHTML = 'A⁻';
    decreaseBtn.title = '减小字体';
    decreaseBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(42, 42, 68, 0.9);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
    `;

    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = 'A⸰';
    resetBtn.title = '重置字体';
    resetBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(42, 42, 68, 0.9);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
    `;

    const increaseBtn = document.createElement('button');
    increaseBtn.innerHTML = 'A⁺';
    increaseBtn.title = '增大字体';
    increaseBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(42, 42, 68, 0.9);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
    `;

    controls.appendChild(decreaseBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(increaseBtn);
    document.body.appendChild(controls);

    // 字体大小调整逻辑
    let currentFontSize = 100; // 百分比基准

    decreaseBtn.addEventListener('click', () => {
        if (currentFontSize > 70) {
            currentFontSize -= 10;
            updateFontSize();
        }
    });

    resetBtn.addEventListener('click', () => {
        currentFontSize = 100;
        updateFontSize();
    });

    increaseBtn.addEventListener('click', () => {
        if (currentFontSize < 150) {
            currentFontSize += 10;
            updateFontSize();
        }
    });

    function updateFontSize() {
        const contentElement = document.querySelector('.content-section') || document.querySelector('.container');
        if (contentElement) {
            contentElement.style.fontSize = `${currentFontSize}%`;
        }
        // 保存用户偏好
        localStorage.setItem('archive-font-size', currentFontSize);
    }

    // 加载保存的字体大小
    const savedFontSize = localStorage.getItem('archive-font-size');
    if (savedFontSize) {
        currentFontSize = parseInt(savedFontSize);
        updateFontSize();
    }

    // 按钮悬停效果
    [decreaseBtn, resetBtn, increaseBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(74, 108, 248, 0.9)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(42, 42, 68, 0.9)';
        });
    });
}

/**
 * 主初始化函数
 * 页面加载完成后执行所有交互初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('异物表交互脚本初始化...');
    
    // 根据页面类型初始化不同的交互功能
    const isHomePage = document.querySelector('.card-container') !== null;
    const isArchivePage = document.querySelector('.archive-card') !== null;
    
    // 所有页面都有的功能
    initializeCardInteractions();
    initializeScrollAnimations();
    initializeBackToTop();
    initializeLoadingAnimation();
    
    // 主页特有功能
    if (isHomePage) {
        initializeFiltering();
    }
    
    // 档案详情页特有功能
    if (isArchivePage) {
        initializeContentToggler();
        initializeFontSizeControls();
    }
    
    // 可选：主题切换功能（如需要可取消注释）
    // initializeThemeSwitcher();
    
    console.log('异物表交互脚本初始化完成。');
});

/**
 * 为滚动动画添加CSS类
 * 需要在CSS文件或<style>标签中定义的类
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 淡入动画相关样式 */
        .fade-in-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* 主题切换相关样式 */
        .light-theme {
            background-color: #f5f5f5;
            color: #333;
        }
        
        .light-theme .archive-card,
        .light-theme .card {
            background: white;
            border-color: #ddd;
            color: #333;
        }
        
        .light-theme .back-button,
        .light-theme .card-link {
            color: #8b0000;
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            #font-size-controls {
                bottom: 20px;
                left: 20px;
                padding: 8px;
            }
            
            #back-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 20px;
            }
            
            #theme-switcher {
                top: 15px;
                right: 15px;
            }
        }
    `;
    document.head.appendChild(style);
}

// 添加动画样式
addAnimationStyles();