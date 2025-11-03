import { useState } from 'react';

export const formatMessageContent = (content: string) => {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (/^```[\s\S]*?```$/.test(part)) {
      const [, language = ''] = part.match(/^```(\w*)\n/) || [];
      const code = part
        .replace(/^```\w*\n/, '')
        .replace(/```$/, '')
        .trim();

      return <CodeBlock key={index} language={language} code={code} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre
        style={{
          backgroundColor: '#1e1e1e',
          padding: '1rem',
          borderRadius: '6px',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => copyToClipboard(code)}
          className={`absolute right-2 top-2 rounded px-2 py-1 text-xs text-white ${
            copied ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          style={{ opacity: 0.8 }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <code
          className={`language-${language} font-mono text-sm`}
          style={{
            color: '#d4d4d4',
          }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
};
