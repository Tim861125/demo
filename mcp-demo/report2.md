# Prompt 測試結果

## 模型：千問 3

---
### 測試案例：battery

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `battery` |
| **檢索過程** | <ol><li><b>Query:</b> <code>TAC:('battery' 電池)</code> <br> <b>Result:</b> 143024</li><li><b>Query:</b> <code>TAC:(battery OR 電池) AND TACD:(energy storage OR 電能儲存 OR lithium-ion OR 鋰離子 OR solid-state OR 固態) AND IPC:(H01M10* H01M4* H01M12* H01M104* H01M106*)</code> <br> <b>Result:</b> 0</li><li><b>Query:</b> <code>TAC:(battery OR 電池 OR secondary battery OR 雙電層電容器 OR 電化學電容器 OR supercapacitor) AND TACD:(lithium-ion OR 鋰離子 OR solid-state OR 固態 OR sodium-ion OR 鈉離子 OR flow battery OR 流體電池 OR redox flow OR 氧還流體) AND IPC:(H01M10* H01M4* H01M12* H01M104* H01M106*)</code> <br> <b>Result:</b> 0</li></ol> |
| **模型回應** | 擴增關鍵字群組以涵蓋更多同義與關聯技術詞，並擴充IPC分類號至相關上位類別，確保不遺漏核心技術領域。 |
| **最終查詢** | <code>TAC:(battery OR 電池 OR secondary battery OR 雙電層電容器 OR 電化學電容器 OR supercapacitor OR lithium-ion OR 鋰離子 OR solid-state OR 固態 OR sodium-ion OR 鈉離子 OR flow battery OR 流體電池 OR redox flow OR 氧還流體) AND IPC:(H01M10* H01M4* H01M12* H01M104* H01M106* H01M10* H01M4* H01M12* H01M104* H01M106* H01M101* H01M102* H01M103*)</code> |
| **最終筆數** | 0 |
---
### 測試案例：battery

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `battery` |
| **檢索過程** | <ol><li><b>Query:</b> <code>TAC:(battery)</code> <br> <b>Result:</b> 18373</li><li><b>Query:</b> <code>TAC:(battery) AND TACD:(lithium OR Li-ion OR nickel-metal hydride OR solid-state OR sodium-ion OR flow OR sodium-sulfur OR nickel-cadmium OR lead-acid OR graphene OR silicon anode OR cathode material OR electrolyte OR thermal management OR battery management system OR BMS OR fast charging OR cycle life OR energy density OR safety OR fire prevention OR degradation OR self-discharge OR battery pack OR module OR cell)</code> <br> <b>Result:</b> 18373</li><li><b>Query:</b> <code>TAC:(battery) AND TACD:(energy density OR cycle life OR safety OR fast charging OR thermal management OR BMS OR degradation)</code> <br> <b>Result:</b> 7747</li></ol> |
| **模型回應** | 針對「battery」技術主題，檢索結果為7,747筆，屬於適中範圍（10~20,000筆），符合【直接採納】策略。原始條件句已具備良好的平衡性與覆蓋度，核心技術與關鍵性能指標均已涵蓋，無需進一步調整。 |
| **最終查詢** | <code>TAC:(battery) AND TACD:(energy density OR cycle life OR safety OR fast charging OR thermal management OR BMS OR degradation)</code> |
| **最終筆數** | 7747 |
---
### 測試案例：battery

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `battery` |
| **檢索過程** | <ol><li><b>Query:</b> <code>TAC:(battery)</code> <br> <b>Result:</b> 18373</li><li><b>Query:</b> <code>TAC:(battery) AND TACD:(lithium OR Li-ion OR nickel-metal hydride OR NiMH OR solid-state OR sodium-ion OR flow OR redox OR thermal management OR safety OR degradation OR cycle life OR energy density OR charging speed OR fast charging OR battery management system OR BMS)</code> <br> <b>Result:</b> 18373</li><li><b>Query:</b> <code>TAC:(battery) AND TACD:(lithium OR Li-ion OR solid-state OR sodium-ion OR fast charging OR safety OR energy density OR cycle life) AND IPC:(H01M10* H01M4* H01M12* H01M14* H01M16* H01M18* H01M20* H01M24* H01M26* H01M42* H01M44* H01M46* H01M48* H01M50* H01M52* H01M54* H01M56* H01M58* H01M60* H01M62* H01M64* H01M66* H01M68* H01M70* H01M72* H01M74* H01M76* H01M78* H01M80* H01M82* H01M84* H01M86* H01M88* H01M90* H01M92* H01M94* H01M96* H01M98*)</code> <br> <b>Result:</b> 0</li></ol> |
| **模型回應** | 針對「battery」技術領域，原始條件句因過度限縮IPC分類與TACD關鍵詞組合，導致結果為0。經分析，核心技術本質為「電池」，其關鍵特徵為「能量密度」、「循環壽命」、「安全性」、「快速充電」及「固態電池」等。為恢復合理檢索範圍，採用「精準智慧擴增」策略：擴充TACD關鍵詞至包含「锂電池」、「鋰離子」、「固態電池」、「鈉離子」、「快充」、「安全」、「能量密度」、「循環壽命」等中英文同義詞，並補足IPC分類至H01M10*至H01M98*完整系列，確保涵蓋電池技術全領域。最終條件句以顯性AND連接關鍵字群組與分類群組，符合跨欄位邏輯鐵律。 |
| **最終查詢** | <code>TAC:(battery) AND TACD:(lithium OR Li-ion OR "lithium battery" OR "lithium-ion battery" OR solid-state OR "solid state" OR sodium-ion OR "sodium ion" OR fast charging OR "quick charge" OR "battery safety" OR "cycle life" OR "energy density" OR "charging speed" OR "battery management system" OR BMS) AND IPC:(H01M10* H01M4* H01M12* H01M14* H01M16* H01M18* H01M20* H01M24* H01M26* H01M42* H01M44* H01M46* H01M48* H01M50* H01M52* H01M54* H01M56* H01M58* H01M60* H01M62* H01M64* H01M66* H01M68* H01M70* H01M72* H01M74* H01M76* H01M78* H01M80* H01M82* H01M84* H01M86* H01M88* H01M90* H01M92* H01M94* H01M96* H01M98*)</code> |
| **最終筆數** | 0 |
---
### 測試案例：battery

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `battery` |
| **檢索過程** | <ol><li><b>Query:</b> <code>TAC:('battery' 電池)</code> <br> <b>Result:</b> 143024</li><li><b>Query:</b> <code>TAC:(battery OR 電池) AND TACD:(energy storage OR 電力儲存 OR lithium-ion OR 鋰離子 OR solid-state OR 固態) AND IPC:(H01M10* H01M4* H01M12* H01M14* H01M20* H01M24* H01M42* H01M48*)</code> <br> <b>Result:</b> 0</li><li><b>Query:</b> <code>TAC:(battery OR 電池 OR secondary battery OR 電池 OR rechargeable battery OR 可充電電池) AND TACD:(energy storage OR 電力儲存 OR lithium-ion OR 鋰離子 OR solid-state OR 固態 OR sodium-ion OR 鈉離子 OR flow battery OR 流體電池) AND IPC:(H01M10* H01M4* H01M12* H01M14* H01M20* H01M24* H01M42* H01M48*)</code> <br> <b>Result:</b> 0</li></ol> |
| **模型回應** | 擴增關鍵字群組以涵蓋更多同義詞與技術變體，並擴充IPC分類號至相關上位類別，以提升檢索覆蓋率。 |
| **最終查詢** | <code>TAC:(battery OR 電池 OR secondary battery OR 電池 OR rechargeable battery OR 可充電電池 OR lithium-ion battery OR 鋰離子電池 OR solid-state battery OR 固態電池 OR sodium-ion battery OR 鈉離子電池 OR flow battery OR 流體電池) AND IPC:(H01M10* H01M4* H01M12* H01M14* H01M20* H01M24* H01M42* H01M48* H01M100* H01M102* H01M104*)</code> |
| **最終筆數** | 0 |
---
### 測試案例：battery

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `battery` |
| **檢索過程** | <ol><li><b>Query:</b> <code>TAC:(battery)</code> <br> <b>Result:</b> 18373</li><li><b>Query:</b> <code>TAC:(battery) AND TACD:(lithium OR nickel OR cobalt OR manganese OR sodium OR solid-state OR silicon anode OR high-energy density OR fast charging OR long cycle life OR thermal stability)</code> <br> <b>Result:</b> 15439</li></ol> |
| **模型回應** | 情况B：结果适中 (10 ~ 20,000笔) - 【直接採納】 |
| **最終查詢** | <code>TAC:(battery) AND TACD:(lithium OR nickel OR cobalt OR manganese OR sodium OR solid-state OR silicon anode OR high-energy density OR fast charging OR long cycle life OR thermal stability)</code> |
| **最終筆數** | 15439 |
---
### 測試案例：battery

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `battery` |
| **檢索過程** | <ol><li><b>Query:</b> <code>TAC:(battery)</code> <br> <b>Result:</b> 18373</li><li><b>Query:</b> <code>TAC:(battery) AND TACD:(lithium OR Li-ion OR nickel-metal-hydride OR NiMH OR solid-state OR sodium-ion OR flow OR sodium-sulfur OR nickel-cadmium OR NiCd OR lead-acid OR graphene OR silicon anode OR fast charging OR high energy density OR long cycle life OR thermal stability OR safety OR degradation)</code> <br> <b>Result:</b> 15632</li></ol> |
| **模型回應** | 情况B：结果适中 (10 ~ 20,000笔) - 【直接采纳】 |
| **最終查詢** | <code>TAC:(battery) AND TACD:(lithium OR Li-ion OR nickel-metal-hydride OR NiMH OR solid-state OR sodium-ion OR flow OR sodium-sulfur OR nickel-cadmium OR NiCd OR lead-acid OR graphene OR silicon anode OR fast charging OR high energy density OR long cycle life OR thermal stability OR safety OR degradation)</code> |
| **最終筆數** | 15632 |
---
### 測試案例：battery

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `battery` |
| **檢索過程** | <ol><li><b>Query:</b> <code>TAC:(battery)</code> <br> <b>Result:</b> 18373</li><li><b>Query:</b> <code>TAC:(battery) AND TACD:(lithium OR Li-ion OR nickel-metal hydride OR NiMH OR solid-state OR sodium-ion OR flow OR sodium-sulfur OR nickel-cadmium OR NiCd OR lead-acid OR graphene OR silicon anode OR cathode OR electrolyte OR thermal management OR safety OR fast charging OR energy density OR cycle life OR battery management system OR BMS)</code> <br> <b>Result:</b> 18373</li><li><b>Query:</b> <code>TAC:(battery) AND TACD:(energy density OR cycle life OR fast charging OR safety OR thermal management)</code> <br> <b>Result:</b> 7608</li></ol> |
| **模型回應** | 檢索結果適中，直接採納原始條件句，無需調整。 |
| **最終查詢** | <code>TAC:(battery) AND TACD:(energy density OR cycle life OR fast charging OR safety OR thermal management)</code> |
| **最終筆數** | 7608 |