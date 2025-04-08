import React, { useState, useEffect } from 'react';
import { Wand2, FileText, ArrowRight, GraduationCap, Languages, Mail, X } from 'lucide-react';
import './App.css';

// Language translations
const translations = {
  en: {
    title: 'Academic Text Optimizer',
    subtitle: 'Transform AI-Generated Papers into Human-Like Writing',
    description: 'Our optimization system transforms AI-generated academic papers into more natural, humanistic works',
    originalText: 'Original Text',
    textPlaceholder: 'Paste your AI-generated text here...',
    optimizeButton: 'Start Optimization',
    processing: 'Processing...',
    optimizedResult: 'Optimized Result',
    resultPlaceholder: 'Optimized text will appear here',
    guide: 'User Guide',
    step1Title: 'Paste Text',
    step1Desc: 'Paste your AI-generated paper or article into the input box',
    step2Title: 'One-Click Optimize',
    step2Desc: 'Click the optimize button to automatically process the text',
    step3Title: 'Get Results',
    step3Desc: 'The optimized text maintains academic integrity while adding a human touch',
    footer: '© 2025 Academic Text Optimizer. For research purposes only.',
    error: 'Optimization request failed, please try again later',
    unknownError: 'An unknown error occurred',
    contact: 'Contact',
    emailModal: 'Contact Email'
  },
  zh: {
    title: '学术文章优化助手',
    subtitle: '让AI生成的论文更具人文气息',
    description: '通过我们的优化系统，将AI生成的学术论文转化为更自然、更具人文特色的作品',
    originalText: '原始文本',
    textPlaceholder: '请粘贴您的AI生成文本...',
    optimizeButton: '开始优化',
    processing: '优化中...',
    optimizedResult: '优化结果',
    resultPlaceholder: '优化后的文本将在这里显示',
    guide: '使用指南',
    step1Title: '粘贴文本',
    step1Desc: '将AI生成的论文或文章粘贴到输入框中',
    step2Title: '一键优化',
    step2Desc: '点击优化按钮，系统将自动处理文本',
    step3Title: '获取结果',
    step3Desc: '优化后的文本将保持学术性的同时更具人文气息',
    footer: '© 2025 学术文章优化助手. 本工具仅供学习研究使用。',
    error: '优化请求失败，请稍后重试',
    unknownError: '发生未知错误',
    contact: '联系我们',
    emailModal: '联系邮箱'
  }
};

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'zh'>('zh');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const t = translations[language];

  // 检测用户地理位置
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // 如果用户在中国大陆，设置为中文
        if (data.country_code === 'CN') {
          setLanguage('zh');
        } else {
          setLanguage('en');
        }
      } catch (error) {
        console.error('无法检测地理位置，默认使用中文:', error);
        setLanguage('zh');
      }
    };

    detectUserLocation();
  }, []);

  useEffect(() => {
    if (isProcessing) {
      // 模拟进度增长，开始慢一些，之后逐渐加快
      let step = 3;
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            clearInterval(interval);
            return 85;
          }
          // 进度到一半后加快速度
          if (prev > 40) step = 4;
          if (prev > 70) step = 2; // 接近结束时再次放慢
          return prev + step;
        });
      }, 400);
      
      return () => {
        clearInterval(interval);
      };
    } else if (progress > 0 && !isProcessing) {
      // 当处理完成时，将进度条快速填满
      setProgress(100);
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 800);
      
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isProcessing, progress]);

  useEffect(() => {
    // 根据语言设置页面标题
    document.title = language === 'zh' ? 'AI学术文章优化助手' : 'DeAI Writing';
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setProgress(3);
    
    try {
      console.log('Sending request to backend...');
      const response = await fetch('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputText })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(data)}`);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      setOutputText(data.result);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : t.unknownError);
      setOutputText(''); // 清空输出文本，以防显示旧的结果
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-semibold text-gray-900">{t.title}</span>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Languages className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? '中文' : 'English'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.subtitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">{t.originalText}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={t.textPlaceholder}
              />
              <div className="mt-4 relative">
                <button
                  type="submit"
                  disabled={isProcessing || !inputText}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                    isProcessing || !inputText
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } relative overflow-hidden`}
                >
                  {progress > 0 && (
                    <div 
                      className="absolute left-0 top-0 h-full bg-indigo-500 opacity-50 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  <span className="z-10 flex items-center space-x-2">
                    <Wand2 className="h-5 w-5" />
                    <span>{isProcessing ? t.processing : t.optimizeButton}</span>
                  </span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ArrowRight className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold">{t.optimizedResult}</h2>
            </div>
            <div className="w-full h-96 p-4 bg-gray-50 rounded-lg overflow-auto">
              {error ? (
                <div className="text-center text-red-500 mt-32">
                  {error}
                </div>
              ) : outputText ? (
                <p className="whitespace-pre-wrap">{outputText}</p>
              ) : (
                <div className="text-center text-gray-500 mt-32">
                  {t.resultPlaceholder}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.guide}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.step1Title}</h3>
              <p className="text-gray-600">{t.step1Desc}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <Wand2 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.step2Title}</h3>
              <p className="text-gray-600">{t.step2Desc}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <ArrowRight className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t.step3Title}</h3>
              <p className="text-gray-600">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500">
              {t.footer}
            </p>
            <button 
              onClick={() => setShowEmailModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>{t.contact}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{t.emailModal}</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-lg font-medium">yishi_shay@yeah.net</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;