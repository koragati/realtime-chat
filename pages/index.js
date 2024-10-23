import { useState } from 'react';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userMessage = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => {
        const updatedMessages = [...prev, { role: 'interviewer', content: data.response }];
        console.log('Message Log:', updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 h-screen flex flex-col">
      <h1 className="text-center text-purple-600 font-bold my-4">Chat-KenPT</h1>
      <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto mb-4">
        <div  className="max-w-xs p-3 rounded-lg shadow bg-purple-100 text-gray-800 block mb-1">
          <strong className="block mb-1">面接官</strong>
          ようこそ、弊社の面接へまずは自己紹介をお願いします。
        </div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg shadow ${
                msg.role === 'user'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-100 text-gray-800'
              }`}
            >
              <strong className="block mb-1">
                {msg.role === 'user' ? '' : '面接官'}
              </strong>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center p-2 bg-gray-100 border-t border-gray-300">
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