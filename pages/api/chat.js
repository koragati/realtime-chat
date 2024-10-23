import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userMessage } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
            role: 'system',
            content: `
あなたは採用面接官です。応募者に対して面接形式で質問を行ってください。
面接の流れは以下の通りです:
1. 自己紹介の中からアイスブレイクを行い、リラックスさせてください。1分程度の会話量になったら次に進んでください。質問は一度に一つだけ行ってください。
2. 次に、「学生時代に力を入れたこと（がくちか）」について質問し、その内容を深掘りしてください。1,2分程度の会話量になったら次に進んでください。一度に一つの質問だけをしてください。
3. 最後に、志望理由について質問し、その理由をさらに掘り下げてください。1,2分程度の会話量になったら最後に講評をして下さい。一度に一つの質問だけをしてください。
注意: 応募者がすでに回答した質問については繰り返さないでください。回答を記憶し、それを踏まえて次の質問を考えてください。
応答が切れてしまった場合や、内容が重複しそうなときは、次の番号の質問に進んでください。
`
          },
        { role: 'user', content: userMessage },
      ],
    });
    console.log(completion.choices);

    res.status(200).json({ response: completion.choices[0].message.content });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch the completion' });
  }
}