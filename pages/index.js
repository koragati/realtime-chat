import { useState } from 'react';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState('就活生'); // 「就活生」か「プロンプト」を選択

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userMessage = input;
    setMessages((prev) => [...prev, { role, content: userMessage }]); // 選択された役割を使用
    setInput('');

    console.log('Current Conversation:', [...messages, { role, content: userMessage }]);
    // プロンプトメッセージの場合は返信をスキップ
    if (role === 'system') return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: '面接官', content: data.response },
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  // 「就活生」と「プロンプト」の役割を切り替え
  const toggleRole = () => {
    setRole((prevRole) => (prevRole === '就活生' ? 'system' : '就活生'));
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 h-screen flex flex-col">
      <h1 className="text-center text-purple-600 font-bold my-4">Chat-KenPT</h1>
      <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto mb-4">
        <div className="max-w-xs p-3 rounded-lg shadow bg-purple-100 text-gray-800 block mb-1">
          <strong className="block mb-1">面接官</strong>
          ようこそ、弊社の面接へまずは自己紹介をお願いします。
        </div>
        {messages
          .filter((msg) => msg.role !== 'system') // 「system」のメッセージは表示しない
          .map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === '就活生' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow ${
                  msg.role === '就活生'
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 text-gray-800'
                }`}
              >
                <strong className="block mb-1">
                  {msg.role === '就活生' ? '就活生' : '面接官'}
                </strong>
                {msg.content}
              </div>
            </div>
          ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center p-2 bg-gray-100 border-t border-gray-300">
        <button
          type="button"
          onClick={toggleRole}
          className="mr-2 px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-200"
        >
          切替 ({role})
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="入力してください"
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded-r-lg hover:bg-purple-600"
        >
          送信
        </button>
      </form>
    </div>
  );
}

export default ChatApp;