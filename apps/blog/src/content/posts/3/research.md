# 주정(酒精)이란 무엇인가

> 법령 확인(2026-10-19): `.claude/scripts/law.mjs` 로 국가법령정보센터 현행 조문을 읽어 주세법(법률 제20618호, 2025-01-01 시행) 제2조·제5조·별표와 주세법 시행령(대통령령 제36136호, 2026-02-27 시행) 제3조·별표 1~3을 확인했다. [^1] [^8] [^48] [^49] [^50] 법령 미러 사이트를 쓰던 [^1] [^8] 은 국가법령정보센터 원문으로 바꿨다. 기업 공시 [^6] 이 옮긴 주세법 별표 문장은 원문과 조금 달라([^48] 참고) 법령 근거로는 [^48] 을 쓴다. 같은 API 의 검색 목록은 시행령의 현행 시행일을 2026-04-01 로, 조문 본문의 기본정보는 2026-02-27 로 적는다. 어느 쪽이 맞는지는 확인하지 못했다. 한국 법령의 위스키 증류 도수 상한은 주세법 별표와 시행령 별표 1~3에서 찾지 못했다(6절).

## 1. 주정은 뭐야?

- 주세법 제2조 제1호 가목은 주정을 "희석하여 음용할 수 있는 에틸알코올"로 정의하고, 정제하면 마실 수 있는 조주정(粗酒精)도 주정에 포함한다. [^1]
- 주세법 제2조 제1호는 주류를 가목 주정, 나목 알코올분 1도 이상의 음료, 다목 나목과 비슷한 것으로서 대통령령으로 정하는 것으로 나눈다. 그래서 주정은 도수와 관계없이 그 자체로 주류다. [^1]
- 주세법 별표(주류의 종류별 세부 내용) 제1호는 주정을 "녹말 또는 당분이 포함된 재료를 발효시켜 알코올분 85도 이상으로 증류한 것"과 "알코올분이 포함된 재료를 알코올분 85도 이상으로 증류한 것" 두 가지로 적는다. [^48] 하이트진로 공시는 앞의 것만 "녹말 또는 당분을 발효시켜"로 줄여 옮겼다. [^6]
- 식품의 기준 및 규격(식품공전)은 주정을 "전분질 원료 또는 당질 원료를 발효시켜 증류한 것이나 조주정을 증류한 것으로 희석하여 음용 할 수 있는 에탄올"로 정의한다. [^2]
- 에탄올과 에틸알코올은 같은 물질의 다른 이름이고, 일상에서 "알코올"이라 부르는 것도 이 물질이다. [^7]
- 대한주정판매는 주정을 "무색, 무취, 무미의 알코올 성분"으로 소개한다. [^4]
- 식품공전의 주정 규격은 에탄올 95(v/v%) 이상이고, 곡물주정은 85~90 이다. [^2]
- 현행 주세법 시행령은 별표 2(주류의 알코올분 도수, 제3조 제2항 관련) 제1호 가목에서 주정의 알코올분 도수를 95도 이상으로 정하고, 곡류를 원료로 한 곡물주정(주세법 별표 제3호 가목 3))은 85도 이상 90도 이하로 정한다. 2016년 판본에는 같은 내용이 시행령 제1조 제1항에 있었다. [^8]
- 엇갈림(조주정의 포함 여부): 주세법은 조주정을 주정에 포함한다 [^1] / 식품공전은 조주정을 주정 정의에서 제외한다 [^2]. 세금을 매기는 법과 식품 규격의 범위 차이로 보인다(이 해석 자체는 출처 없음).
- 엇갈림(도수): 주세법 별표는 주정을 "알코올분 85도 이상으로 증류한 것"으로 적는다 [^48] / 주세법 시행령 별표 2와 식품공전 규격은 95도 이상(곡물주정 85~90)이다 [^8] [^2] / 대한주정판매는 소개 페이지에서 "알코올 도수 95%" [^3], 제조공정 페이지에서 "96%로 농축" [^5] 이라고 적는다.

## 2. 주정은 뭐로 만들어?

- 주정은 녹말(전분)이나 당분이 든 원료를 발효시킨 뒤 증류해 만든다. [^2] [^3]
- 전분질 원료로는 쌀, 보리, 쌀보리, 밀, 수수, 고구마, 타피오카가 쓰이고, 당질 원료로는 사탕수수, 사탕무, 설탕을 만들고 남는 당밀이 쓰인다. [^3]
- 우리나라는 전분질 원료로 주정을 만들고, 사탕수수가 많이 나는 나라는 당질 원료를 쓴다. [^3]
- 하이트진로는 희석식 소주용 주정을 고구마, 쌀, 보리 같은 국산 원료와 수입 원료인 타피오카, 조주정으로 만든다고 공시했다. [^6]
- 식품음료신문(2023)은 요즘 주정 원료가 "거의 99% 타피오카"라고 "알려졌다"고 보도했다. 1차 통계로는 확인하지 못했다. [^9]
- 한국농정신문(2024)은 농림축산식품부의 2022년 '정부양곡 주정용 공급량'을 인용해, 주정용 쌀 가운데 국내산은 7%였다고 보도했다. 원자료는 열어 보지 못했다. [^10]
- 증류 방식(재밌는 사실 수준): 주정은 원료를 발효시킨 뒤 "연속식으로" 증류해 얻는다. [^3] 식품공전의 소주 정의도 증류식 소주를 "연속식 증류 이외의 방법으로 증류한 것"으로 적어, 연속식 증류를 주정 쪽 방식으로 나눈다. [^2]
- 못 찾음: 타피오카를 어느 나라에서 들여오는지 말하는 1차 자료(정부 통계, 제조사 공식 자료). 검색으로 찾은 상공회의소 보고서와 학술 논문 PDF는 본문을 열지 못해 근거로 세지 않았다.
- 못 찾음: 증류탑 단수 같은 연속식 증류 설비의 구체적 수치를 말하는 1차 자료. 위키 문서에만 있었다.

## 3. 주정은 어디에 쓰여?

- 식품공전은 소주를 "주정을 물로 희석하거나 이에 첨가물 등을 혼합하여 희석한 것"도 포함해 정의한다. 흔히 말하는 희석식 소주가 이 경우다. [^2]
- 하이트진로는 희석식 소주의 주원료가 주정이라고 공시했다. [^6]
- 대한주정판매가 파는 주정은 "소주 등 주류 제조용으로 가장 많이" 쓰인다. [^4]
- 국내 주정은 대한주정판매가 주정 제조회사에서 사들여 소주 회사에 판다. [^6]
- 주정은 술 말고도 식품, 의약, 화장품, 기타 공업용으로 쓰이고, 최근에는 세척, 살균, 소독에도 쓰인다. [^3]
- 대한주정판매는 주정의 살균력 때문에 친환경 소독제와 식음용 제품의 보존에도 쓰인다고 소개한다. [^4]
- 하이트진로는 주정이 화약 제조의 원료로도 쓰여 방위산업에도 영향을 준다고 공시했다. [^6]

## 4. 에탄올 말고 다른 알코올도 있어?

- 화학에서 알코올은 물질 하나가 아니라, 하이드록시기(-OH)가 sp3 탄소(단일 결합만 가진 탄소)에 붙은 화합물 무리를 가리킨다. [^11]
- 일본국어대사전도 アルコール【酒精】 항목에서 알코올을 "탄화수소의 수소 원자를 수산기(-OH)로 바꾼 화합물의 총칭"(페놀류는 뺌)으로 푼다. [^25]
- 알코올은 하이드록시기가 붙은 탄소에 따라 나누며, 메탄올(CH3OH)은 1차 알코올로 센다. [^11]
- 메탄올(메틸알코올)은 연료 첨가제, 용제, 부동액, 자동차 앞유리 세정액을 만드는 데 쓰인다. 냄새나 맛으로 에탄올과 구별하기 매우 어렵다. [^12]
- 캐나다 노스웨스트준주 보건부는 메탄올을 "매우 독성이 강한 알코올"로 적고, 공업용 용제, 부동액, 캠핑 스토브 연료에 들어 있다고 쓴다. [^14]
- 메탄올은 에탄올보다 적은 양(2~8온스)으로도 중독 증상을 일으키고, 시각 장애에서 실명, 다발성 장기 부전까지 이어질 수 있다. [^12]
- 이소프로필알코올(이소프로판올)은 소독제와 국소 소독약(antiseptic)으로 쓰이고, 기름, 수지, 화장품의 용제와 아세톤 원료로도 쓰인다. [^13]
- 노스웨스트준주 보건부는 이소프로필알코올이 손 소독제, 소독용 알코올(rubbing alcohol), 화장품, 세정제에 들어 있고, 삼키면 알코올 중독을 일으킨다고 쓴다. [^14]
- 이소프로필알코올과 n-프로필알코올은 삼켰을 때 에탄올보다 약 2배 독하고, 치사량은 250mL 다(독성학 핸드북 인용, PubChem 수록). [^13]
- 술에 든 알코올은 에탄올이다. 노스웨스트준주 보건부는 술이 아닌 제품의 알코올(메탄올, 이소프로필알코올 등)은 적은 양으로도 생명을 위협해 마시면 안 된다고 쓴다. 같은 자료는 술의 알코올인 에탄올도 손 소독제 같은 술이 아닌 제품에 높은 농도로 들어 있다고 쓴다. [^14]
- 메탄올은 거의 모든 술에 자연적으로 조금 들어 있다. 과일의 펙틴이 효소에 분해되면서 생긴다. 과일 발효로 자연히 생기는 양은 대개 급성 독성 수준을 넘지 않고, 중독은 주로 불법 시장에서 메탄올을 섞은 술 때문에 생긴다. [^15]
- 1986년 국내 연구는 주정 발효 과정에서 생기는 불순물 가운데 메탄올이 원료로 쓴 절간고구마에서 가장 많이, 타피오카에서 그다음으로 많이 생겼다고 보고했다. [^19]
- 고급 알코올(퓨젤 알코올)은 에탄올 발효의 부산물로, 분자 속 탄소가 2개보다 많은 알코올이며 맥주에서 45종까지 확인된다. 효모 균주, 발효 조건, 원료 맥즙의 성분이 그 양을 크게 바꾼다. [^16]
- 이소부틸알코올, 활성 아밀알코올, 이소아밀알코올은 각각 아미노산 발린, 이소류신, 류신과 구조가 이어지는 고급 알코올이며, 효모의 대사에서 만들어진다. [^17]
- 퓨젤유는 소량이면 럼, 브랜디, 위스키에 풍미를 주지만, 많으면 뜨겁고 용제 같은 맛을 낸다. [^18]
- 주정을 만드는 연속식 증류기에서는 퓨젤유(n-프로판올, 이소부탄올, n-부탄올, 이소아밀알코올)를 따로 모아 갈라낸다. [^19]
- 중성 주정(neutral spirit) 증류 설비 모의실험 연구는 메탄올을 없애는 데 탈메탄올탑(demethylizer)이 꼭 필요하고, 정류탑이 남은 고급 알코올을 없앤다고 쓴다. [^20]
- 식품공전의 주정 규격은 메탄올 0.15mg/mL 이하, 퓨젤유 0.01(v/v%) 이하다. 곡물주정은 메탄올 0.5mg/mL 이하, 퓨젤유 0.5(v/v%) 이하다. [^2]
- 엇갈림(퓨젤유에 메탄올이 드는지): 『옥스퍼드 증류주·칵테일 사전』의 O'Neill 은 퓨젤유에 메탄올, 프로판올, 아밀알코올을 넣는다 [^18] / 『옥스퍼드 맥주 사전』의 Spedding 은 퓨젤 알코올을 탄소가 2개보다 많은 고급 알코올로 정의하고 [^16], 1986년 국내 연구도 퓨젤유 성분으로 프로판올, 부탄올, 아밀알코올류만 든다 [^19]. 식품공전도 메탄올과 퓨젤유를 따로 규격한다 [^2]. 또 O'Neill 은 메탄올을 "2차 알코올(secondary alcohols)"이라 부르지만, 유기화학 교재는 메탄올을 1차 알코올로 센다 [^11].
- 못 찾음: "마실 수 있는 알코올은 에탄올뿐"이라고 직접 말하는 1차·기관 출처. 찾은 기관 자료는 술의 알코올이 에탄올이고 다른 알코올은 마시면 안 된다고만 말한다 [^14]. 에틸렌글리콜 같은 다른 독성 알코올의 1차 출처(이번에는 조사하지 않음). IUPAC Gold Book 의 알코올 정의 원문(사이트가 접근을 막음).

