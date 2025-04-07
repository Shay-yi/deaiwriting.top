const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const ARK_API_KEY = '3207f0ab-17ba-4744-b898-029cffe0132f';

// 检测文本语言，更严格的检测
function detectLanguage(text) {
  // 去除空格和标点符号后检查文本
  const cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, "");
  
  // 计算中文字符的比例
  const chinesePattern = /[\u4e00-\u9fa5]/g;
  const chineseMatches = cleanText.match(chinesePattern) || [];
  const chineseRatio = chineseMatches.length / cleanText.length;
  
  console.log(`中文字符比例: ${chineseRatio}, 总字符: ${cleanText.length}, 中文字符: ${chineseMatches.length}`);
  
  // 如果中文字符比例超过5%，认为是中文
  return chineseRatio > 0.05 ? 'zh' : 'en';
}

// 确认文本保持在相同的语言
function validateLanguageConsistency(originalText, outputText) {
  const originalLang = detectLanguage(originalText);
  const outputLang = detectLanguage(outputText);
  
  if (originalLang !== outputLang) {
    console.error(`语言不匹配: 原文为${originalLang}, 输出为${outputLang}`);
    // 如果原文是英文但输出是中文，返回警告信息
    if (originalLang === 'en' && outputLang === 'zh') {
      return false;
    }
  }
  return true;
}

// 调用豆包大模型API
app.post('/api/optimize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: '请输入需要优化的文本' });
    }
    console.log('收到优化文本请求:', text.substring(0, 50) + '...');
    
    // 检测语言
    const textLanguage = detectLanguage(text);
    console.log('检测到文本语言:', textLanguage);
    
    // 更强调语言保持的系统提示词
    const systemPrompt = textLanguage === 'zh' 
      ? "你是一个负责任的学术文本润色助手，专精于中文学术写作。你的任务是对中文文本进行最小程度的修改，仅调整不自然的表达方式，使文章看起来更像人类撰写。\n\n严格遵守以下规则：\n1. 完全保持原文的意思、论点、结构和论证逻辑\n2. 不添加、不删除任何实质性内容或关键信息\n3. 只替换不自然的词语或调整不流畅的句式\n4. 保留专业术语和学术表达\n5. 不改变段落结构或句子顺序\n6. 尽量保持原文的长度\n7. 删除多余或不必要的标点符号\n8. 确保标点符号使用符合学术写作规范\n\n记住，你的目标不是重写文章，而是进行最小必要的措辞调整和标点优化，让AI生成的文本更像人类所写，同时完全保留原意。必须以中文回复，不接受任何其他语言的输出。"
      : "You are a responsible academic text refinement assistant specializing in English academic writing. Your task is to make minimal modifications to this ENGLISH TEXT, only adjusting unnatural expressions to make the article appear more human-written.\n\nStrictly follow these rules:\n1. Completely preserve the original meaning, arguments, structure, and logic\n2. Do not add or remove any substantive content or key information\n3. Only replace unnatural words or adjust awkward sentences\n4. Retain technical terminology and academic expressions\n5. Do not change paragraph structure or sentence order\n6. Maintain the original length as much as possible\n7. Remove excessive or unnecessary punctuation marks\n8. Ensure punctuation usage follows academic writing norms\n\nIMPORTANT: DO NOT TRANSLATE THE TEXT TO CHINESE OR ANY OTHER LANGUAGE. The input is in English, and your output MUST be in English only. Your goal is not to rewrite or translate the article, but to make minimal necessary phrasal adjustments to make AI-generated text appear more human-written while fully preserving the original meaning and language.";
    
    // 调用豆包API
    console.log('调用豆包API...');
    const response = await axios({
      method: 'POST',
      url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARK_API_KEY}`
      },
      data: {
        model: "deepseek-r1-250120",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: textLanguage === 'en' ? 
              `This is an ENGLISH text that needs minimal refinement. DO NOT translate it to any other language: "${text}"` :
              text
          }
        ]
      }
    });
    
    console.log('API响应状态:', response.status);
    
    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      console.error('无效的API响应:', response.data);
      throw new Error('API响应格式错误');
    }

    // 从响应中提取生成的文本
    const resultText = response.data.choices[0].message.content;
    
    // 验证输出语言与输入语言一致
    if (!validateLanguageConsistency(text, resultText)) {
      // 如果语言不匹配，返回一个更安全的结果
      if (textLanguage === 'en') {
        // 如果原文是英文但输出变成了中文，直接返回原文
        console.error('语言不匹配，返回微调过的原文');
        const enhancedText = text.replace(/\s+/g, ' ').trim(); // 简单处理：去除多余空格
        return res.json({ result: enhancedText });
      }
    }
    
    res.json({ result: resultText });
  } catch (error) {
    console.error('优化过程中出错:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({ 
      error: '文本优化失败',
      details: error.response?.data?.error || error.message
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，监听端口: ${PORT}`);
}); 