import codecs
import re

def update_html(filepath):
    print(f"Updating HTML in {filepath}")
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()

    # 1. Replace the end of result-section to add Category Advice & AI Button
    target_summary = r'''            <!-- 総合鑑定 -->
            <div class="summary-card" style="animation-delay: 0.6s">
                <h3>✨ 総合鑑定書 ✨</h3>
                <p id="summary-res-text" class="summary-text">--</p>
            </div>
            
            <button class="back-btn" id="back-btn">もう一度占う</button>'''
            
    replacement_summary = r'''            <!-- 総合鑑定 -->
            <div class="summary-card" style="animation-delay: 0.6s">
                <h3>✨ 総合鑑定書 ✨</h3>
                <p id="summary-res-text" class="summary-text">--</p>
            </div>
            
            <!-- ジャンル別アドバイス -->
            <h3 class="result-title" style="font-size: 1.6rem; margin-top: 1rem; animation-delay: 0.7s; opacity: 0; animation: fadeInSlideUp 0.6s forwards;">ジャンル別・魂の羅針盤</h3>
            <div class="fortune-cards advice-cards" style="margin-top: 1rem; margin-bottom: 2rem;">
                <div class="fortune-card advice-card" style="animation-delay: 0.8s; padding: 1.2rem;">
                    <div class="card-header" style="margin-bottom: 0.5rem; padding-bottom: 0.5rem;">
                        <div class="card-icon" style="width:30px; height:30px; font-size:1.2rem;">💖</div>
                        <h3 style="font-size: 1rem;">恋愛・対人運</h3>
                    </div>
                    <div class="card-body">
                        <p class="result-text" id="advice-romance" style="font-size: 0.85rem;">--</p>
                    </div>
                </div>
                <div class="fortune-card advice-card" style="animation-delay: 0.9s; padding: 1.2rem;">
                    <div class="card-header" style="margin-bottom: 0.5rem; padding-bottom: 0.5rem;">
                        <div class="card-icon" style="width:30px; height:30px; font-size:1.2rem;">💼</div>
                        <h3 style="font-size: 1rem;">仕事・天職</h3>
                    </div>
                    <div class="card-body">
                        <p class="result-text" id="advice-work" style="font-size: 0.85rem;">--</p>
                    </div>
                </div>
                <div class="fortune-card advice-card" style="animation-delay: 1.0s; padding: 1.2rem;">
                    <div class="card-header" style="margin-bottom: 0.5rem; padding-bottom: 0.5rem;">
                        <div class="card-icon" style="width:30px; height:30px; font-size:1.2rem;">🪙</div>
                        <h3 style="font-size: 1rem;">趣味・財運</h3>
                    </div>
                    <div class="card-body">
                        <p class="result-text" id="advice-hobby" style="font-size: 0.85rem;">--</p>
                    </div>
                </div>
            </div>

            <!-- AI相談への導線 -->
            <div class="ai-consult-container" style="animation-delay: 1.1s; opacity: 0; animation: fadeInSlideUp 0.6s forwards; text-align: center; margin-bottom: 1rem;">
                <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">更に深く、個人的な悩みを掘り下げますか？</p>
                <button class="submit-btn ai-btn" id="ai-consult-btn" style="background: linear-gradient(135deg, #1e3a8a, #312e81); color: #fff; box-shadow: 0 10px 20px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.4);">
                    <span>🤖 AI星凛に個別相談する</span>
                </button>
            </div>
            
            <button class="back-btn" id="back-btn">もう一度占う</button>'''

    # Basic string replacement
    if target_summary in content:
        content = content.replace(target_summary, replacement_summary)
    else:
        # Fallback regex just in case
        content = re.sub(r'<!-- 総合鑑定 -->.*?<button class="back-btn" id="back-btn">もう一度占う</button>', replacement_summary, content, flags=re.DOTALL)

    # 2. Add AI Modal right before <script src="script.js"> or </script>
    ai_modal = r'''        <!-- AI Consult Modal -->
        <div id="ai-modal" class="glass-panel hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; display: flex; flex-direction: column; padding: 2rem;">
            <h2 class="result-title" style="font-size: 1.5rem; margin-bottom:0.5rem;">AI 個別相談</h2>
            <p class="description" style="margin-bottom: 1rem; font-size: 0.85rem;">先ほどの鑑定結果をインプット済みのAI星凛が、あなたのお悩みに個別にお答えします。</p>
            
            <div id="ai-chat-history" style="flex: 1; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; min-height: 250px; display: flex; flex-direction: column; gap: 1rem;">
                <!-- Chat messages will appear here -->
            </div>
            
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="text" id="ai-input" placeholder="聞きたいことを入力..." style="flex: 1; margin: 0; padding: 0.8rem; font-size: 0.9rem;" onkeypress="if(event.key === 'Enter') document.getElementById('ai-send-btn').click();">
                <button id="ai-send-btn" class="submit-btn" style="width: auto; padding: 0 1.5rem; font-size: 0.9rem; background: linear-gradient(135deg, #2563eb, #1d4ed8); color:white;">送信</button>
            </div>
            <button class="back-btn" id="ai-close-btn" style="padding: 0.8rem; font-size: 0.9rem;">鑑定結果に戻る</button>
        </div>
'''
    if '<div id="ai-modal"' not in content:
        # insert before the end of app-container
        app_container_end = r'        </div>' + '\n    </div>\n    \n    <script'
        replacement_app_end = r'        </div>' + '\n' + ai_modal + '    </div>\n    \n    <script'
        if app_container_end in content:
            content = content.replace(app_container_end, replacement_app_end)
        else:
            # specifically for 星凛 (Seirin).html
            app_container_end2 = r'        </div>' + '\n    </div>\n    \n    <script>'
            replacement_app_end2 = r'        </div>' + '\n' + ai_modal + '    </div>\n    \n    <script>'
            content = content.replace(app_container_end2, replacement_app_end2)

    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)

update_html('index.html')
update_html('星凛 (Seirin).html')
