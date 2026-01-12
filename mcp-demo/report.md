# Prompt 測試結果

## 模型：千問 3

### 情況 1
1. 使用者提問：台積電
2. 加上 prompt1.txt 送到 vllm
3. vllm 回傳 content
```
<tool_call>\n{\"name\": \"get-patents-count\", \"arguments\": {\"query\": \"AN:\\\"台積電\\\" OR AN:\\\"TSMC\\\" OR AN:\\\"台湾积体电路制造股份有限公司\\\" OR AN:\\\"Taiwan Semiconductor Manufacturing Co., Ltd.\\\" OR AN:\\\"台湾半导体制造股份有限公司\\\" OR AN:\\\"TSMC\\\" OR AN:\\\"台湾积体电路制造\\\" OR AN:\\\"TSMC\\\"\"}}\n</tool_call>

// Query
//AN:"台積電" OR AN:"TSMC" OR AN:"台湾积体电路制造股份有限公司" OR AN:"Taiwan Semiconductor Manufacturing Co., Ltd." OR AN:"台湾半导体制造股份有限公司" OR AN:"TSMC" OR AN:"台湾积体电路制造" OR AN:"TSMC"

```

4. UPAT 回傳專利筆數：20364
5. 第二次送到 vllm
```
[原始檢索條件句]: AN:\"台積電\" OR AN:\"TSMC\" OR AN:\"台湾积体电路制造股份有限公司\" OR AN:\"Taiwan Semiconductor Manufacturing Co., Ltd.\" OR AN:\"台湾半导体制造股份有限公司\" OR AN:\"TSMC\" OR AN:\"台湾积体电路制造\" OR AN:\"TSMC\"\n[檢索結果筆數]: 20364
```
+ prompt2.txt 內容