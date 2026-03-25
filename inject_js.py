import re

new_js = r'''
    function generateCategoryAdvice(lifePath, nineStarBase) {
        // Pseudo-random but deterministic based on lifePath + nineStar hash
        const hash = (lifePath * 3 + nineStarBase.length * 7) % 5;
        
        const romance = [
            "あなたの放つ独特の引力は、無意識のうちに多くの魂を惹きつけます。今生では「魂の双子（ツインレイ）」との強烈な出会いがプログラムされています。表面的な条件ではなく、波長が合うかを直感で判断してください。",
            "自立心が強すぎるあまり、パートナーに対して防衛線を張りやすい傾向があります。愛を受け取ること（受容）もまた、あなたのカルマの解消に繋がります。弱さを見せる勇気が真の絆を結びます。",
            "言葉のバイブレーション（言霊）が恋愛運を大きく左右します。ネガティブな発言は電磁場を濁らせるので注意してください。自己愛を深めることで、あなたに相応しい波動の相手が引き寄せられます。",
            "過去生からのソウルメイトと再会する確率が非常に高い星回りです。「初めて会った気がしない」という直感は決して気のせいや錯覚ではありません。理屈を超えた魂の共鳴を信じてください。",
            "恋愛においては破壊と再生のプロセスを経験しやすいです。執着を手放すことで、より高次元の愛へとアセンション（次元上昇）します。別れは進化のための必要な霊的脱皮です。"
        ];
        
        const work = [
            "既存の枠組みの中で働くよりも、自らが「ゼロからイチを創り出す」クリエイターや起業家としての適性が規格外です。世間の常識（マトリックス）に縛られると、魂のエネルギーが著しく低下します。",
            "人や情報を繋ぐ「ハブ」としての役割に天職があります。ネットワークの構築やコミュニケーションを通じて、莫大な豊かさを生み出す霊的触媒（カタリスト）としての才能が開花するでしょう。",
            "鋭い洞察力で物事の本質や裏側を見抜く力があり、研究者、コンサルタント、あるいはスピリチュアルな分野での指導者として大成します。目に見えない価値を物質界に具現化する使命があります。",
            "非常に強固なグラウンディング能力を持ち、組織の屋台骨として不可欠な存在となります。「あなたがいなければシステムが回らない」という絶対的な基盤。しかし、自己犠牲には注意が必要です。",
            "常に移動と変化を伴う環境（海外、メディア、ITなど）で最も輝きます。一つの場所に留まると運気が停滞（エネルギーの腐敗）を起こすため、常に新陳代謝を促すノマド的な働き方が最適です。"
        ];
        
        const hobby = [
            "芸術、音楽、詩など「見えない波動を形にする」趣味が、あなたの魂のクリーニング（浄化）に直結します。損得を忘れて没頭する時間が、結果的に最強の金運を引き寄せる磁力となります。",
            "身体を動かすこと（特に自然界とのグラウンディング：登山やサーフィン、ヨガなど）が、チャクラの詰まりを取り除き、豊かさの循環（金運）を劇的に向上させます。",
            "隠された真理を探求する（歴史、オカルト、哲学、量子力学など）趣味が、あなたの第三の目を活性化させます。この知的高揚感が、あなたの人生を豊かにするための強力な引き寄せの法則を発動させます。",
            "美しいもの、一流品に触れる（アート鑑賞、美食、高級ホテルのラウンジなど）ことで、自身の波動を意図的に高い次元へチューニングできます。それが結果的に物質的な豊かさ（財運）と直結しています。",
            "他者への奉仕やコミュニティ活動（ボランティア、寄付、人の育成）を通じて回したエネルギーは、宇宙銀行に蓄積され、必要な時に驚くべき形（臨時収入や絶大な支援）であなたに還元されます。"
        ];
        
        document.getElementById('advice-romance').innerHTML = romance[hash];
        document.getElementById('advice-work').innerHTML = work[(hash+1)%5];
        document.getElementById('advice-hobby').innerHTML = hobby[(hash+2)%5];
    }

    // AI Consultation Logic
    const aiConsultBtn = document.getElementById('ai-consult-btn');
    const aiModal = document.getElementById('ai-modal');
    const aiCloseBtn = document.getElementById('ai-close-btn');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    const aiChatHistory = document.getElementById('ai-chat-history');

    if(aiConsultBtn) {
        aiConsultBtn.addEventListener('click', () => {
            aiModal.classList.remove('hidden');
            aiModal.classList.add('slide-up');
        });
        
        aiCloseBtn.addEventListener('click', () => {
            aiModal.classList.add('hidden');
            aiModal.classList.remove('slide-up');
        });

        const addMessage = (text, isUser) => {
            const msgDiv = document.createElement('div');
            msgDiv.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
            msgDiv.style.background = isUser ? 'rgba(37, 99, 235, 0.4)' : 'rgba(30, 58, 138, 0.4)';
            msgDiv.style.padding = '0.8rem 1rem';
            msgDiv.style.borderRadius = isUser ? '12px 12px 0 12px' : '12px 12px 12px 0';
            msgDiv.style.maxWidth = '80%';
            msgDiv.style.fontSize = '0.9rem';
            msgDiv.style.lineHeight = '1.5';
            msgDiv.innerText = text;
            aiChatHistory.appendChild(msgDiv);
            aiChatHistory.scrollTop = aiChatHistory.scrollHeight;
        };

        aiSendBtn.addEventListener('click', () => {
            const text = aiInput.value.trim();
            if(!text) return;
            addMessage(text, true);
            aiInput.value = '';
            
            // Show typing indicator
            const typingMsg = document.createElement('div');
            typingMsg.style.alignSelf = 'flex-start';
            typingMsg.style.fontSize = '0.8rem';
            typingMsg.style.color = 'var(--text-secondary)';
            typingMsg.innerText = '星凛が宇宙の叡智にアクセス中...';
            aiChatHistory.appendChild(typingMsg);
            aiChatHistory.scrollTop = aiChatHistory.scrollHeight;

            setTimeout(() => {
                aiChatHistory.removeChild(typingMsg);
                const responses = [
                    "あなたの星回りの波動を解析しました。そのお悩みに関しては、直近の3ヶ月間に訪れる「破壊と再生の波」に乗ることが鍵となります。今は焦らず、自分自身の内なる声（ハイヤーセルフ）に耳を傾ける時期です。",
                    "算命学の観点から見ると、現在あなたは試練のフェーズ（天中殺の余波）にいますが、それは大飛躍のための『しゃがみ込み』です。その方向性で間違っていませんので、自分の直感を信じて進んでください。",
                    "非常に鋭い質問です。あなたの数秘術のバイブレーションは、他者の意見に流されると著しく低下します。「自分がどうしたいか」という純粋なエゴ（魂の欲求）を満たす選択が、結果的に最大の調和をもたらします。",
                    "※申し訳ありません。現在AI星凛（デモ版）は宇宙の高次元回線と接続テスト中です。あなたの素晴らしい質問は、正式版リリース時にディープな解析結果としてお返しします！"
                ];
                // Pseudo-random response
                const randomRes = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomRes, false);
            }, 1500 + Math.random() * 1000);
        });
    }
'''

def update_js(filepath):
    print("Updating JS in", filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Insert `generateCategoryAdvice` call at the end of `calculateFortune`
    # Just after `generateSummary(nameRank, starName, sanmeiName, numDesc);`
    target1 = 'generateSummary(nameRank, starName, sanmeiName, numDesc);'
    replace1 = target1 + '\n                generateCategoryAdvice(lifePath, nineStarData.name);'
    if target1 in content:
        content = content.replace(target1, replace1)
    
    # Insert the new functions and event listeners before the final `})();`
    # The safest way is to replace the final `})();` block
    if filepath.endswith('.html'):
        # For HTML, it looks like `    })();\n    </script>`
        target2 = '        })();\n    </script>'
        replace2 = new_js + '        })();\n    </script>'
        content = content.replace('})();\n    </script>', new_js + '})();\n    </script>')
    else:
        # For JS, it ends with `})();`
        content = content.replace('})();', new_js + '})();')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_js('script.js')
update_js('星凛 (Seirin).html')