## 5. 주정이라는 말의 뜻은?

- 酒(주)의 뜻은 "wine, spirits, liquor, alcoholic beverage", 곧 술이다(유니코드 한자 데이터베이스). [^21]
- 精(정)의 뜻은 "essence; semen; spirit", 곧 정수, 정기다(유니코드 한자 데이터베이스). [^22]
- 표준국어대사전은 주정(酒精)을 화학 용어로 싣고, "에탄의 수소 원자 하나를 하이드록시기로 치환한 화합물"로 풀며 에탄올과 같은 말이라고 적는다. 화학 약품 원료, 용제, 연료, 알코올성 음료 따위로 쓰인다고 덧붙인다. [^23]
- 표준국어대사전에는 소리가 같은 주정(酒酊, 술에 취해 정신없이 말하거나 행동함)이 따로 있다. 술주정의 주정은 이 말이다. [^23]
- 대만 교육부 『중편국어사전』은 酒精(jiǔ jīng)을 발효나 에틸렌 반응으로 얻는 화학 물질로 풀고, 연소와 소독 등에 쓰며 乙醇(에탄올)이라고도 한다고 적는다. [^24]
- 일본어에서 酒精(しゅせい)은 에틸알코올을 뜻한다. 일본국어대사전은 이 말의 가장 이른 용례로 1862년 문헌 『칠신약(七新薬)』을 든다. 『화학사전』은 酒精을 "에틸알코올의 옛말"로 적는다. [^25]
- 일본의 한 백과사전 옛 판은 에틸알코올이 여러 술에 들어 있어 酒精, 곧 "spirit of wine"이라고도 부른다고 적는다. [^25]
- 못 찾음: 한국어 주정(酒精)이 일본어나 중국어에서 들어온 말인지, 또는 alcohol 이나 spirit of wine 의 번역어로 만든 말인지 밝힌 출처. 일본국어대사전의 용례 연도(1862)는 일본어 안의 첫 기록일 뿐이라, 한국어로 들어온 경로의 근거로 쓰지 않는다. 酒·精 두 글자의 한국어 훈(뜻 새김)을 실은 국내 공신력 있는 자전(검색 결과는 민간 사전뿐).

## 6. 위스키도 주정이야?

- 주세법 제5조 제1항은 주류의 종류를 나누며, 주정은 제1호, 위스키는 제3호 증류주류의 한 종류(소주, 위스키, 브랜디, 일반 증류주, 리큐르)로 따로 둔다. [^1]
- 주세법 별표는 주정을 "알코올분 85도 이상으로 증류한 것"으로 적고 [^48], 위스키를 "발아된 곡류와 물을 원료로 하여 발효시킨 술덧을 증류해서 나무통에 넣어 저장한 것" 등으로 적는다. 위스키 항목에는 증류 도수가 없다. [^48]
- 하이트진로 공시의 주류 종류 표는 증류주를 "발효액을 증류하여 빚은 술"로 적는다. [^6] 이 문장은 주세법 별표 원문에는 없다. 공시가 별표를 요약한 표현이다. [^48]
- 주세법 시행령 별표 3은 위스키(별표 제3호 나목 1)~3))를 1년 이상 나무통에 넣어 저장하게 한다. [^50]
- 식품공전도 주류를 15-1 발효주류, 15-2 증류주류, 15-3 기타주류, 15-4 주정으로 나누며, 위스키는 증류주류에, 주정은 따로 15-4 에 둔다. [^2]
- 식품공전은 위스키를 "발아된 곡류와 물을 원료로 하거나 발아된 곡류와 물, 곡류를 원료로 하여 발효시킨 술덧을 증류하여 나무통에 1년 이상 저장한 것 또는 이에 주정, 첨가재료를 혼합한 것"으로 정의한다. 위스키에 주정을 섞을 수는 있지만, 둘은 다른 식품유형이다. [^2]
- 영국 스카치위스키 규정(2009)은 스카치위스키를 원료의 향과 맛이 남도록 알코올 도수 94.8% 미만으로 증류하고, 700L 이하 오크통에서 3년 이상 숙성하며, 최저 도수 40% 로 정한다. [^26]
- 미국 연방 규정은 위스키를 곡물 발효액을 도수 95% 미만으로 증류해 위스키 고유의 맛과 향, 특성을 지닌 것으로 정의하고, 오크통에 저장(콘 위스키는 예외)해 도수 40% 이상으로 병입하게 한다. [^27]
- 같은 미국 규정은 중성 주정(neutral spirits 또는 alcohol)을 도수 95% 이상으로 증류한 증류주로 정의한다. 위스키(95% 미만)와 증류 도수로 갈린다. [^28]
- 주정 쪽은 향을 없애는 것을 목표로 한다. 대한주정판매는 주정을 "무색, 무취, 무미의 알코올 성분"으로 소개하고 [^4], 식품공전은 주정의 성상을 "무색투명하고 부유물 및 이미, 이취가 없을 것"으로 정한다 [^2].
- 위스키 쪽은 향을 남기는 것을 정의에 넣는다. 스카치위스키 규정은 증류액이 "원료에서 온 향과 맛"을 갖게 증류하라고 정하고 [^26], 미국 규정은 위스키 고유의 맛과 향을 갖추라고 정한다 [^27].
- 엇갈림(증류 도수 상한): 스카치위스키 규정은 94.8% 미만 [^26] / 미국 규정은 95% 미만 [^27]
- 엇갈림(숙성 기간): 식품공전과 주세법 시행령 별표 3은 나무통 1년 이상 [^2] [^50] / 스카치위스키 규정은 오크통 3년 이상 [^26] / 미국 규정은 오크통 저장만 정하고 일반 위스키의 최소 기간은 두지 않는다(스트레이트 위스키는 2년) [^27]
- 못 찾음: 한국 법령상 위스키의 증류 도수 상한과 병입 최저 도수. 주세법 별표 제3호 나목(위스키), 시행령 별표 2(주류의 알코올분 도수), 별표 3(원료 사용량 등) 어디에도 위스키의 증류 도수나 최저 도수 조문이 없다. [^48] [^8] [^50] 시행령 별표 2가 주정 말고 종류별 도수를 정한 것은 약주·청주·맥주·과실주 가운데 주정 등을 섞은 것(25도 미만)뿐이다. [^8] 주세법과 시행령의 조문 전체(제80조까지 가지번호 포함)에서도 "위스키"는 제5조와 별표에만 나오고 도수 조문은 없었다. 주세법 시행규칙(재정경제부령 제00001호, 2026-01-02 시행)의 별표는 모두 신고서·승인서 서식이라 해당 내용이 없다. 시행규칙 조문은 제80조까지 번호를 넣어 조회해 7개가 나왔고, 그 가운데 "위스키"나 증류 도수를 다룬 조문은 없었다. 조회가 실패한 조문이 있었는지는 확인하지 못했다. 국세청 고시는 보지 못했다. EU 증류주 규정(2019/787)의 위스키 조항 원문.

## 7. 주정은 왜 향이 거의 없어?

### 기초: 단식 증류와 연속식 증류

- 단식 증류(batch distillation)는 한 번에 한 솥씩 증류하는 방식이다. 증류기를 채우고, 돌리고, 비운 뒤 다음 솥을 다시 채운다. 연속식 증류는 이와 달리 몇 주에서 몇 달씩 멈추지 않고 돌릴 수 있다. (양조 업계 잡지 기사, 2차 자료) [^33]
- 단식 증류에 쓰는 단식 증류기(pot still)는 가장 오래되고 단순한 증류기다. 연속식 증류기(continuous still)는 탑식 증류기(column still), 코피 증류기(Coffey still), 특허 증류기(patent still)라고도 부르며, 네 이름은 같은 것을 가리킨다. [^32]
- 연속식 증류기는 원료 발효액(wash)을 계속 넣는 동안 멈추지 않고 알코올을 뽑아낸다. 탑 안은 구멍 뚫린 금속판(단) 여러 장으로 칸이 나뉘고, 각 단에서 증기와 액체가 맞닿으며 증기에서 물과 퓨젤유가 걸러진다. 이 방식으로 거의 순수한 에탄올을 많이 만들 수 있다. [^31]
- 『옥스퍼드 증류주·칵테일 사전』은 탑에서 빠르게 증류하는 쪽이 단식 증류기에서 오래 끓이는 쪽보다 풍미를 덜 내보내는 것으로 보인다고 쓴다. [^31] 같은 사전은 코피 증류기가 더 독하고 순수한 증류주를 만들었다고 쓴다. [^34]
- 이 구분은 한국 규정과 이어진다. 대한주정판매는 주정을 "연속식으로" 증류해 얻는다고 쓰고 [^3], 식품공전은 증류식 소주를 "연속식 증류 이외의 방법으로 증류한 것"으로 정의한다 [^2].
- 못 찾음: 연속식 증류탑이 단마다 증류를 한 번씩 되풀이하는 효과를 낸다는 설명을 직접 쓴 1차·교재 출처. 찾은 사전 항목은 단에서 증기와 액체가 맞닿아 물과 퓨젤유가 걸러진다고만 쓴다 [^31]. 단식 증류의 정의를 쓴 교재·사전 원문(『옥스퍼드 증류주·칵테일 사전』의 "still, pot" 항목은 열지 못함).

