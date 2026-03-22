const NOTION_DATABASE_ID = 'a4b45faa338c488ea1272b553aab57fb';

export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const d = req.body;
    const join = (arr) => Array.isArray(arr) ? arr.join(', ') : (arr || '');

    const payload = {
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        '이름':           { title:     [{ text: { content: d.q_name || '(미입력)' } }] },
        '나이대':          { select:    { name: d.q_age || '미선택' } },
        '직업':           { rich_text: [{ text: { content: d.q_job || '' } }] },
        '경력':           { rich_text: [{ text: { content: d.q_career || '' } }] },
        '활동형태':        { rich_text: [{ text: { content: join(d.q_activity) } }] },
        '식단관리경험':    { select:    { name: d.q_exp || '미선택' } },
        '수강목표':        { rich_text: [{ text: { content: d.q_goal || '' } }] },
        '본인식단관리':    { select:    { name: d.q_selfmgmt || '미선택' } },
        '식단구성기준':    { rich_text: [{ text: { content: join(d.q_basis) } }] },
        '회원식단설계':    { select:    { name: d.q_design || '미선택' } },
        '탄단지비율':      { rich_text: [{ text: { content: d.q_macro || '' } }] },
        '혈당인슐린':      { rich_text: [{ text: { content: d.q_insulin || '' } }] },
        '칼로리대사':      { rich_text: [{ text: { content: d.q_meta || '' } }] },
        '체지방증가원리':  { rich_text: [{ text: { content: d.q_fat || '' } }] },
        '단백질필요량':    { rich_text: [{ text: { content: d.q_protein || '' } }] },
        '정체기원인':      { rich_text: [{ text: { content: d.q_plateau || '' } }] },
        '탄수화물이해':    { rich_text: [{ text: { content: d.q_carb || '' } }] },
        '단백질식품군':    { rich_text: [{ text: { content: d.q_proteintype || '' } }] },
        '지방이해':        { rich_text: [{ text: { content: d.q_lipid || '' } }] },
        '식사타이밍':      { rich_text: [{ text: { content: d.q_timing || '' } }] },
        '운동전후식단':    { rich_text: [{ text: { content: d.q_periworkout || '' } }] },
        '호르몬이해':      { rich_text: [{ text: { content: d.q_hormone || '' } }] },
        '생리주기이해':    { rich_text: [{ text: { content: d.q_cycle || '' } }] },
        '여성회원고려':    { select:    { name: d.q_femalecons || '미선택' } },
        '어려운점':        { rich_text: [{ text: { content: d.q_hard || '' } }] },
        '자주받는질문':    { rich_text: [{ text: { content: d.q_faq || '' } }] },
        '어려운상황':      { rich_text: [{ text: { content: join(d.q_situation) } }] },
        '배우고싶은것':    { rich_text: [{ text: { content: d.q_wish || '' } }] },
        '관심주제':        { rich_text: [{ text: { content: join(d.q_topics) } }] },
        '강의방식':        { rich_text: [{ text: { content: join(d.q_style) } }] },
        '과제여부':        { select:    { name: d.q_homework || '미선택' } },
        '기타':           { rich_text: [{ text: { content: d.q_etc || '' } }] },
        '제출시각':        { rich_text: [{ text: { content: d.timestamp || new Date().toISOString() } }] },
      }
    };

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.object === 'error') {
      console.error('Notion error:', result);
      return res.status(500).json({ error: result.message });
    }

    return res.status(200).json({ success: true, id: result.id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
