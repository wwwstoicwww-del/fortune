(function() {
    const form = document.getElementById('fortune-form');
    const inputSection = document.getElementById('input-section');
    const resultSection = document.getElementById('result-section');
    const submitBtn = document.getElementById('submit-btn');
    const backBtn = document.getElementById('back-btn');

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const lastName = document.getElementById('lastName').value.trim();
        const firstName = document.getElementById('firstName').value.trim();
        const birthDateStr = document.getElementById('birthDate').value;
        const genderEl = document.querySelector('input[name="gender"]:checked');
        const gender = genderEl ? genderEl.value : 'male';
        
        if (!lastName || !firstName || !birthDateStr) {
            alert("すべての項目（姓・名・生年月日）を正しく入力してください。");
            return;
        }

        // Animate button
        submitBtn.classList.add('loading');
        
        setTimeout(() => {
            calculateFortune(lastName, firstName, birthDateStr, gender);
            
            // Switch sections
            inputSection.classList.add('fade-out');
            setTimeout(() => {
                inputSection.classList.add('hidden');
                inputSection.classList.remove('fade-out');
                
                resultSection.classList.remove('hidden');
                submitBtn.classList.remove('loading');
                
                document.getElementById('result-greeting').innerHTML = `${lastName} ${firstName} 様の鑑定結果`;
            }, 500);
            
        }, 1200); // Fake load time for UX
    });

    backBtn.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        inputSection.classList.add('slide-up');
    });

    function calculateFortune(lastName, firstName, birthDateStr, gender) {
        const parts = birthDateStr.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        
        // 1. 数秘術 (Numerology - Life Path Number)
        const lifePath = calculateLifePath(year, month, day);
        const numData = getNumerologyData(lifePath);
        document.getElementById('num-res-value').innerText = `運命数 ${lifePath}`;
        document.getElementById('num-res-text').innerText = numData;

        // 2. 九星気学 (Nine Star Ki)
        const nineStar = calculateNineStar(year);
        const nineStarData = getNineStarData(nineStar);
        document.getElementById('nine-res-value').innerText = nineStarData.name;
        document.getElementById('nine-res-text').innerText = nineStarData.desc;

        // 3. 四柱推命 (Four Pillars of Destiny - simplified to Year Stem/Branch and general element)
        const pillars = calculateFourPillars(year);
        document.getElementById('four-res-value').innerText = `年柱: ${pillars.kanzhi}`;
        document.getElementById('four-res-text').innerText = pillars.desc;

        // 4. 算命学 (Sanmei-gaku - simplified to primary star based on day string hash)
        const sanmei = calculateSanmeiStar(year, month, day);
        document.getElementById('sanmei-res-value').innerText = `主星: ${sanmei.name}`;
        document.getElementById('sanmei-res-text').innerText = sanmei.desc;

        // 5. 姓名判断 (Name Divination - using pseudo hash)
        const nameDiv = calculateNameDivination(lastName, firstName);
        document.getElementById('name-res-value').innerText = `総格判定: ${nameDiv.rank}`;
        document.getElementById('name-res-text').innerText = nameDiv.desc;

        // 総合鑑定
        generateSummary(nameDiv.rank, nineStarData.name, sanmei.name, numData);
    }

    // --- Calculator Logic ---

    // 数秘術
    function calculateLifePath(y, m, d) {
        const sumString = (str) => String(str).split('').reduce((acc, curr) => acc + parseInt(curr), 0);
        let num = sumString(y) + sumString(m) + sumString(d);
        
        while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
            num = sumString(num);
        }
        return num;
    }
    
    function getNumerologyData(num) {
        const data = {
            1: "独立心旺盛でリーダーシップを発揮する開拓者。自らの力で運命を切り開く強さを持っています。",
            2: "感受性が豊かで協調性に優れたサポーター。周囲との調和を大切にし、平和をもたらします。",
            3: "明るくフレンドリーで創造力豊かな表現者。楽しみを見出す天才で、周囲を笑顔にします。",
            4: "真面目で計画性があり、目標に向かって着実に努力する安定の人。信頼の置ける存在です。",
            5: "自由を愛し、変化を恐れない冒険家。多才で適応力があり、新しい世界を切り開きます。",
            6: "愛情深く、奉仕の精神に溢れる保護者。家族や仲間を大切にし、美と調和を愛します。",
            7: "探求心旺盛で内省的な思索家。独自の哲学を持ち、真理を追求する深い洞察力があります。",
            8: "野心家で実行力に溢れる成功者。物質的・社会的な成功を収める力強いエネルギーの持ち主。",
            9: "慈愛に満ちた理想主義者。広い視野を持ち、人々のために尽くす博愛精神の持ち主。",
            11: "直感力と霊性に優れたメッセンジャー。強いインスピレーションで人々を導く使命があります。",
            22: "理想を現実に変える力を持つマスタービルダー。大きなスケールで世界に貢献する器です。",
            33: "無償の愛を体現する菩薩のような存在。常識の枠を超えたスケールで愛を広げていきます。"
        };
        return data[num] || "未定義";
    }

    // 九星気学
    function calculateNineStar(year) {
        // 立春前の処理は今回は簡易化のため省略
        const stars = [
            "一白水星", "九紫火星", "八白土星", "七赤金星", "六白金星", 
            "五黄土星", "四緑木星", "三碧木星", "二黒土星"
        ];
        // 1900年が一白水星
        const num = (year - 1900) % 9;
        const index = num < 0 ? 9 + num : num;
        return stars[index];
    }
    
    function getNineStarData(star) {
        const data = {
            "一白水星": { name: "一白水星 (水)", desc: "柔軟性と適応力に優れ、どんな環境にも溶け込みます。内面には強い芯を秘めた努力家です。" },
            "二黒土星": { name: "二黒土星 (土)", desc: "真面目で堅実、母のような包容力を持ちます。地道な努力が大きな成果を生む大器晩成型です。" },
            "三碧木星": { name: "三碧木星 (木)", desc: "朝日や若木のようにエネルギーに満ち、新しいことに挑戦する行動力があります。若々しい精神の持ち主。" },
            "四緑木星": { name: "四緑木星 (木)", desc: "人当たりが良く、風のように交際上手。周囲からの信頼が厚く、調和を保ちながら物事を進めます。" },
            "五黄土星": { name: "五黄土星 (土)", desc: "帝王の星。圧倒的な存在感とパワーを持ち、困難を乗り切る強さを持っています。浮き沈みが激しい面も。" },
            "六白金星": { name: "六白金星 (金)", desc: "気高くプライドを持ち、完璧を求めるタイプ。責任感が強く、上司や目上の人からの引き立てがあります。" },
            "七赤金星": { name: "七赤金星 (金)", desc: "社交的で華やかさを持ち、人を楽しませるのが得意です。金銭感覚に優れ、人生を豊かに楽しむ才能があります。" },
            "八白土星": { name: "八白土星 (土)", desc: "山のようなどっしりとした安定感。慎重ですが、一度決めたことは最後までやり遂げる強靭な意志を持っています。" },
            "九紫火星": { name: "九紫火星 (火)", desc: "火のように明るく情熱的で、直感とセンスに優れます。美的感覚が高く、周囲を惹きつける魅力があります。" }
        };
        return data[star] || { name: star, desc: "未定義" };
    }

    // 四柱推命（簡易：年柱）
    function calculateFourPillars(year) {
        const stems = ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"];
        const branches = ["申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未"];
        
        const stemIdx = year % 10;
        const branchIdx = year % 12;
        const kanzhi = stems[stemIdx] + branches[branchIdx];
        
        const meanings = {
            "木": "成長と発展のエネルギー",
            "火": "情熱と自己表現力",
            "土": "安定と育成の力",
            "金": "決断力と変革の力",
            "水": "知恵と柔軟性"
        };
        
        let element = "土";
        if ([4,5].includes(stemIdx)) element = "木";
        else if ([6,7].includes(stemIdx)) element = "火";
        else if ([8,9].includes(stemIdx)) element = "土";
        else if ([0,1].includes(stemIdx)) element = "金";
        else if ([2,3].includes(stemIdx)) element = "水";

        return {
            kanzhi: kanzhi,
            desc: `あなたの根本的なエネルギーは「${element}」の属性を帯びています。${meanings[element]}を持ち、社会的な役割においてその資質が発揮されます。`
        };
    }

    // 算命学（簡易：主星の導出をハッシュで代替）
    function calculateSanmeiStar(y, m, d) {
        const stars = [
            { name: "貫索星", desc: "意志が強く独立心旺盛な星。自分のペースで物事を進め、一本筋の通った生き方を好みます。" },
            { name: "石門星", desc: "社交性に富み、和を重んじる星。組織やコミュニティの中で政治力を発揮するリーダーシップを持ちます。" },
            { name: "鳳閣星", desc: "自然体で楽しみを愛する星。大らかでグルメや趣味を楽しみ、寿命が長い星とも言われます。" },
            { name: "調舒星", desc: "繊細で感性豊かな芸術家の星。孤独を好む反面、鋭い洞察力で物事の本質を突きます。" },
            { name: "禄存星", desc: "愛情と奉仕、そして回転財の星。人を惹きつける魅力があり、財に恵まれますがスケールも大きいです。" },
            { name: "司禄星", desc: "堅実で着実に蓄積する星。家庭や蓄財を重んじ、地道な努力で盤石な人生を築きます。" },
            { name: "車騎星", desc: "行動力と闘争心の星。一直線に目的に向かって走り、スピード感と白黒つける潔さを持っています。" },
            { name: "牽牛星", desc: "名誉と自尊心の星。真面目で責任感が強く、品格ある生き方をし、組織の要として活躍します。" },
            { name: "龍高星", desc: "海外や放浪、改革の星。好奇心旺盛で常に新しいものを求め、古いものを破壊して創造します。" },
            { name: "玉堂星", desc: "伝統的な知性や母性の星。理性的で学習能力が高く、論理的かつ古風な気質を持っています。" }
        ];
        
        const fakeTimestamp = y * 10000 + m * 100 + d;
        const hash = Math.abs(Math.floor(Math.sin(fakeTimestamp) * 10000)) % 10;
        return stars[hash];
    }

    // 姓名判断（簡易：Unicodeの合計からハッシュ）
    function calculateNameDivination(last, first) {
        const fullName = last + first;
        let sum = 0;
        for (let i = 0; i < fullName.length; i++) {
            sum += fullName.charCodeAt(i);
        }
        
        const resultTypes = [
            { rank: "大吉", desc: "素晴らしい運命が名前に宿っています。困難も乗り越え、晩年は穏やかで豊かな人生を築けるでしょう。" },
            { rank: "吉", desc: "調和の取れた良い運勢です。人間関係に恵まれ、努力が着実に身を結ぶ画数配列です。" },
            { rank: "中吉", desc: "波はありますが、確かな成功を手にする運勢です。自己研鑽を怠らないことで更なる運気アップが期待できます。" },
            { rank: "小吉", desc: "堅実な人生を歩む暗示。劇的な変化より、平穏無事な日々の中で小さな幸せを積み重ねていくタイプです。" },
            { rank: "吉凶混合", desc: "試練と成功が交互に訪れるダイナミックな運勢。逆境をバネにする強さがあり、大成功を掴むポテンシャルがあります。" }
        ];

        const hash = sum % 5;
        return resultTypes[hash];
    }

    // 総合鑑定の生成
    function generateSummary(nameRank, starName, sanmeiName, numDesc) {
        let msg = `あなたは「${starName.split('(')[0].trim()}」の性質を根底に持ちながら、算命学の「${sanmeiName}」が示す通り、${sanmeiName.includes("星") ? "特有の行動力や思考パターン" : "独特のオーラ"}を社会で発揮します。<br><br>`;
        msg += `運命数が示す「${numDesc.substring(0, 15)}...」という特性は、あなたの潜在的な強みであり、迷った時の道標となるでしょう。<br><br>`;
        msg += `姓名の画数（${nameRank}）が示す運気の流れを活かすには、自分の直感と統計学の示すバランスを意識することです。あなたの持っている五つの属性は非常にユニークで、他にはない強靭なエネルギーを秘めています。`;

        document.getElementById('summary-res-text').innerHTML = msg;
    }
})();