### 향 성분이 걸러지는 원리

- 증류할 때 에탄올과 물은 수많은 다른 휘발성 향 성분을 함께 싣고 나온다. 증류주 향 성분으로는 효모가 발효 중에 만드는 에스터, 증류액의 주된 카르보닐 화합물인 아세트알데하이드, 향 성분 가운데 양이 가장 많은 고급 알코올이 꼽힌다. [^29]
- 증류로 성분을 갈라내는 바탕은 성분끼리의 끓는점 차이다. [^29]
- 단식 증류기(알렘빅)는 높은 도수를 얻으려면 보통 두 번 증류해야 하고, 과일에서 온 향을 더 잘 남긴다. 증류탑은 한 번 증류로 높은 도수를 얻고 증류액을 깨끗하게 만든다. [^29]
- 증류탑에 단(tray)을 더 많이 쓸수록 알코올 농도는 높아지고 향 성분(congener) 농도는 낮아진다. [^29]
- 『옥스퍼드 증류주·칵테일 사전』은 여러 탑을 쓰는 분별 증류와 숯 여과로, 향 성분이 사실상 없고 에탄올과 약간의 물뿐인 증류주를 만들 수 있다고 쓴다. [^30]
- 중성 주정 설비 모의실험 연구에서 탑마다 맡는 성분이 다르다. 추출 증류탑은 아세트산에틸과 아세트알데하이드 대부분을 없애지만 메탄올에는 효과가 없고, 탈메탄올탑이 메탄올을, 정류탑이 남은 고급 알코올을 없앤다. [^20]
- 국내 주정 공장의 연속식 증류기에서도 퓨젤유를 따로 모아 갈라낸다. [^19] 대한주정판매는 주정을 연속식으로 증류하고 [^3], 증류 단계에서 "불순물 제거하고 96%로 농축"한다고 쓴다 [^5].
- 도수와 향의 관계를 보여 주는 규정: 미국 규정은 95% 이상으로 증류하면 중성 주정 [^28], 95% 미만으로 증류해 고유의 맛과 향을 지니면 위스키로 나눈다 [^27]. 식품공전은 에탄올 95% 이상인 주정에 "이미, 이취가 없을 것"과 퓨젤유 0.01(v/v%) 이하를, 85~90% 인 곡물주정에 "고유향미가 있을 것"과 퓨젤유 0.5(v/v%) 이하를 정한다. [^2]
- 무취·무미가 완전히 0인지: 식품공전 주정 규격은 메탄올 0.15mg/mL 이하, 알데히드 1mg/100mL 이하, 퓨젤유 0.01(v/v%) 이하처럼 0이 아닌 상한을 둔다. [^2] 『옥스퍼드 증류주·칵테일 사전』도 "사실상(virtually)" 향 성분이 없다고 쓴다. [^30]
- 못 찾음: 시판 국내 주정에 실제로 남아 있는 향 성분의 측정값. 상한 규격이 있다는 것만으로 미량이 남는다고 단정할 수는 없다. 연속식 증류탑 단수 같은 국내 주정 설비의 구체적 수치(2절과 같음).

## 8. 독자가 아는 술의 도수

> 이 절의 출처는 모두 1번 글 노트(`apps/web/src/content/posts/1/research.md`)에서 옮겼다. 확인일은 1번 노트의 날짜를 그대로 둔다.

- 하이트진로 공식 제품 정보 기준 참이슬 후레쉬는 15.7%, 참이슬 오리지널은 20.1%다(2026-10 확인). [^38] [^39]
- 하이트진로 공식 제품 정보 기준 테라는 4.6%다(2026-10 확인). [^37]
- 맥주 스타일 가이드(BJCP 2021)에서 아메리칸 라거의 도수는 4.2~5.3%다. [^36]
- 국제포도와인기구(OIV) 정의상 와인의 실제 알코올 도수는 8.5% 이상이어야 하고, 지역 법령으로 7%까지 낮출 수 있다. [^35]
- 경기 북부 마트에서 산 시판 생막걸리 6종의 라벨 도수는 모두 6% 였다(2012년 논문, 제조사명은 가림). [^40]
- 주정과 나란히 놓기: 식품공전의 주정 규격은 에탄올 95(v/v%) 이상이고 [^2], 대한주정판매는 식음용 주정을 "알코올 도수 95%"로 적는다 [^3]. 95% 와 참이슬 후레쉬 15.7% [^38] 를 나누면 약 6배다(이 계산 자체는 출처 없음, 실제 제조 배합비를 말하는 출처는 아님).
- 못 찾음: 처음처럼 등 다른 제조사 소주의 공식 제품 도수(1번 노트에 없음, 이번에는 추가 조사하지 않음). 와인의 일반적인 도수 상한과 맥주·막걸리 전체의 일반 범위를 말하는 기관 출처(1번 노트에는 OIV 하한, BJCP 한 스타일, 2012년 논문 표본 6종만 있음).

## 9. 주정은 어떤 술과 제품에 쓰여?

> 법령 확인(2026-10-19): 주세법 별표는 맥주·청주·약주·과실주·위스키·브랜디 항목에서 섞을 수 있는 것을 "대통령령으로 정하는 주류 또는 재료"로만 적는다. 무엇을 섞는지는 주세법 시행령 제3조 제1항과 별표 1이 정하고, 섞는 양은 별표 3이 정한다. [^48] [^49] [^50] 아래 "주세법" 항목은 이 세 곳을 함께 읽은 것이고, "식품공전" 항목은 식품공전 정의 문장만 본 것이다.

### 술: 식품공전 정의에 "주정"이 나오는지

