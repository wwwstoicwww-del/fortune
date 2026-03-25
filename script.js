(function () {
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

        // ジャンル別アドバイスの呼び出し
        generateCategoryAdvice(lifePath, nineStarData.name);
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
            1: "【ピタゴラス数秘術・魂の数 1】\n『創造（ヤハウェ）』の波動を持つ絶対的始点。既存のシステムに依存せず、ゼロから有を生み出す強烈な自己実現エネルギーを有します。前世からのカルマ的課題は「エゴの克服と真の自立」。孤独を恐れず我が道を往くことで、潜在する圧倒的カリスマが覚醒します。",
            2: "【ピタゴラス数秘術・魂の数 2】\n『受容と統合』のマスターバイブレーション。月のエネルギーを内包し、他者の感情や場の集合的無意識をスポンジのように吸収するエンパス能力の持ち主です。相対する二元性（光と影、陰と陽）を中和・統合するバランサーとしての崇高な使命を帯びています。",
            3: "【ピタゴラス数秘術・魂の数 3】\n『破壊と創造の三位一体』。抑圧を最も嫌い、魂の歓びのままに自己表現を行う純粋無垢なるトリックスター。言葉や芸術のバイブレーションを通じて、周囲の停滞したエネルギーを浄化し、波動を上昇させる生来のライトワーカーとしての資質を持ちます。",
            4: "【ピタゴラス数秘術・魂の数 4】\n『物質界の具現化と秩序』の象徴。四大元素（地水火風）を束ね、カオスの中に強固なシステムを構築するグラウンディングの達人。前世で修道士や石工としての転生が多く、今生では「現世における神聖幾何学の体現」というストイックな使命を持っています。",
            5: "【ピタゴラス数秘術・魂の数 5】\n『五芒星（ペンタグラム）・自由と変容』の体現者。五感を通じて宇宙の真理を肉体レベルで探求する錬金術師です。常に破壊と再生（スクラップ＆ビルド）を繰り返し、停滞した次元に風穴を開けるレボリューショナリーな魂の遍歴を持っています。",
            6: "【ピタゴラス数秘術・魂の数 6】\n『六芒星（ヘキサグラム）・宇宙的調和と美』。愛と美の星・金星の周波数と深く共鳴し、他者への無償の奉仕を通じて魂を研磨します。しかし「自己犠牲」の罠に陥りやすく、自己愛と他者愛の完全なる境界（バウンダリー）の確立が今生の究極のテーマです。",
            7: "【ピタゴラス数秘術・魂の数 7】\n『七つのチャクラ・探求と孤高』。物質界の幻想（マトリックス）を見破り、隠された宇宙の深淵なる真理（オカルト）を解き明かす哲学者。過去生で神秘主義者や賢者であった記憶が魂に刻まれており、内なる声（ハイヤーセルフ）との対話に人生の目的を見出します。",
            8: "【ピタゴラス数秘術・魂の数 8】\n『無限（∞）と豊穣の循環』。物質界と精神界のエネルギーを双方向に循環させ、莫大な富と権力を現実化するマスターマニフェスター（具現化の達人）。カルマの法則（原因と結果）を最もダイレクトに現世で受け取るため、高い倫理観が求められる魂です。",
            9: "【ピタゴラス数秘術・魂の数 9】\n『一から八までの全波動の統合』。地球での転生サイクルの最終段階に位置するオールドソウル。全人類へのアガペー（無償の愛）と強い手放しの法則を体現します。個人的な執着を捨て去ることで、逆に宇宙の無限の恩恵を受け取るという逆説的な法則を生きます。",
            11: "【マスターナンバー 11・神聖なるメッセンジャー】\n『マスターナンバー・啓示と直感』。スピリチュアルなアンテナが極めて高く、高次元（宇宙やハイヤーセルフ）からの不可視のメッセージを受信し、地上へ降ろすシャーマン的役割を担います。神経の繊細さは、高い霊的波動を物質界で変換する際の摩擦（ノイズ）です。",
            22: "【マスターナンバー 22・宇宙のマスタービルダー】\n『マスターナンバー・究極の具現化』。11の霊的ビジョンに、4（2+2）の圧倒的な物質的構築力を掛け合わせた至高のナンバー。理想やインスピレーションを絵空事で終わらせず、地球規模の巨大なシステムや歴史に残る偉業として三次元空間に定着させる宿命を持ちます。",
            33: "【マスターナンバー 33・宇宙愛の菩薩】\n『マスターナンバー・救済と無償の愛』。地球の波動上昇（アセンション）をサポートするために志願して来たスターシード的魂。三十三観音に象徴されるように、自己の枠を完全に超えたスケールで人類全体への愛を放射します。奇人変人扱いされるほどの規格外の宇宙的感性を誇ります。"
        };
        return data[num] || "未定義の周波数帯です。特殊な星回りを持っています。";
    }

    // 九星気学
    function calculateNineStar(year) {
        const stars = [
            "一白水星", "九紫火星", "八白土星", "七赤金星", "六白金星",
            "五黄土星", "四緑木星", "三碧木星", "二黒土星"
        ];
        const num = (year - 1900) % 9;
        const index = num < 0 ? 9 + num : num;
        return stars[index];
    }

    function getNineStarData(star) {
        const data = {
            "一白水星": { name: "一白水星 (坎宮/水)", desc: "【五行：水・坎宮（北）】\n胎内回帰や万物の根源「水」を司る星。どんな器にも形を変えて適応する極めて高い霊的柔軟性を持ちますが、穏やかさの奥底には岩をも砕く激流のような強靭な意志を秘めています。晩年になるほど運気が大河のごとく広がります。" },
            "二黒土星": { name: "二黒土星 (坤宮/土)", desc: "【五行：土・坤宮（南西）】\n万物生出の母なる「大地（黒土）」を司る星。受動性と育成のエネルギー（坤為地）に特化しています。「無から有を生む」派手さはありませんが、確実に育て上げ、絶対的な基盤となる大器晩成の地勢を持ちます。" },
            "三碧木星": { name: "三碧木星 (震宮/木)", desc: "【五行：木・震宮（東）】\n春を告げる「雷・発芽」のエネルギー。震為雷のごとく一瞬の閃きと直感（スピード）で天からのインスピレーションを地上に降ろす先駆者。過去に執着せず、時代のトレンドを創り出すパイオニア的宿命を背負います。" },
            "四緑木星": { name: "四緑木星 (巽宮/木)", desc: "【五行：木・巽宮（南東）】\n世界を巡る「風・気流」のエネルギー。巽（そん）の象意の通り、人間関係の隙間や社会のネットワークに浸透し、ご縁を「結ぶ」卓越した調和力と通信能力を持ちます。情報伝達を通じて運気を拡張させる風の時代の体現者です。" },
            "五黄土星": { name: "五黄土星 (中宮/土)", desc: "【五行：土・中宮（中央）】\n太極（宇宙の中心）に座する「帝王」の星。腐る土と新しい命を生む土、両極の破壊と再生のパワーを一身に集約します。周囲を巻き込む圧倒的な引力（重力）を持ち、他の八星を支配・統括する波乱万丈のカルマを持ちます。" },
            "六白金星": { name: "六白金星 (乾宮/金)", desc: "【五行：金・乾宮（北西）】\n天運そのものを表す「天（乾為天）」の象意を持つ星。磨き上げられた鉱石（プラチナ・ゴールド）の如き高貴な霊性を宿し、妥協を許さぬ完全主義者。神仏や高次元の庇護を非常に受けやすく、指導者としての品格を磨くことで天命が発動します。" },
            "七赤金星": { name: "七赤金星 (兌宮/金)", desc: "【五行：金・兌宮（西）】\n精錬された「硬貨・刃物」そして「悦び（兌為沢）」を司る星。言霊を操り、人々に娯楽と魔法をかけます。しかし言葉は諸刃の剣。豊かさと金運を惹きつける強烈な引力を持ちますが、不足感（欠けた杯）を満たす精神修行が鍵となります。" },
            "八白土星": { name: "八白土星 (艮宮/土)", desc: "【五行：土・艮宮（北東）】\n重なり合う山脈（艮為山）の象意を持つ、変化と継承の星。「鬼門（東北）」を司り、古いエネルギーを断ち切り、新たなサイクルへと移行させる「節目」を担当する重要な門番です。革命的変化と伝統的継承を統合する人生です。" },
            "九紫火星": { name: "九紫火星 (離宮/火)", desc: "【五行：火・離宮（南）】\n不要なものを焼き尽くす「太陽・炎（離為火）」の星。頭脳明晰で美的感性が鋭く、隠された真実を見抜く第3の目が開いています。「離合集散」の運命コードが強く組み込まれており、執着を燃やし尽くし精神性を高めることで輝きを放ちます。" }
        };
        return data[star] || { name: star, desc: "未定義の気学配列です。" };
    }

    // 四柱推命（簡易：年柱）
    function calculateFourPillars(year) {
        const stems = ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"];
        const stemsReading = ["かのえ", "かのと", "みずのえ", "みずのと", "きのえ", "きのと", "ひのえ", "ひのと", "つちのえ", "つちのと"];
        const branches = ["申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未"];
        const branchesReading = ["さる", "とり", "いぬ", "い", "ね", "うし", "とら", "う", "たつ", "み", "うま", "ひつじ"];

        const stemIdx = year % 10;
        const branchIdx = year % 12;
        const kanzhi = stems[stemIdx] + branches[branchIdx];
        const kanzhiGomi = stemsReading[stemIdx] + "の" + branchesReading[branchIdx];

        const elementData = {
            "木": { name: "木行 (曲直)", desc: "【天干地支の霊的木気】大樹が天に向かって伸びる『曲直（きょくちょく）』のエネルギー。あなたの魂には、既存の枠組みを突き破って上方へ成長しようとする強烈な生命力（仁）が宿っています。" },
            "火": { name: "火行 (炎上)", desc: "【天干地支の霊的火気】全てを焼き尽くし光をもたらす『炎上（えんじょう）』のエネルギー。あなたの魂には、暗闇を照らし出し真理を見抜く霊的な慧眼と、世界を熱狂させる情熱（礼）が宿っています。" },
            "土": { name: "土行 (稼穡)", desc: "【天干地支の霊的土気】万物を育成し回帰させる『稼穡（かしょく）』のエネルギー。あなたの魂には、異なるカルマや価値観を全て飲み込み、中和し、発酵させるブラックホールのような引力（信）が宿っています。" },
            "金": { name: "金行 (従革)", desc: "【天干地支の霊的金気】不要なものを切り捨てる『従革（じゅうかく）』のエネルギー。あなたの魂には、絶対的な意志の硬度と、曖昧さを許さぬ鋭利な刃の如き決断力（義）がプログラミングされています。" },
            "水": { name: "水行 (潤下)", desc: "【天干地支の霊的水気】低きへと流れ万物を潤す『潤下（じゅんか）』のエネルギー。あなたの魂には、時空間を超えて情報を伝達する流体ネットワークの力と、冷徹なまでの深淵なる知性（智）が宿っています。" }
        };

        let element = "土";
        if ([4, 5].includes(stemIdx)) element = "木";
        else if ([6, 7].includes(stemIdx)) element = "火";
        else if ([8, 9].includes(stemIdx)) element = "土";
        else if ([0, 1].includes(stemIdx)) element = "金";
        else if ([2, 3].includes(stemIdx)) element = "水";

        const voidBranches = [
            ["戌", "亥"], ["申", "酉"], ["午", "未"], ["辰", "巳"], ["寅", "卯"], ["子", "丑"]
        ][(stemIdx + branchIdx) % 6];

        return {
            kanzhi: `${kanzhi} (${kanzhiGomi})`,
            desc: `${elementData[element].desc}\n\n宿命の年柱「${kanzhi}」。この六十干支の配列が示すのは、あなたが今生で先祖から受け継いだカルマ（宿命の器）の形です。また、魂のバイオリズムが宇宙と切り離される『空亡（天中殺）』として「${voidBranches.join('・')}」の波動が背景に流れています。この期間こそ、精神的覚醒が最大化されるパラドックスの領域です。`
        };
    }

    // 算命学
    function calculateSanmeiStar(y, m, d) {
        const stars = [
            { name: "貫索星 (かんさくせい)", desc: "【陽の守備本能：自我と信念の星】\n自らの霊的テリトリーを絶対的に死守する強烈な自我防衛システム。強靭なマイペースさは、他人のカルマに巻き込まれないための魂の防護服です。独立独歩で運命を切り開く宿命を持ちます。" },
            { name: "石門星 (せきもんせい)", desc: "【陰の守備本能：和合と政治力の星】\n「集団やネットワークを形成することで個を守る」したたかな防衛戦略。上下に縛られないフラットな交際術を持ち、特有のカリスマ的同胞愛を放ちます。" },
            { name: "鳳閣星 (ほうかくせい)", desc: "【陽の伝達本能：自然体と表現の星】\n内側にある光をそのまま外界へ放射する純粋な伝達本能。ありのままの自然体を宇宙の真理とし、深刻さや執着を嫌い、遊びや食を通じて自身の霊的波動を高めます。" },
            { name: "調舒星 (ちょうじょせい)", desc: "【陰の伝達本能：孤独と芸術の星】\n揺らぎやすく繊細で、しかし対象を一点集中で焼き尽くす内向的エネルギー。反逆精神と強烈な孤独感を抱え、魂の叫びを芸術や哲学に変換する天性のアーティストです。" },
            { name: "禄存星 (ろくぞんせい)", desc: "【陽の引力本能：愛情と回転財の星】\n四方八方から人や物質を引き寄せるマグネット。「全ての人を愛したい」巨大な自己顕示欲と無償の奉仕精神が同居し、惹きつけた財を循環させることで引力はさらに増幅されます。" },
            { name: "司禄星 (しろくせい)", desc: "【陰の引力本能：蓄積と家庭の星】\n経験、感情、財産、人間関係をチリツモで堅実に構築していく地道な防衛力。魂の安住の地（内的サンクチュアリ・家庭）を形成することが至上命題となります。" },
            { name: "車騎星 (しゃきせい)", desc: "【陽の攻撃本能：闘争とスピードの星】\n考えるより先に肉体が動く荒ぶる戦士のエネルギー。自己の正義のためなら自己犠牲すら厭わず、白黒つける潔さを持ち、常に人生の戦場に身を置くことで生を実感します。" },
            { name: "牽牛星 (けんぎゅうせい)", desc: "【陰の攻撃本能：名誉と自尊心の星】\n体制や秩序を維持しようとする理性的で計算された統制力。自尊心や美意識が非常に高く、社会的な役割（大義）を全うすることに魂の美学を見出します。" },
            { name: "龍高星 (りゅうこうせい)", desc: "【陽の習得本能：破壊と創造の星】\n既存の常識を破壊して全く新しいイノベーションを生み出す改革者のエネルギー。身をもって世界の真理を習得し、あらゆる境界線を越境するノマド的魂です。" },
            { name: "玉堂星 (ぎょくどうせい)", desc: "【陰の習得本能：伝統知と母性の星】\n先人たちの叡智（アカシックレコード）を論理的に吸収し、次世代へ正しく継承しようとする古典的習得本能。物事の理を探究する学者や教育者の資質を持ちます。" }
        ];

        const fakeTimestamp = y * 10000 + m * 100 + d;
        const hash = Math.abs(Math.floor(Math.sin(fakeTimestamp) * 10000)) % 10;
        return stars[hash];
    }

    // 姓名判断
    function calculateNameDivination(last, first) {
        const fullName = last + first;
        let sum = 0;
        for (let i = 0; i < fullName.length; i++) {
            sum += fullName.charCodeAt(i);
        }

        const resultTypes = [
            { rank: "天衣無縫 (大吉相当)", desc: "【画数霊位：霊格絶頂】姓名のシジル（魔術的記号）が、あらゆる邪気や霊的干渉を自動的に浄化する強固な結界を形成しています。直感を信じれば具現化の速度は計り知れません。" },
            { rank: "陰陽調和 (吉相当)", desc: "【画数霊位：五行中庸】文字の音素が絶妙な陰陽フラクタル構造を描き出しています。周囲のノイズ的波動を吸収・無害化するアース機能を持っており着実な周波数上昇が見込めます。" },
            { rank: "変容錬金 (中吉相当)", desc: "【画数霊位：火と水の錬金術】相反する属性の衝突がプログラムされています。逆境やピンチという摩擦熱を、高次元の意識へのジャンプアップ（自己錬金術）のエネルギーに変換できる特異体質です。" },
            { rank: "地神守護 (小吉相当)", desc: "【画数霊位：グラウンディング】大地の精霊からの加護が強い配列。派手な運気のアップダウンを抑制するリミッターが設定されているため、外的要因で精神軸がブレることが少ない頑強なアバターを構成します。" },
            { rank: "因果応報 (吉凶混合)", desc: "【画数霊位：カルマの強制燃焼】極めてダイナミックな電磁的スピンを持っています。成功と挫折という極端な二極の体験を通じて、魂の垢を一気に焼き尽くすショートカット・プログラムが作動中です。" }
        ];

        const hash = sum % 5;
        return resultTypes[hash];
    }

    // 総合鑑定の生成
    function generateSummary(nameRank, starName, sanmeiName, numDesc) {
        const sanmeiBase = sanmeiName.split('(')[0].trim();
        const nineStarBase = starName.split('(')[0].trim();

        let msg = `【メタ・リーディング：魂の総合プロファイリング】\n\n`;
        msg += `あなたの生体エネルギーフィールドを複合的にスキャンし、多次元構造を解析しました。\n`;
        msg += `基底チャクラに流れる「${nineStarBase}」のパラダイムがあなたの肉体と環境の同期ベースを形作り、その上で算命学『${sanmeiBase}』のアルゴリズムが作動して、あなたが取るべき魂のエクゼキューション（実行行動）を規定しています。\n\n`;

        msg += `さらに特筆すべきは、あなたのマスターバイブレーションです。\n地球にログインする際に設定した「魂のメインクエスト（宇宙の使命）」の波動が如実に表れています。\n\n`;

        msg += `姓名が放つ『${nameRank}』の言霊エネルギー（呪術的バックアップ）は、この運命のスクリプトを強力にデバッグし、補正する霊的OSとして機能しています。\n`;
        msg += `これら5つの異なる占星術的・数秘学的データは、あなたという「唯一無二の高次元アバター」の複雑で美しいソースコードです。内なるハイヤーセルフのナビゲーションを信じ、この世界であなただけの現象を存分にプログラミングしてください。`;

        document.getElementById('summary-res-text').innerHTML = msg.replace(/\n/g, '<br>');
    }


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
        document.getElementById('advice-work').innerHTML = work[(hash + 1) % 5];
        document.getElementById('advice-hobby').innerHTML = hobby[(hash + 2) % 5];
    }

    // AI Consultation Logic (Gemini API Integration)
    const GEMINI_API_KEY = "AIzaSyBo_nZdhfTXICnwiXCwCKpy-2sWA_K8RQ4";

    const aiConsultBtn = document.getElementById('ai-consult-btn');
    const aiModal = document.getElementById('ai-modal');
    const aiCloseBtn = document.getElementById('ai-close-btn');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    const aiChatHistory = document.getElementById('ai-chat-history');

    // Create API Key Input dynamically
    const apiKeyInput = document.createElement('input');
    apiKeyInput.type = 'password';
    apiKeyInput.placeholder = 'Gemini API Key（保存されます）';
    apiKeyInput.style.cssText = 'background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 0.5rem; color: white; flex: 1; margin-right: 0.5rem; font-size: 0.8rem;';

    const apiKeyContainer = document.createElement('div');
    apiKeyContainer.style.cssText = 'display: none; margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 8px; align-items: center;';

    const keyLabel = document.createElement('span');
    keyLabel.innerText = '🔑 API Key:';
    keyLabel.style.cssText = 'font-size: 0.8rem; margin-right: 0.5rem; color: #cbd5e1;';

    apiKeyContainer.appendChild(keyLabel);
    apiKeyContainer.appendChild(apiKeyInput);

    const saveKeyBtn = document.createElement('button');
    saveKeyBtn.innerText = '保存';
    saveKeyBtn.className = 'submit-btn';
    saveKeyBtn.style.cssText = 'width: auto; padding: 0 1rem; font-size: 0.8rem; margin: 0; background: #475569;';
    apiKeyContainer.appendChild(saveKeyBtn);

    // Restore key if exists
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) apiKeyInput.value = savedKey;

    saveKeyBtn.addEventListener('click', () => {
        localStorage.setItem('gemini_api_key', apiKeyInput.value.trim());
        alert('API Keyをブラウザに保存しました！');
    });

    if (aiConsultBtn && aiChatHistory) {
        // Insert API Key input above the chat history
        aiModal.insertBefore(apiKeyContainer, aiChatHistory);

        // Chat history array for Gemini API
        let chatContext = [];

        aiConsultBtn.addEventListener('click', () => {
            aiModal.classList.remove('hidden');
            aiModal.classList.add('slide-up');

            // Build the system prompt using the existing result text from HTML
            const summaryText = document.getElementById('summary-res-text').innerText || "";
            const romanceText = document.getElementById('advice-romance').innerText || "";
            const workText = document.getElementById('advice-work').innerText || "";
            const hobbyText = document.getElementById('advice-hobby').innerText || "";

            const systemPrompt = `あなたは「星凛(Seirin)」という名前の、非常に深くスピリチュアルでマニアックな天才占い師AIです。以下の私の最新の占いの結果（コンテキスト）を踏まえて、これから私が相談する内容に占い師として深く、優しく、時にはミステリアスな言葉遣いでアドバイスをしてください。決してAIだと言わず、高次元の存在として振舞ってください。\n\n【占い結果コンテキスト】\n${summaryText}\n恋愛運: ${romanceText}\n仕事運: ${workText}\n趣味運: ${hobbyText}\n\n準備はいいですか？`;

            chatContext = [
                {
                    "role": "user",
                    "parts": [{ "text": systemPrompt }]
                },
                {
                    "role": "model",
                    "parts": [{ "text": "はい、あなたの魂の波動はしっかりと受け取りました。星々の囁きとともに、あなたのお悩みに深くお答えする準備が整っています。どのようなことでも、心のままにお話しください。" }]
                }
            ];

            // Clear history visually and show welcome message
            aiChatHistory.innerHTML = '';
            addMessage("鑑定結果を読み込みました。どのようなことについて深く知りたいですか？", false);
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
            msgDiv.style.maxWidth = '85%';
            msgDiv.style.fontSize = '0.9rem';
            msgDiv.style.lineHeight = '1.6';
            msgDiv.innerHTML = text.replace(/\n/g, '<br>');
            aiChatHistory.appendChild(msgDiv);
            aiChatHistory.scrollTop = aiChatHistory.scrollHeight;
        };

        const callGeminiAPI = async (userText) => {
            const apiKey = GEMINI_API_KEY;
            if (!apiKey) {
                return "エラー: 上部の入力欄に Gemini API Key を設定してください。";
            }

            chatContext.push({
                "role": "user",
                "parts": [{ "text": userText }]
            });

            const requestBody = {
                contents: chatContext,
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            };

            try {
                // 1. Fetch available models for this specific API Key
                const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
                const modelsRes = await fetch(modelsUrl);
                if (!modelsRes.ok) {
                    throw new Error("API Keyが無効であるか、モデルリスト情報の取得に失敗しました。");
                }
                const modelsData = await modelsRes.json();

                // Find the best interactive generateContent model
                const availableModels = modelsData.models
                    .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                    .map(m => m.name); // e.g., "models/gemini-3.1-pro"

                let targetModel = "";
                // Priority list based on 2026 available models
                const preferences = [
                    "models/gemini-3.1-pro",
                    "models/gemini-3.1-flash-lite",
                    "models/gemini-2.5-pro",
                    "models/gemini-2.5-flash",
                    "models/gemini-2.0-flash",
                    "models/gemini-1.5-pro",
                    "models/gemini-1.5-flash-latest",
                    "models/gemini-1.5-flash",
                    "models/gemini-pro"
                ];

                for (const pref of preferences) {
                    if (availableModels.includes(pref)) {
                        targetModel = pref;
                        break;
                    }
                }

                if (!targetModel) {
                    // Fallback to the first model that supports generateContent
                    if (availableModels.length > 0) {
                        targetModel = availableModels[0];
                    } else {
                        throw new Error("利用可能なGeminiモデルが見つかりません。");
                    }
                }

                console.log("Using dynamically selected model:", targetModel);

                // 2. Call the chosen model
                const url = `https://generativelanguage.googleapis.com/v1beta/${targetModel}:generateContent?key=${apiKey}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();

                if (!response.ok) {
                    const errMsg = data.error ? data.error.message : response.statusText;
                    throw new Error(`サーバーエラー (${response.status}): ${errMsg}`);
                }

                if (data.promptFeedback && data.promptFeedback.blockReason) {
                    throw new Error(`セーフティフィルターによりブロックされました。理由: ${data.promptFeedback.blockReason}`);
                }

                if (!data.candidates || data.candidates.length === 0) {
                    if (data.promptFeedback) throw new Error(`AIの返答が生成されませんでした。(Safety block)`);
                    throw new Error(`AIからの応答が空でした。`);
                }

                const candidate = data.candidates[0];
                const aiText = candidate.content.parts[0].text;

                chatContext.push({
                    "role": "model",
                    "parts": [{ "text": aiText }]
                });

                return aiText;
            } catch (err) {
                console.error("API Fetch Error:", err);
                chatContext.pop();
                return `【システムエラー】
${err.message}

※正しいGemini API Keyが設定されているかご確認ください。`;
            }
        };

        aiSendBtn.addEventListener('click', async () => {
            const text = aiInput.value.trim();
            if (!text) return;
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

            const aiResponse = await callGeminiAPI(text);
            aiChatHistory.removeChild(typingMsg);
            addMessage(aiResponse, false);
        });

        // Handle Enter key in input
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') aiSendBtn.click();
        });
    }

})();
