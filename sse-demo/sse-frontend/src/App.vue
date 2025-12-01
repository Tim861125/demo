<template>
  <div id="app">
    <div class="container">
      <h1>SSE Demo - PatentPilot AI 對話</h1>

      <!-- 設定區 -->
      <div class="settings">
        <div class="setting-item">
          <label>模型選擇：</label>
          <select v-model="selectedModel">
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
            <option value="gemini-2.5-pro-preview-05-06">Gemini 2.5 Pro</option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="grok-2-latest">Grok 2 Latest</option>
          </select>
        </div>

        <div class="setting-item">
          <label>語言：</label>
          <select v-model="selectedLanguage">
            <option value="zh-hant">繁體中文</option>
            <option value="zh-cn">簡體中文</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <!-- 問題輸入區 -->
      <div class="input-area">
        <textarea
          v-model="question"
          placeholder="請輸入您的問題..."
          :disabled="isLoading"
          @keydown.ctrl.enter="sendQuestion"
        ></textarea>
        <button
          @click="sendQuestion"
          :disabled="isLoading || !question.trim()"
          class="send-btn"
        >
          {{ isLoading ? '處理中...' : '送出 (Ctrl+Enter)' }}
        </button>
      </div>

      <!-- 對話顯示區 -->
      <div class="chat-area">
        <div v-if="chatHistory.length === 0" class="empty-state">
          尚未開始對話，請輸入問題後點擊送出
        </div>

        <div v-for="(chat, index) in chatHistory" :key="index" class="chat-message">
          <div class="user-message">
            <strong>您：</strong>{{ chat.question }}
          </div>
          <div class="ai-message">
            <strong>AI：</strong>
            <span v-html="formatMessage(chat.answer)"></span>
            <span v-if="chat.isStreaming" class="cursor">▋</span>
          </div>
          <div v-if="chat.usage" class="usage-info">
            Token 使用：Prompt {{ chat.usage.promptTokens }} + Completion {{ chat.usage.completionTokens }} = Total {{ chat.usage.totalTokens }}
          </div>
        </div>

        <div v-if="error" class="error-message">
          ❌ {{ error }}
        </div>
      </div>

      <!-- 清除按鈕 -->
      <div class="actions">
        <button @click="clearChat" class="clear-btn">清除對話</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: '',
      selectedModel: 'gemini-2.5-flash',
      selectedLanguage: 'zh-hant',
      chatHistory: [],
      isLoading: false,
      error: null,
      chatId: null,
      currentAnswer: '',
      currentUsage: null
    };
  },
  methods: {
    async sendQuestion() {
      if (!this.question.trim() || this.isLoading) return;

      // 如果是新對話，生成 chatId（基於時間戳記）
      if (!this.chatId) {
        this.chatId = new Date().getTime().toString();
      }

      this.error = null;
      this.isLoading = true;

      const currentQuestion = this.question.trim();

      // 添加到聊天歷史
      const chatIndex = this.chatHistory.length;
      this.chatHistory.push({
        question: currentQuestion,
        answer: '',
        isStreaming: true,
        usage: null
      });

      // 清空輸入框
      this.question = '';

      try {
        // 計算時間戳記
        const now = Math.floor(Date.now() / 1000);
        const expirationSeconds = 20;

        const response = await fetch('http://localhost:5119/api/ask-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.selectedModel,
            promptKey: 'Bobo_WebpatQueryPromptKey',
            parameters: {
              question: currentQuestion,
              content: currentQuestion
            },
            product: 'WEBPAT',
            userName: 'ltteststd',
            stream: true,
            userId: 'ltteststd',
            crmId: '08edb146-164a-4a8b-8eb7-9358690fd327',
            chatId: this.chatId,
            applicationName: 'WEBPATDEV',
            fromCache: false,
            language: this.selectedLanguage,
            // 額外的欄位
            app: 'WEBPAT',
            aud: 'PatentPilot',
            iss: 'innovue.ltd',
            iat: now,
            exp: now + expirationSeconds,
            sub: '08edb146-164a-4a8b-8eb7-9358690fd327'
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6);

              if (data === '[DONE]') {
                this.chatHistory[chatIndex].isStreaming = false;
                this.isLoading = false;
                continue;
              }

              try {
                const parsed = JSON.parse(data);

                if (parsed.choices && parsed.choices[0]) {
                  const content = parsed.choices[0].delta?.content;
                  if (content) {
                    this.chatHistory[chatIndex].answer += content;
                  }

                  // 檢查是否有 usage 資訊
                  if (parsed.usage) {
                    this.chatHistory[chatIndex].usage = parsed.usage;
                  }

                  // 檢查是否結束
                  if (parsed.choices[0].finish_reason === 'stop') {
                    this.chatHistory[chatIndex].isStreaming = false;
                  }
                }
              } catch (e) {
                console.error('解析 JSON 失敗:', e, data);
              }
            }
          }
        }

      } catch (err) {
        this.error = `錯誤: ${err.message}`;
        this.chatHistory[chatIndex].isStreaming = false;
      } finally {
        this.isLoading = false;
      }
    },

    clearChat() {
      this.chatHistory = [];
      this.chatId = null;
      this.error = null;
      this.question = '';
    },

    formatMessage(text) {
      // 簡單的文字格式化，換行符號轉為 <br>
      return text.replace(/\n/g, '<br>');
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Microsoft JhengHei', sans-serif;
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  margin-bottom: 25px;
  font-size: 28px;
  border-bottom: 3px solid #4CAF50;
  padding-bottom: 10px;
}

.settings {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-item label {
  font-weight: 600;
  color: #555;
}

.setting-item select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.input-area {
  margin-bottom: 20px;
}

.input-area textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 10px;
  transition: border-color 0.3s;
}

.input-area textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.input-area textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-btn {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.send-btn:hover:not(:disabled) {
  background: #45a049;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.chat-area {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 50px 20px;
  font-size: 16px;
}

.chat-message {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.chat-message:last-child {
  border-bottom: none;
}

.user-message {
  margin-bottom: 10px;
  padding: 10px;
  background: #e3f2fd;
  border-radius: 8px;
}

.user-message strong {
  color: #1976d2;
}

.ai-message {
  padding: 10px;
  background: #f1f8e9;
  border-radius: 8px;
  line-height: 1.6;
}

.ai-message strong {
  color: #388e3c;
}

.cursor {
  animation: blink 1s infinite;
  font-weight: bold;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.usage-info {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.error-message {
  padding: 15px;
  background: #ffebee;
  color: #c62828;
  border-radius: 8px;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.clear-btn {
  padding: 10px 20px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.clear-btn:hover {
  background: #d32f2f;
}
</style>