- 식품공전은 주류를 "주정 등 주세법에서 규정한 주류"로 묶는다. 주정도 주류의 하나다. [^2]
- 증류식 소주(식품공전 정의 문장 기준으로는 주정이 없다. 주세법은 아래 항목처럼 섞은 술을 따로 둔다): 식품공전 소주 정의는 "연속식 증류 이외의 방법으로 증류한 것" 또는 "주정을 물로 희석하거나 이에 첨가물 등을 혼합하여 희석한 것"의 두 갈래를 "또는"으로 나눈다. 증류식 갈래의 문장에는 주정이 없고, 주정은 희석식 갈래에만 나온다. [^2]
- 소주(주세법): 주세법 별표 제3호 가목은 소주를 9갈래로 나눈다. 1) 녹말이 포함된 재료, 국과 물로 발효시켜 "연속식증류 외의 방법으로 증류한 것", 5) "주정 또는 곡물주정을 물로 희석한 것", 6) 주정과 곡물주정을 섞어 물로 희석한 것 등이다. 1) 갈래의 문장에는 주정이 없다. [^48]
- 증류식 소주에 주정을 섞은 술(주세법상 소주다): 주세법 별표 제3호 가목 3)은 1) 또는 2)의 소주에 "대통령령으로 정하는 바에 따라 주정 또는 대통령령으로 정하는 곡물주정"을 섞은 것도 소주로 둔다. 시행령 별표 3은 이때 섞는 주정이나 곡물주정의 알코올분이 섞은 뒤 알코올분 총량의 50% 미만이어야 한다고 정한다. [^48] [^50]
- 반대 방향도 있다: 주세법 별표 제3호 가목 8)은 주정을 희석한 소주(5)~7))에 1) 또는 4)의 소주를 섞은 것을 소주로 두고, 시행령 별표 3은 섞는 1)·4) 소주의 알코올분이 50% 미만이어야 한다고 정한다. [^48] [^50]
- 엇갈림(증류식 소주와 주정을 섞은 술): 주세법은 증류식 갈래(1)·2))에 주정이나 곡물주정을 섞은 술을 별표 제3호 가목 3)의 소주로 따로 둔다 [^48] [^50] / 식품공전 소주 정의는 증류식 갈래와 희석 갈래를 "또는"으로 나눌 뿐, 둘을 섞은 술을 따로 말하지 않는다 [^2].
- 못 찾음: 주세법 별표 제3호 가목 3)의 소주(증류식 소주에 주정을 50% 미만 섞은 것)를 라벨에 "증류식 소주"로 적을 수 있는지 정한 표시 기준.
- 소주 정의의 단서는 주세법 별표와 식품공전이 같다. 발아시킨 곡류를 원료로 한 것, 곡류에 물을 뿌려 섞어 밀봉·발효시켜 증류한 것, 자작나무 숯으로 여과한 것을 소주에서 뺀다. [^48] [^2] 주세법은 발아시킨 곡류 가운데 "대통령령으로 정하는 것"은 빼지 않는다고 덧붙인다. [^48]
- 맥주(쓸 수 있다): 식품공전은 맥주를 "발효･제성 과정에 녹말이 포함된 재료, 당분, 캐러멜, 탄산가스, 주정 등을 혼합한 것"까지 포함해 정의한다. [^2] 주세법 별표 제2호 라목 3)은 맥주의 발효·제성 과정에 대통령령으로 정하는 주류 또는 재료를 섞어 "인공적으로 탄산가스가 포함되게 제성한 것"으로서 대통령령으로 정하는 도수 안인 것을 맥주로 두고 [^48], 시행령 별표 1은 여기에 섞을 수 있는 주류를 "주정(주정을 물로 희석한 것을 포함한다)"으로, 별표 2는 그 도수를 25도 미만으로 정한다. [^49] [^8]
- 약주(쓸 수 있다): 식품공전 약주 정의는 "발효･제성 과정에 당분, 과실･채소류, 주정 등을 첨가한 것"을 포함한다. [^2] 주세법 별표 제2호 나목 4)와 시행령 별표 1은 약주에 주정과 소주(별표 제3호 가목 1)~4))를 섞을 수 있게 하고, 시행령 별표 2는 그 도수를 25도 미만으로, 별표 3은 섞는 주류의 알코올분을 섞은 뒤 총량의 20% 이하로 정한다. [^48] [^49] [^8] [^50]
- 청주(쓸 수 있다): 식품공전 청주 정의는 "발효･제성 과정에 주정 등을 첨가한 것"을 포함한다. [^2] 주세법 별표 제2호 다목 2)와 시행령 별표 1은 청주에 주정을 섞을 수 있게 하고, 시행령 별표 2는 그 도수를 25도 미만으로, 별표 3은 섞는 주정의 양을 30도로 희석한 주정 기준 원료용 쌀 1kg 당 2.4L 이하로 정한다. 시행령 별표 1은 당분·산분·조미료·향료·색소를 "주정이 첨가되는 경우에만" 청주에 쓸 수 있게 한다. [^48] [^49] [^8] [^50]
- 위스키(쓸 수 있다): 식품공전 위스키 정의는 "이에 주정, 첨가재료를 혼합한 것"을 포함한다(6절과 같음). [^2] 주세법 별표 제3호 나목 5)와 시행령 별표 1은 위스키에 주정을 섞을 수 있게 하고, 시행령 별표 3은 섞는 주류의 알코올분이 섞은 뒤 총량의 80% 를 넘지 않게 정한다. [^48] [^49] [^50]
- 브랜디(쓸 수 있다): 식품공전 브랜디 정의는 과실주를 증류해 나무통에 1년 이상 저장한 것 "또는 이에 주정, 첨가재료를 혼합한 것"이다. [^2] 주세법 별표 제3호 다목 2)와 시행령 별표 1은 브랜디에 주정을 섞을 수 있게 하고, 시행령 별표 3은 섞는 주류의 알코올분이 섞은 뒤 총량의 80% 를 넘지 않게 정한다. [^48] [^49] [^50]
- 과실주(주세법상 쓸 수 있다): 식품공전 과실주 정의는 술덧에 "과실즙, 탄산가스, 주류 등을 혼합"한 것을 포함하고 주정을 직접 적지는 않는다. [^2] 주세법 별표 제2호 마목 5)와 시행령 별표 1은 과실주에 주정, 브랜디, 일반 증류주를 섞을 수 있게 하고, 시행령 별표 2는 그 도수를 25도 미만으로, 별표 3은 섞는 주류의 알코올분을 섞은 뒤 총량의 80% 이하로 정한다. [^48] [^49] [^8] [^50] 대한주정판매도 주정이 과실주의 원료로 쓰인다고 쓴다. [^41]
- 일반증류주(주세법상 쓸 수 있다): 식품공전은 일반증류주를 고량주, 럼, 진, 보드카, 데킬라처럼 원료를 발효시켜 증류하거나 "증류주를 서로 혼합하여" 만든 것으로 정의하고 주정을 직접 적지 않는다. [^2] 주세법 별표 제3호 라목은 4) "주정이나 그 밖에 알코올분이 포함된 재료를 증류한 주류를 자작나무숯으로 여과하여 무색ㆍ투명하게 제성한 것"과 9) 제1호(주정), 제3호 가목~다목(소주, 위스키, 브랜디)의 주류를 섞은 것을 일반증류주로 둔다. [^48] 대한주정판매는 주정이 보드카의 원료로 쓰인다고 쓴다. [^41]
- 리큐르(주세법 정의에 주정이라는 말은 없음): 식품공전은 리큐르를 "증류주류에 속하는 주류 중 불휘발분이 2도 이상의 것"으로만 정의한다. [^2] 주세법 별표 제3호 마목은 리큐르를 제3호 가목~라목(소주, 위스키, 브랜디, 일반증류주)의 주류에 대통령령으로 정하는 재료를 첨가한 것으로 둔다. 주정(제1호)을 바탕술로 직접 적지는 않는다. [^48] 대한주정판매는 주정이 리큐르의 원료로 쓰인다고 쓴다. [^41]
- 탁주(주정을 섞는 주류 목록에 없음): 식품공전 탁주 정의는 전분질 원료와 국, 물을 발효시킨 술덧을 혼탁하게 제성한 것 또는 탄산가스 등을 첨가한 것이다. [^2] 시행령 별표 1의 "혼합할 수 있는 주류" 표에 탁주는 없다. 다만 탁주(주세법 별표 제2호 가목 3))에 첨가할 수 있는 재료로 "식물(물 또는 주정 등으로 추출한 액을 포함한다)"을 들고, 그 추출액의 알코올분 총량이 최종 제품 알코올분 총량의 5% 를 넘지 못하게 한다. [^48] [^49]
- 기타 주류: 주세법 별표 제4호 다목은 "쌀 및 입국(粒麴: 쌀에 곰팡이류를 접종하여 번식시킨 것)에 주정을 첨가해서 여과한 것"을 기타 주류로 둔다. [^48]
- 대한주정판매는 소주를 주정을 물과 희석하고 첨가제를 넣어 만든다고 쓰고, 소주 말고도 청주, 리큐르, 과실주, 보드카 등의 원료로 주정을 쓴다고 쓴다. [^41]
- 식품공전의 주류 "원료 등의 구비요건" 항목은 비어 있고, 첨가재료는 "주세법에서 정하는 바에 따른다"고만 적는다(WebFetch 요약으로 확인, 원문 문장 미인용). [^2] 주세법 시행령 제3조 제1항은 주류의 종류별로 혼합하거나 첨가할 수 있는 주류 또는 재료를 별표 1로 정한다. [^49]

### 의료용 소독용 에탄올

- 쓴다(대한주정판매 기준): 대한주정판매는 주정을 의료기기 소독용으로 쓰고, 알약(환제·정제)의 살균 코팅용으로도 쓴다고 쓴다. [^41]
- 의약품안전나라에 올라 있는 소독용 에탄올 두 품목은 모두 의약외품이고, 100mL 안에 "에탄올(95)" 83mL(규격 KP, 대한민국약전)를 넣는다. 효능효과는 손과 피부의 소독, 수술 부위 피부의 소독이다. [^42] [^43]
- 못 찾음: 약국용 소독용 에탄올의 원료 에탄올이 주정(발효 주정)인지, 다른 방법으로 만든 에탄올인지 밝힌 1차 출처. 의약품안전나라 품목 정보는 원료를 "에탄올(95)"로만 적고 원료의 출처를 적지 않는다. [^42] [^43] 대한민국약전의 "에탄올"·"소독용에탄올" 항목 원문도 열지 못했다(검색 결과는 일본약전 자료뿐).

### 화장품

- 쓴다(대한주정판매 기준): 대한주정판매는 주정이 백분, 크림, 화장수, 향수, 바디 로션, 탈취제, 애프터셰이브 로션 같은 화장품의 원료를 녹이는 데 쓰이고, 샴푸, 린스, 헤어스프레이, 헤어젤의 원료 성분을 녹이거나 액상으로 유지하는 데 쓰인다고 쓴다. [^41]
- 대한화장품협회는 에탄올(에틸알코올)이 "알코올 음료에 들어있는 알코올"과 같다고 쓰고, 변성알코올이 메이크업, 로션, 향수, 스킨케어, 헤어케어 제품에서 거품형성방지제, 미용 수렴제, 용매, 점도감소제로 쓰인다고 쓴다. [^44] [^45]
- 대한화장품협회는 미국을 포함한 대부분의 국가에서 식품, 음료, 먹는 의약품이 아닌 제품에 알코올을 쓰려면 변성알코올을 써야 한다고 쓴다. 한국 규정을 따로 말하지는 않는다. [^45]
- 못 찾음: 한국에서 화장품에 쓰는 에탄올이 반드시 변성된 것이어야 하는지 정한 식약처 규정 원문. 화장품 원료 에탄올 가운데 주정(발효 주정)의 비중.

### 손 소독제

- 에탄올 기반이다(조사한 품목 기준): 의약품안전나라의 손 소독 겔 품목(의약외품)은 100g 안에 유효 성분 에탄올 70.00g 을 넣고, 효능효과를 "손, 피부 등의 살균 소독"으로 적는다. 이 품목의 정보에도 원료가 주정인지는 적혀 있지 않다. [^46]
- 쓴다(2020년 사례, 언론 보도): 데일리안(2020)은 국세청 설명을 옮겨, 코로나19 때 손소독제 원료인 에탄올이 부족해지자 국세청 공무원이 소주 원료인 주정을 손소독제용으로 빨리 용도를 바꿀 수 있게 하고, 보통 30일 걸리는 소독제용 주정 생산 행정절차를 4일로 줄였다고 보도했다. 국세청 원문 자료는 열어 보지 못했다. [^47]
- 대한주정판매는 주정이 살균 소독 용품의 원료로 쓰이고 [^41], 친환경 소독제에도 쓰인다고 쓴다 [^4]. 손 소독제를 따로 들지는 않는다.
- 못 찾음: 국내 손 소독제 전체 가운데 주정으로 만든 제품의 비중, 손 소독제 에탄올 함량 기준(의약외품 표준제조기준) 고시 원문.

## 참고 자료

[^1]: 대한민국, 주세법 제2조(정의) 제1호, 제5조(주류의 종류), 법률 제20618호(2024-12-31 공포, 2025-01-01 시행), 국가법령정보센터, 2025, https://www.law.go.kr/법령/주세법/제2조 , https://www.law.go.kr/법령/주세법/제5조. 확인일 2026-10-19(`.claude/scripts/law.mjs` 조회). 근거 문장: 제2조 "1. "주류"란 다음 각 목의 것을 말한다." / "가. 주정(酒精)[희석하여 음용할 수 있는 에틸알코올을 말하며, 불순물이 포함되어 있어서 직접 음용할 수는 없으나 정제하면 음용할 수 있는 조주정(粗酒精)을 포함한다]" / "나. 알코올분 1도 이상의 음료[용해하여 음용할 수 있는 가루 상태인 것을 포함하되, 「약사법」에 따른 의약품 및 알코올을 함유한 조미식품으로서 대통령령으로 정하는 것은 제외한다]" / "다. 나목과 유사한 것으로서 대통령령으로 정하는 것". 제5조 "① 주류의 종류는 다음과 같다." / "1. 주정" / "3. 증류주류 가. 소주 나. 위스키 다. 브랜디 라. 일반 증류주 마. 리큐르" / "② 제1항에 따른 주류의 종류별 세부 내용은 별표와 같다." (이전 판은 nepla 법령 미러 https://www.nepla.ai/law/주세법 를 썼고, 문구는 원문과 같았다.)
[^2]: 식품의약품안전처, 식품의 기준 및 규격 제5. 식품별 기준 및 규격 15. 주류, 식품안전나라, 현행, https://www.foodsafetykorea.go.kr/popup/safefoodlife/food/foodRvlv/foodRvlvDetail.do?rvlv_no=35. 확인일 2026-10-19. 근거 문장: "주정이라 함은 전분질 원료 또는 당질 원료를 발효시켜 증류한 것이나 조주정을 증류한 것으로 희석하여 음용 할 수 있는 에탄올을 말한다." / "단, 불순물이 포함되어 있어서 직접 음용 할 수는 없으나 정제하면 음용 할 수 있는 조주정(粗酒精)은 제외한다." / "소주라 함은 전분질 원료, 국(麴), 물 등을 원료로 발효시켜 연속식 증류 이외의 방법으로 증류한 것 또는 주정을 물로 희석하거나 이에 첨가물 등을 혼합하여 희석한 것을 말한다." / 규격표: 에탄올(v/v%) 주정 "95 이상", 곡물주정 "85~90". 4·6·7절 추가 인용: 15-4 주정 규격표 성상 주정 "무색투명하고 부유물 및 이미, 이취가 없을 것", 곡물주정 "무색투명하고 고유향미가 있을 것" / 메탄올(mg/mL) 주정 "0.15 이하", 곡물주정 "0.5 이하" / 퓨젤유(v/v%) 주정 "0.01 이하", 곡물주정 "0.5 이하" / 알데히드(아세트알데히드 mg/100mL) 주정 "1 이하" / "위스키라 함은 발아된 곡류와 물을 원료로 하거나 발아된 곡류와 물, 곡류를 원료로 하여 발효시킨 술덧을 증류하여 나무통에 1년 이상 저장한 것 또는 이에 주정, 첨가재료를 혼합한 것을 말한다." / 식품유형 구분 "15-2 증류주류"(소주, 위스키, 브랜디, 일반증류주, 리큐르), "15-4 주정"(15-1 발효주류, 15-3 기타주류 포함 구분은 WebFetch 요약으로 확인). 9절 추가 인용: "주정 등 주세법에서 규정한 주류를 말한다." / "맥주라 함은 발아한 맥류, 홉, 전분질 원료, 물 등을 원료로 하여 발효시켜 제성하거나 여과하여 제성한 것 또는 발효･제성 과정에 녹말이 포함된 재료, 당분, 캐러멜, 탄산가스, 주정 등을 혼합한 것을 말한다." / "약주라 함은 전분질 원료(발아 곡류 제외)와 국(麴), 식물성 원료, 물 등을 원료로 하여 발효시킨 술덧을 여과하여 제성한 것 또는 발효･제성 과정에 당분, 과실･채소류, 주정 등을 첨가한 것을 말한다." / "청주라 함은 곡류 중 쌀(찹쌀 포함), 국(麴), 물을 원료로 하여 발효시킨 술덧을 여과하여 제성한 것 또는 발효･제성 과정에 주정 등을 첨가한 것을 말한다." / "브랜디라 함은 과실주(과실주 지게미 포함)를 증류하여 나무통에 1년 이상 저장한 것 또는 이에 주정, 첨가재료를 혼합한 것을 말한다." / "과실주라 함은 과실 또는 과실에 당분을 첨가하여 발효하거나 술덧에 과실즙, 탄산가스, 주류 등을 혼합하고 여과･제성한 것을 말한다." / "일반증류주라 함은 고량주, 럼, 진, 보드카, 데킬라 등과 같이 전분, 당분이 포함된 원료를 발효시켜 증류하거나 증류주를 서로 혼합하여 제조한 것으로서 소주, 위스키 또는 브랜디에 해당하지 않는 것을 말한다." / "리큐르라 함은 증류주류에 속하는 주류 중 불휘발분이 2도 이상의 것을 말한다." / "탁주라 함은 전분질 원료(발아 곡류 제외)와 국(麴), 물을 주된 원료로 하여 발효시킨 술덧을 혼탁하게 제성한 것 또는 그 발효 ･제성 과정에 탄산가스 등을 첨가한 것을 말한다." / 소주 단서 "다만, 발아시킨 곡류를 원료의 전부 또는 일부로 한 것, 곡류에 물을 뿌려 섞어 밀봉･발효시켜 증류한 것 또는 자작나무 숯으로 여과한 것은 제외한다."
[^3]: 대한주정판매(주), 주정 소개 - 주정의 원료 및 종류, 대한주정판매, 연도 미상, https://www.ethanol.co.kr/bbs/content.php?co_id=drinking_02. 확인일 2026-10-19. 근거 문장: "발효주정은 전분질(쌀, 보리, 고구마, 타피 오카) 또는 당질(사탕수수, 사탕무)을 발효 시킨 후 연속식으로 증류하여 얻은 알코올 도수 95%의 식음용 주정입니다." / "전분질 원료는 쌀, 보리, 쌀보리, 밀, 수수, 고구마, 타피오카 등이 있으며, 당질 원료는 사탕수수, 사탕무 등이 있습니다." / "주로 설탕 제조의 부산물인 당밀(MOLASSESS)이 사용되며, 그 외 사탕수수(SUGAR CANE), 사탕무(SUGAR BEAT) 및 원당을 사용" / "우리나라는 전분질 원료로 주정을 만들고 있으며, 사탕수수 등이 많이 생산되는 나라에서는 당질 원료를 사용합니다." / "술의 주원료로 사용되며, 이외에도 식품과 의약, 화장품, 기타 공업용 등 다양하게 사용됩니다." / "최근에는 세척, 살균, 소독 등의 용도로도 우리생활에 다양하게 사용되고 있습니다."
[^4]: 대한주정판매(주), 주정 소개 - 주정이란, 대한주정판매, 연도 미상, https://www.ethanol.co.kr/bbs/content.php?co_id=drinking_01. 확인일 2026-10-19. 근거 문장: "주정은 무색, 무취, 무미의 알코올 성분으로" / "소주 등 주류 제조용으로 가장 많이 사용되고 있습니다." / "친환경 소독제 및 식음용 제품의 보존"
[^5]: 대한주정판매(주), 주정 소개 - 주정의 제조공정, 대한주정판매, 연도 미상, https://www.ethanol.co.kr/bbs/content.php?co_id=drinking_03. 확인일 2026-10-19. 근거 문장: "발효 후 생성된 알코올에 열을 가해 불순물 제거하고 96%로 농축"
[^6]: 하이트진로 주식회사, 증권신고서(채무증권), 금융위원회 제출(KRX KIND 공시), 2025, https://kind.krx.co.kr/external/2025/02/24/000997/20250224002607/10002.htm. 확인일 2026-10-19. 근거 문장: 주류의 종류 표 주정 행 "녹말 또는 당분을 발효시켜 알코올분 85도 이상으로 증류한 것" (출처 표기 "「주세법」, 주류의 종류별 세부내용") / "희석식소주의 주원료는 주정으로서 고구마, 쌀, 보리 등의 국산원료와 수입원료인 타피오카 및 조주정을 사용하여 주정 제조회사에서 생산하고 있습니다." / "대한주정판매는 주정 제조회사로부터 주정을 매입하여 당사를 포함한 소주 회사에 이를 판매하고 있습니다." / "주류의 원료인 주정의 경우 화약제조의 원료로도 사용되므로 방위산업에까지 영향을 미칩니다." / 6절 추가 인용: 주류의 종류 표 증류주 행(종류 "소주, 위스키, 브랜디, 일반증류주, 리큐르") "발효액을 증류하여 빚은 술"
[^7]: National Center for Biotechnology Information, PubChem Compound CID 702 Ethanol - Synonyms, PubChem, 확인 시점 현행, https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/702/synonyms/JSON. 확인일 2026-10-19. 근거 문장: 동의어 목록 "ethanol", "ethyl alcohol", "alcohol"
[^8]: 대한민국, 주세법 시행령 [별표 2] 주류의 알코올분 도수(제3조제2항 관련) 제1호 가목, 제2호, 대통령령 제36136호(2026-02-27 공포·시행, 별표 2 개정 2025-02-28), 국가법령정보센터, 2026, https://www.law.go.kr/법령/주세법 시행령. 확인일 2026-10-19(`.claude/scripts/law.mjs` 조회, 1번 글 노트 [^17] 과 같은 별표). 근거 문장: "가. 법 제6조 및 별표에 따라 주정의 알코올분 도수는 95도 이상이어야 한다. 다만, 법 별표 제3호가목3)에 따른 곡물주정은 곡류를 원료로 한 주정으로서 알코올분 도수는 85도 이상 90도 이하여야 한다." / 제2호 표 "가. 법 별표 제2호나목4)", "나. 법 별표 제2호다목2)", "다. 법 별표 제2호라목3)", "라. 법 별표 제2호마목5)" → "알코올분 25도 미만". (이전 판은 위키문헌의 2016년 판본 시행령 제1조 제1항, 대통령령 제27075호, https://ko.wikisource.org/wiki/대한민국_주세법_시행령 을 썼다: "주정의 알코올분은 95도 이상으로 한다." / "다만, 법 별표 제3호가목3)에 따른 곡물주정은 곡물을 원료로 한 주정으로서 알코올분 85도 이상 90도 이하인 것으로 한다.")
[^9]: 이재현, [기획] 글로벌시장 패권 노리는 태국 '타피오카' (상), 식품음료신문, 2023, https://www.thinkfood.co.kr/news/articleView.html?idxno=97324. 확인일 2026-10-19. 근거 문장: "요즘은 거의 99% 타피오카를 원료로 주정을 만드는 것으로 알려졌다."
[^10]: 김한수, 한국에 남아도는 쌀, 원인은 '수입쌀', 한국농정신문, 2024, http://www.ikpnews.net/news/articleView.html?idxno=63950. 확인일 2026-10-19. 근거 문장: "지난 2022년 농림축산식품부가 공개한 '정부양곡 주정용 공급량'을 봐도 소주에 들어가는 주정용 쌀이 국내산인 경우는 7%에 불과했다."
[^11]: Steven Farmer, Dietmar Kennepohl, Layne Morsch, Organic Chemistry (Morsch et al.) 17.S: Alcohols and Phenols (Summary), LibreTexts Chemistry, 연도 표기 없음, https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_(Morsch_et_al.)/17:_Alcohols_and_Phenols/17.S:_Alcohols_and_Phenols_(Summary). 확인일 2026-10-19. 근거 문장: "Alcohols have hydroxide groups (OH) bonded to an sp3 carbon." / 분류와 메탄올은 같은 LibreTexts 의 Wade 교재 13.02 Classification of Alcohols(https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Map%3A_Organic_Chemistry_(Wade)_Complete_and_Semesters_I_and_II/Map%3A_Organic_Chemistry_(Wade)/13%3A_Structure_and_Synthesis_of_Alcohols/13.02%3A_Classification_of_Alcohols): "To classify alcohols, we look at the carbon atom bonded to the hydroxyl group." / "Methanol, CH3OH, is counted as a primary alcohol"
[^12]: Pan American Health Organization/World Health Organization, Epidemiological Alert: Methanol poisoning risk, 7 October 2025, PAHO/WHO, 2025, https://www.paho.org/sites/default/files/2025-10/2025-oct-07-phe-methanol-poisoning-alert-final.pdf. 확인일 2026-10-12(1번 글 노트 [^58] 재사용). 근거 문장: "Methanol (also called methyl alcohol) is a type of alcohol that is generally used as a fuel additive and in the manufacture of basic chemicals such as solvents, antifreeze fluids, and windscreen wash. It is very difficult to differentiate methanol from ethanol by its smell or taste." / "Poisoning symptoms can occur with small volumes of methanol (e.g., 2-8 ounces) than ethanol" / "Subsequently, visual disturbances (blurred vision, photopsia, scotomas) may manifest and may progress to blindness. In advanced stages, neurological involvement (confusion, lethargy, seizures) and multiorgan failure are observed"
[^13]: National Center for Biotechnology Information, PubChem Compound CID 3776 Isopropanol(Uses, Human Toxicity Excerpts), PubChem, 확인 시점 현행, https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/3776/JSON?heading=Uses , https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/3776/JSON?heading=Human+Toxicity+Excerpts. 확인일 2026-10-19. 근거 문장: "Used as a disinfectant"(Haz-Map) / "also used as a solvent for oils, resins, cosmetics, and many other household products"(Haz-Map) / "Topically, it is used as an antiseptic."(T3DB) / "It is used in the manufacture of acetone and its derivatives and as a solvent."(T3DB) / "Isopropyl and n-propyl/ alcohols are about twice as toxic as ethanol; the fatal dose by ingestion is 250 mL."(Dreisbach, Handbook of Poisoning, 1987, HSDB 수록)
[^14]: Government of the Northwest Territories Health and Social Services, Non-beverage Alcohols, 캐나다 노스웨스트준주 정부, 연도 표기 없음, https://www.hss.gov.nt.ca/en/services/drugs-nwt/non-beverage-alcohols. 확인일 2026-10-19. 근거 문장: "The type of alcohol that is in alcoholic beverages – ethanol (ethyl alcohol)" / "can also be found at high concentrations in non-beverage products like hand sanitizer" / "Methanol (methyl alcohol or wood alcohol) is a highly toxic form of alcohol" / "industrial solvents, antifreeze, camping stoves" / "Isopropanol (isopropyl alcohol) can cause alcohol poisoning if swallowed." / "hand sanitizers, rubbing alcohol, cosmetics, cleaning products" / "Non-beverage alcohols are not safe to consume and can be life-threatening even in small amounts."
[^15]: Patrik Blumenthal 외 7인, Methanol Mitigation during Manufacturing of Fruit Spirits with Special Consideration of Novel Coffee Cherry Spirits, Molecules 26(9):2585, MDPI, 2021, https://publikationen.bibliothek.kit.edu/1000133190/114521762 (doi:10.3390/molecules26092585). 확인일 2026-10-12(1번 글 노트 [^59] 재사용). 근거 문장: "Methanol is an alcohol that is typically found in almost all kinds of alcoholic beverages and some other fermented food products" / "such poisonings typically occur from methanol addition to spirits (mostly found on the illicit market), while the natural content due to fermentation from fruits does not typically exceed levels causing acute toxicity"
[^16]: Gary Spedding, fusel alcohols, The Oxford Companion to Beer(Garrett Oliver 편), Oxford University Press, 2012, https://beerandbrewing.com/dictionary/nXV1H11MgY. 확인일 2026-10-19. 근거 문장: "are by-products of ethanol fermentation." / "as many as 45 higher alcohols, those with more than two carbon atoms in the molecule" / "The yeast strain, fermentation conditions, and wort composition all have significant effects"
[^17]: Ramon Gonzalez, Pilar Morales, Wine secondary aroma: understanding yeast production of higher alcohols, Microbial Biotechnology 10(6):1449-1450, 2017, https://pmc.ncbi.nlm.nih.gov/articles/PMC5658600/ (doi:10.1111/1751-7915.12770). 확인일 2026-10-19. 근거 문장: "structurally related to valine, isoleucine and leucine respectively" / "linked through the Ehrlich pathway" / "the main origin of these branched‐chain alcohols"(효모 중심 탄소 대사를 가리킴)
[^18]: Darcy O'Neill, fusel oil, The Oxford Companion to Spirits & Cocktails(David Wondrich, Noah Rothbaum 편), Oxford University Press, 2021, https://spiritsanddistilling.com/dictionary/acref-9780199311132-e-562. 확인일 2026-10-19. 근거 문장: "is a category of organic compounds that are byproducts of alcoholic fermentation." / "These include secondary alcohols like methanol, propanol, and amyl alcohol" / "When present in small amounts they provide flavor to spirits like rum, brandy, and whisky." / "hot, solvent-like flavor"
[^19]: 류병호, 김운식, 남기두, 이인기, 하미숙, 대규모의 주정발효 과정에서 생성된 불순물과 그 효율적 분리, 산업미생물학회지 14(5):371-376, 한국미생물생명공학회, 1986, https://old.newnonmun.com/article=10059093. 확인일 2026-10-19. 초록만 확인함. 근거 문장: "주정발효공정중에 생성되는 불순물 중 methanol은 절간고구마가 가장 많이 생성되었고 그 다음이 타피오카였다." / "한편 supper-allospas식 연속증류기에 의한 fusel oil의 분리시 alcohol함량에 따른 집적율을 보면" / "나머지는 다시 fusel oil분리기에 넣어 alcohol이 20％(v/v) 되도록 가수하여 분리하였다." / 퓨젤유 성분 "n-propanol", "iso-butanol", "n-butanol", "iso-amyl alcohol"
[^20]: M. Decloux, J. Coustel, Neutral spirit production: simulation of a distillation plant, Industrie delle Bevande 35(206):573-590, 2006, FAO AGRIS 초록, https://agris.fao.org/search/ar/records/64724805e17b74d2224f7197. 확인일 2026-10-19. 초록만 확인함. 근거 문장: "eliminates the majority of ethyl acetate and acetaldehyde" / "but has no action on methanol" / "the demethylizer column is essential to eliminate methanol" / "the rectifier column makes it possible to eliminate the remaining high alcohols"
[^21]: Unicode Consortium, Unihan Database U+9152 酒, unicode.org, 확인 시점 현행, https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=9152. 확인일 2026-10-19. 근거 문장: kDefinition "wine, spirits, liquor, alcoholic beverage" / kHangul "주"
[^22]: Unicode Consortium, Unihan Database U+7CBE 精, unicode.org, 확인 시점 현행, https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=7CBE. 확인일 2026-10-19. 근거 문장: kDefinition "essence; semen; spirit" / kHangul "정"
[^23]: 국립국어원, 표준국어대사전 "주정", 국립국어원, https://stdict.korean.go.kr/search/searchResult.do?pageSize=10&searchKeyword=주정. 확인일 2026-10-19. 근거 문장: 주정5(酒精) "『화학』 에탄의 수소 원자 하나를 하이드록시기로 치환한 화합물. 무색투명한 휘발성 액체로, 특유한 냄새와 맛을 가지며, 인체에 흡수되면 흥분이나 마취 작용을 일으킨다." / "화학 약품의 합성 원료, 용제, 연료, 알코올성 음료 따위로 쓰인다. 화학식은 C2H5OH.=에탄올." / 주정6(酒酊) 뜻풀이 "술에 취해 정신없이 말하거나 행동함"(WebFetch 요약으로 확인, 원문 문장 미인용)
[^24]: 中華民國教育部, 重編國語辭典修訂本 "酒精", 教育部, 확인 시점 현행, https://dict.revised.moe.edu.tw/dictView.jsp?ID=92282. 확인일 2026-10-19. 근거 문장: "一種化學物品。可用發酵方法，亦可用石油工業的副產品乙烯，加硫酸和水反應取得。其用途廣泛，可用來燃燒、消毒等。也稱為「乙醇」。" / 漢語拼音 "jiǔ jīng"
[^25]: コトバンク(朝日新聞社·VOYAGE MARKETING), "酒精" 항목(精選版 日本国語大辞典, デジタル大辞泉, 化学辞典 第2版, 改訂新版 世界大百科事典 등 수록), kotobank.jp, 확인 시점 현행, https://kotobank.jp/word/酒精. 확인일 2026-10-19. 근거 문장: デジタル大辞泉 "エチルアルコール"のこと / 日本国語大辞典 しゅ‐せい【酒精】 용례 「沃顛は〈略〉水に溶し難し、但酒精には能く溶解す」(七新薬, 1862) / 日本国語大辞典 アルコール【酒精】 「炭化水素の水素原子を水酸基（-OH）で置換した化合物の総称」 / 化学辞典 第2版 「エチルアルコールの古語．」 / 世界大百科事典 旧版 「各種のアルコール飲料に含まれているので酒精spirit of wineともいう。」. 원어 표기(네덜란드어·영어 alcohol)와 페놀류 제외는 WebFetch 요약으로 확인, 원문 문장 미인용.
[^26]: UK Government, The Scotch Whisky Regulations 2009 (SI 2009/2890) regulation 3, legislation.gov.uk, 2009, https://www.legislation.gov.uk/uksi/2009/2890/regulation/3. 확인일 2026-10-19. 근거 문장: "distilled at an alcoholic strength by volume of less than 94.8 per cent" / "so that the distillate has an aroma and taste derived from the raw materials used in" / "that has been matured only in oak casks of a capacity not exceeding 700 litres" / "that has been matured for a period of not less than three years" / "that has a minimum alcoholic strength by volume of 40%"
[^27]: U.S. Code of Federal Regulations, 27 CFR § 5.143 Whisky, Legal Information Institute(Cornell Law School), https://www.law.cornell.edu/cfr/text/27/5.143. 확인일 2026-10-19(1번 글 노트 [^19]와 같은 조문). 근거 문장: "an alcoholic distillate from a fermented mash of any grain" / "distilled at less than 95 percent alcohol by volume (190° proof)" / "the taste, aroma, and characteristics generally attributed to whisky" / "not less than 40 percent alcohol by volume (80° proof)" / 스트레이트 위스키 2년은 1번 글 노트 [^19] 근거 문장 "Charred new oak barrels at 125° or less for a minimum of 2 years"
[^28]: U.S. Code of Federal Regulations, 27 CFR § 5.142 Neutral spirits and vodka, Legal Information Institute(Cornell Law School), https://www.law.cornell.edu/cfr/text/27/5.142. 확인일 2026-10-19. 근거 문장: "distilled spirits distilled from any suitable material at or above 95 percent alcohol by volume (190° proof)"
[^29]: Nermina Spaho, Distillation Techniques in the Fruit Spirits Production, in M. F. Mendes(편) Distillation - Innovative Applications and Modeling, IntechOpen, 2017, https://www.intechopen.com/chapters/54078 (doi:10.5772/66774). 확인일 2026-10-19. 근거 문장: "ethanol and water are the carriers of a huge number of the other volatile aroma compounds." / "Esters are formed during alcoholic fermentation via yeast metabolism." / "The major carbonyl compound in distillates is acetaldehyde." / "The higher alcohols are quantitatively the largest group of the aroma volatile compounds." / "The basis for the component separation is differences in their boiling points." / "Distillation in alembic pot stills requires multiple distillations (usually double) to achieve high degree of alcohol." / "Alembic stills yield better aroma that comes from fruit, the so-called primary flavour." / "Batch distillation column style requires just one distillation to achieve high alcohol degree." / "Column still cleans the distillate giving a decent aroma and higher concentration of alcohol." / "As more trays are used in distillation, a greater concentration of alcohol" / "lower concentration of congeners are obtained"
[^30]: David Wondrich, rectification, The Oxford Companion to Spirits & Cocktails(David Wondrich, Noah Rothbaum 편), Oxford University Press, 2021, https://www.spiritsanddistilling.com/dictionary/acref-9780199311132-e-646. 확인일 2026-10-19. 근거 문장: "is the process of removing congeners from a spirit by redistillation, filtration, or precipitation" / "using modern, multiple-column fractional distillation and charcoal filtration" / "it is possible to make a spirit that has virtually no congeners" / "that is perfectly rectified, being merely ethanol and water, and precious little of the latter."
[^31]: David Wondrich, Darcy O'Neil, still, continuous, The Oxford Companion to Spirits & Cocktails(David Wondrich, Noah Rothbaum 편), Oxford University Press, 2021, https://www.spiritsanddistilling.com/dictionary/acref-9780199311132-e-682. 확인일 2026-10-19. 근거 문장: "as long as wash continues to be fed into the still" / "a number of perforated metal plates that divide the interior into discrete compartments" / "The contact between the vapor and liquid in the plates helps to strip the vapor of water and fusel oils." / "capable of producing almost pure ethanol" / "seems to release less flavor than long boiling in a pot"
[^32]: David Wondrich, still, types of, The Oxford Companion to Spirits & Cocktails(David Wondrich, Noah Rothbaum 편), Oxford University Press, 2021, https://www.spiritsanddistilling.com/dictionary/acref-9780199311132-e-1308. 확인일 2026-10-19. 근거 문장: "The oldest and simplest is the pot still" / "the continuous still, the column still, the Coffey still, and the patent still, all of which denote the same thing."
[^33]: Gabe Toth, Running a Pot Still to Batch Produce Spirits, Spirits & Distilling, 2025, https://spiritsanddistilling.com/running-a-pot-still-to-batch-produce-spirits. 확인일 2026-10-19. 업계 잡지 기사(2차 자료). 근거 문장: "The function is in the name: As a distiller, you fill the still before each use, run it, then empty and possibly refill it." / "one batch at a time"(연속식 증류는 몇 주에서 몇 달씩 돌릴 수 있다는 대비는 WebFetch 요약으로 확인, 원문 문장 미인용)
[^34]: Charles MacLean, Coffey, Aeneas, The Oxford Companion to Spirits & Cocktails(David Wondrich, Noah Rothbaum 편), Oxford University Press, 2021, https://www.spiritsanddistilling.com/dictionary/acref-9780199311132-e-1328. 확인일 2026-10-19. 근거 문장: "double columns—the analyzer and the rectifier—made from copper" / "produced a stronger and purer spirit"
[^35]: International Organisation of Vine and Wine(OIV), International Code of Oenological Practices, I.3.1 Basic definition, OIV, 연도 표기 없음, https://www.oiv.int/node/2166/download/pdf. 확인일 2026-10-12. 근거 문장: "Wine is the beverage resulting exclusively from the partial or complete alcoholic fermentation of fresh grapes, whether crushed or not, or of grape must. Its actual alcohol content shall not be less than 8.5% vol." / "the minimum total alcohol content may be able to be reduced to 7% vol. by legislation particular to the region considered." (1번 글 노트 [^21] 에서 옮김)
[^36]: Beer Judge Certification Program(BJCP), 2021 Style Guidelines 1B. American Lager, BJCP, 2021, https://www.bjcp.org/style/2021/1/1B/american-lager/. 확인일 2026-10-12. 근거 문장: "OG: 1.040 - 1.050" / "FG: 1.004 - 1.010" / "IBU: 8 - 18" / "ABV: 4.2% - 5.3%" / "Low to medium-low body. Very highly carbonated with slight carbonic bite on the tongue." (1번 글 노트 [^22] 에서 옮김)
[^37]: 하이트진로, TERRA 제품 정보, 하이트진로, https://www.hitejinro.com/brand/view.asp?brandcd2=A10. 확인일 2026-10-12. 근거 문장: "알코올 4.6%" (1번 글 노트 [^23] 에서 옮김)
[^38]: 하이트진로, 참이슬 fresh 제품 정보, 하이트진로, https://www.hitejinro.com/brand/view.asp?brandcd2=B01. 확인일 2026-10-12. 근거 문장: "알코올 15.7%" (1번 글 노트 [^24] 에서 옮김)
[^39]: 하이트진로, 참이슬 오리지널 제품 정보, 하이트진로, https://www.hitejinro.com/brand/view.asp?brandcd2=B02. 확인일 2026-10-12. 근거 문장: "알코올 20.1%" (1번 글 노트 [^25] 에서 옮김)
[^40]: 지윤정, 정해정, 일부 시판 생막걸리 제품의 저장기간에 따른 품질 특성 변화, 한국식생활문화학회지 27(4):383-390, 2012, https://koreascience.or.kr/article/JAKO201225150622898.pdf. 확인일 2026-10-11(2번 글 노트 [^90] 에서 재사용, 이번에 다시 열지 않음). 근거 문장: "본 실험에서는 경기 북부의 중ㆍ대형마트에서 판매되고 있는 생막걸리 6 종류를" / "<Table 1> Description of 6 samples of commercial Makgeolli", 열 "Alcohol content (%)" A~F 모두 "6%" (1번 글 노트 [^113] 에서 옮김)
[^41]: 대한주정판매(주), 주정의 용도 - 용도별 제품소개, 대한주정판매, 연도 미상, https://www.ethanol.co.kr/bbs/content.php?co_id=purpose_01. 확인일 2026-10-19. 근거 문장: "소주에는 곡류를 발효 및 증류해 맛과 풍미가 뛰어난 주정을 물과 희석하고 첨가제를 넣어 제조합니다." / "주정은 소주 이외에도 청주, 리큐르, 과실주, 보드카 등 다양한 주류의 원료로 사용하고 있습니다." / "주정은 살균력이 뛰어나 각종 살균 소독 용품의 원료로 사용되고 있습니다" / "주정은 의료기기 등의 소독용으로 사용하고 있습니다." / "주정은 환제(丸劑) 및 정제(錠劑) 제조 등에 식용 살균 코팅용으로 사용되고 있습니다." / "주정은 백분, 크림, 화장수, 향수, 오데코롱, 데토일렛, 바디 로션, 탈취제, 에프터쉐이브 로션 등의 원료를 녹이는데 사용 됩니다." / "주정은 샴푸, 린스, 헤어스프레이, 헤어젤 등의 제조 시 원료 성분을 용해시키거나 액상으로 유지하기 위해 사용 됩니다."
[^42]: 식품의약품안전처, 의약품안전나라 의약품 등 정보 "메딕소독용에탄올에이(에탄올(95)) 외 2종"(주식회사두원사이언스제약, 품목기준코드 201506520), 의약품안전나라, 확인 시점 현행, https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=201506520. 확인일 2026-10-19. 근거 문장: 원료약품 및 분량(100 mL 중) "에탄올(95) 83 밀리리터 KP" / 효능효과 "손 및 피부의 소독", "수술부위 피부의 소독" / 검색 목록 구분 "의약외품"
[^43]: 식품의약품안전처, 의약품안전나라 의약품 등 정보 "성광소독용에탄올(무색) 외 2종"((주)퍼슨, 품목기준코드 200411152), 의약품안전나라, 확인 시점 현행, https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=200411152. 확인일 2026-10-19. 근거 문장: 원료약품 및 분량(100 mL 중) "에탄올(95)", "83", "밀리리터", "KP" / 효능효과 "손 및 피부의 소독", "수술부위 피부의 소독", "의료용구의 소독" / 검색 목록 구분 "의약외품"
[^44]: 대한화장품협회, 소비자를 위한 화장품 상식 - 성분 해설 "알코올", 대한화장품협회, 연도 미상, https://kcia.or.kr/pedia/search/search_01_view.php?no=4. 확인일 2026-10-19. 근거 문장: "종종 우리가 알코올이라고 부르는 에탄올이나 에틸알코올은 알코올 음료에 들어있는 알코올입니다." / "메이크업, 로션, 향수, 면도, 구강관리, 스킨케어 및 헤어케어 제품을 비롯한 수많은 퍼스널케어 제품에서 사용되고 있는 변성알코올 은 거품형성방지제 , 미용 수렴제 , 용매 및 점도감소제 로 사용됩니다."
[^45]: 대한화장품협회, 소비자를 위한 화장품 상식 - 성분 해설 "변성알코올", 대한화장품협회, 연도 미상, https://kcia.or.kr/pedia/search/search_01_view.php?no=5. 확인일 2026-10-19. 근거 문장: "미국을 포함한 대부분의 국가에서는 식품이나 음료 또는 경구용 의약품 외에 알코올을 제품에 사용하려면 반드시 변성알코올을 사용해야 합니다." / "변성알코올은 일반적으로 Alcohol Denat. 또는 특별히 Denatured (SD) Alcohol로 표시합니다." / "메이크업, 로션, 향수, 면도, 구강관리, 스킨케어 및 헤어케어 제품을 비롯한 수많은 퍼스널케어 제품에서 사용되고 있는 변성알코올 은 거품형성방지제 , 미용 수렴제 , 용매 및 점도감소제 로 사용됩니다."
[^46]: 식품의약품안전처, 의약품안전나라 의약품 등 정보 "자연담깨끗한손소독겔(에탄올) 외 3건"((주)성수바이오텍, 품목기준코드 202002685), 의약품안전나라, 확인 시점 현행, https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=202002685. 확인일 2026-10-19. 근거 문장: 원료약품 및 분량(100그램 중) 에탄올 "70.00" "그램" 규격 "KQC" / 효능효과 "손, 피부 등의 살균 소독" / 검색 목록 구분 "의약외품"
[^47]: 이소희, 국세청, 현장서 적극행정 펼친 우수공무원 9명 선정·시상, 데일리안, 2020, https://www.dailian.co.kr/news/view/917264/. 확인일 2026-10-19. 언론 보도(2차 자료, 국세청 설명을 옮김). 근거 문장: "코로나19 확산으로 손소독제 원료인 에탄올이 부족해지자 소주 원료인 주정을 손소독제용으로 재빨리 용도 변경할 수 있도록 해" / "통상 30일 소요되는 소독제용 주정 생산을 위한 행정절차를 4일로 단축해 신속히 처리한 결과"
[^48]: 대한민국, 주세법 [별표] 주류의 종류별 세부 내용(제5조제2항 관련), 법률 제20618호(2024-12-31 공포, 2025-01-01 시행), 국가법령정보센터, 2025, https://www.law.go.kr/법령/주세법. 확인일 2026-10-19(`.claude/scripts/law.mjs` 조회). 근거 문장: 제1호 주정 "가. 녹말 또는 당분이 포함된 재료를 발효시켜 알코올분 85도 이상으로 증류한 것" / "나. 알코올분이 포함된 재료를 알코올분 85도 이상으로 증류한 것". 제2호 나목(약주) "4) 1)부터 3)까지의 규정에 따른 주류의 발효ㆍ제성 과정에 대통령령으로 정하는 주류를 혼합하여 제성한 것으로서 알코올분 도수가 대통령령으로 정하는 도수 범위 내인 것". 제2호 다목(청주) "2) 1)에 따른 주류의 발효ㆍ제성 과정에 대통령령으로 정하는 주류 또는 재료를 혼합하거나 첨가하여 여과하여 제성한 것으로서 알코올분 도수가 대통령령으로 정하는 도수 범위 내인 것". 제2호 라목(맥주) "3) 1) 또는 2)에 따른 주류의 발효ㆍ제성 과정에 대통령령으로 정하는 주류 또는 재료를 혼합하거나 첨가하여 인공적으로 탄산가스가 포함되게 제성한 것으로서 알코올분 도수가 대통령령으로 정하는 도수 범위 내인 것". 제2호 마목(과실주) "5) 1)부터 4)까지의 규정에 따른 주류에 대통령령으로 정하는 주류 또는 재료를 혼합하거나 첨가하여 제성한 것으로서 알코올분 도수가 대통령령으로 정하는 도수 범위 내인 것". 제2호 가목(탁주) "3) 1) 또는 2)에 따른 주류의 발효ㆍ제성 과정에 대통령령으로 정하는 재료를 첨가한 것". 제3호 가목(소주) "1) 녹말이 포함된 재료, 국과 물을 원료로 하여 발효시켜 연속식증류 외의 방법으로 증류한 것. 다만, 다음의 어느 하나에 해당하는 것은 제외한다." / "가) 발아시킨 곡류(대통령령으로 정하는 것은 제외한다)를 원료의 전부 또는 일부로 한 것" / "나) 곡류에 물을 뿌려 섞어 밀봉ㆍ발효시켜 증류한 것" / "다) 자작나무숯(다른 재료를 혼합한 숯을 포함한다. 이하 같다)으로 여과한 것" / "3) 1) 또는 2)에 따른 주류에 대통령령으로 정하는 바에 따라 주정 또는 대통령령으로 정하는 곡물주정(이하 "곡물주정"이라 한다)을 혼합한 것" / "5) 주정 또는 곡물주정을 물로 희석한 것" / "6) 주정과 곡물주정을 혼합한 것을 물로 희석한 것" / "8) 5)부터 7)까지의 규정에 따른 주류에 대통령령으로 정하는 바에 따라 1) 또는 4)에 따른 주류를 혼합한 것". 제3호 나목(위스키) "1) 발아된 곡류와 물을 원료로 하여 발효시킨 술덧을 증류해서 나무통에 넣어 저장한 것" / "5) 1)부터 3)까지의 규정에 따른 주류에 대통령령으로 정하는 주류 또는 재료를 혼합하거나 첨가한 것". 제3호 다목(브랜디) "1) 제5조제1항제2호마목에 따른 주류를(과실주지게미를 포함한다) 증류하여 나무통에 넣어 저장한 것" / "2) 1)에 따른 주류에 대통령령으로 정하는 주류 또는 재료를 혼합하거나 첨가한 것". 제3호 라목(일반증류주) "4) 주정이나 그 밖에 알코올분이 포함된 재료를 증류한 주류를 자작나무숯으로 여과하여 무색ㆍ투명하게 제성한 것" / "9) 제1호, 제3호가목부터 다목까지의 규정에 따른 주류를 혼합한 것 또는 이들 혼합한 주류의 증류ㆍ제성 과정에 대통령령으로 정하는 재료를 첨가한 것". 제3호 마목(리큐르) "제5조제1항제3호가목부터 라목까지의 규정에 따른 주류로서 대통령령으로 정하는 재료를 첨가한 것". 제4호 다목 "쌀 및 입국(粒麴: 쌀에 곰팡이류를 접종하여 번식시킨 것)에 주정을 첨가해서 여과한 것 또는 이에 대통령령으로 정하는 재료를 첨가하여 여과한 것"
[^49]: 대한민국, 주세법 시행령 제3조(주류의 규격 등) 제1항, [별표 1] 주류에 혼합하거나 첨가할 수 있는 주류 또는 재료(제3조제1항 관련), 대통령령 제36136호(2026-02-27 공포·시행, 별표 1 개정 2026-02-27), 국가법령정보센터, 2026, https://www.law.go.kr/법령/주세법 시행령/제3조. 확인일 2026-10-19(`.claude/scripts/law.mjs` 조회). 근거 문장: 제3조 "① 법 제5조, 제6조 및 별표에 따라 주류의 종류별로 혼합 또는 첨가할 수 있는 주류 또는 재료는 별표 1과 같다." / 별표 1 제1호 "주류에 혼합할 수 있는 주류의 종류" 표: "가. 법 별표 제2호나목4)" → "주정(주정을 물로 희석한 것을 포함한다) 및 법 별표 제3호가목1)부터 4)까지의 규정에 따른 주류", "나. 법 별표 제2호다목2)" → "주정(주정을 물로 희석한 것을 포함한다)", "다. 법 별표 제2호라목3)" → "주정(주정을 물로 희석한 것을 포함한다)", "라. 법 별표 제2호마목5)" → "주정(주정을 물로 희석한 것을 포함한다), 브랜디, 일반 증류주", "마. 법 별표 제3호나목5)" → "주정(주정을 물로 희석한 것을 포함한다)", "바. 법 별표 제3호다목2)" → "주정(주정을 물로 희석한 것을 포함한다)" / 제2호 가목 표 "1) 법 별표 제2호가목3)" 첨가 재료 "「식품위생법」상 허용되는 식물(물 또는 주정 등으로 추출한 액을 포함한다. 이하 "식물"이라 한다)", 비고 "식물을 주정 등으로 추출하는 경우 그 추출액의 알코올분 총량은 최종제품의 알코올분 총량의 100분의 5를 초과할 수 없다." / "4) 법 별표 제2호다목2)" 첨가 재료 "당분ㆍ산분(酸分)ㆍ조미료ㆍ향료ㆍ색소", 비고 "주정이 첨가되는 경우에만 사용할 수 있다."
[^50]: 대한민국, 주세법 시행령 [별표 3] 주류를 제조할 때의 주류 제조 원료의 사용량 및 여과방법 등(제3조제3항 관련), 대통령령 제36136호(2026-02-27 공포·시행, 별표 3 개정 2022-02-15), 국가법령정보센터, 2026, https://www.law.go.kr/법령/주세법 시행령. 확인일 2026-10-19(`.claude/scripts/law.mjs` 조회). 근거 문장: 나목 약주 "라) 법 별표 제2호나목4)에 따른 발효 및 제성과정(製成過程)에 주정 또는 법 별표 제3호가목1)부터 4)까지의 규정에 따른 주류를 혼합하는 경우 혼합하는 주류의 알코올분의 양은 혼합된 후 해당 주류의 알코올분 총량의 100분의 20 이하여야 한다." / 다목 청주 "2) 법 별표 제2호다목2)에 따른 청주의 발효ㆍ제성과정에 주정을 혼합하는 경우에 주정의 양은 알코올분 30도로 희석한 주정을 기준으로 하여 술덧에 사용한 원료용 쌀 1킬로그램당 2.4리터 이하로 한다." / 마목 과실주 "2) 법 별표 제2호마목5)에 따른 과실주의 발효ㆍ제성과정에 주정ㆍ브랜디 또는 일반증류주를 혼합하는 경우 혼합하는 주류의 알코올분의 양은 혼합된 후 해당 주류의 알코올분 총량의 100분의 80 이하여야 한다." / 바목 소주 "1) 법 별표 제3호가목3)에 따른 주류를 제조하는 경우 혼합하는 주정 또는 곡물주정의 알코올분의 양은 혼합된 후 해당 주류의 알코올분 총량의 100분의 50 미만이어야 한다." / "2) 법 별표 제3호가목8)에 따른 주류를 제조하는 경우 혼합하는 법 별표 제3호가목1) 또는 4)에 따른 주류의 알코올분의 양은 혼합된 후 해당 주류의 알코올분 총량의 100분의 50 미만이어야 한다." / 사목 위스키 "1) 법 별표 제3호나목1)부터 3)까지의 규정에 따른 주류는 1년 이상 나무통에 넣어 저장해야 한다." / "2) 법 별표 제3호나목5)에 주정을 혼합하는 경우 혼합하는 주류의 알코올분의 양은 혼합된 후 해당 주류의 알코올분 총량의 100분의 80을 초과하지 않아야 한다." / 아목 브랜디 "2) 법 별표 제3호다목2)에 주정을 혼합하는 경우 혼합하는 주류의 알코올분의 양은 혼합된 후 해당 주류의 알코올분 총량의 100분의 80을 초과하지 않아야 한다."
