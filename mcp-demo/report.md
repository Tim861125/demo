# Prompt 測試結果

## 模型：千問 3

---
### 測試案例：I want to find patents on generators

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `I want to find patents on generators` |
| **檢索過程** | <ol><li><b>Query:</b> `TAC:(generator)` <br> <b>Result:</b> 15899</li></ol> |
| **模型回應** | 情況B：结果适中 (10 ~ 20,000筆) - 【直接采納】 |
| **最終查詢** | `TAC:(generator)` |
| **最終筆數** | 15899 |
---
### 測試案例：SQL

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `SQL` |
| **檢索過程** | <ol><li><b>Query:</b> `TAC:('SQL' 'Structured Query Language')` <br> <b>Result:</b> 75366</li><li><b>Query:</b> `TAC:('SQL' 'Structured Query Language') AND TACD:('database optimization' 'query execution' 'performance tuning' 'indexing' 'query planner' 'execution plan' 'query rewrite' 'cost-based optimization')` <br> <b>Result:</b> 74904</li><li><b>Query:</b> `TAC:('SQL' 'Structured Query Language') AND TACD:('query execution' 'query planner' 'execution plan' 'cost-based optimization')` <br> <b>Result:</b> 74842</li></ol> |
| **模型回應** | 檢索結果過多，判定為技術中心，選取「成本基準優化」為關鍵性能指標進行限縮，以提升專利相關性與技術聚焦度。 |
| **最終查詢** | `TAC:('SQL' 'Structured Query Language') AND TACD:('query execution' 'query planner' 'execution plan' 'cost-based optimization') AND TACD:('query optimization' 'query execution time' 'resource utilization' 'query performance' 'execution efficiency')` |
| **最終筆數** | 74842 |

---

### 測試案例：battery

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `battery` |
| **檢索過程** | <ol><li><b>Query:</b> `TAC:('battery' 電池)` <br> <b>Result:</b> 143010</li><li><b>Query:</b> `TAC:('battery' 電池) AND TACD:('lithium-ion' 'solid-state' 'energy density' 'cycle life' 'fast charging')` <br> <b>Result:</b> 116224</li><li><b>Query:</b> `TAC:('battery' '電池' 'rechargeable battery' 'secondary battery') AND TACD:('lithium-ion' 'solid-state' 'energy density' 'cycle life' 'fast charging' 'electrolyte' 'anode' 'cathode' 'separator') AND IPC:(H01M10* H01M4* H01M12* H01M14* H01M16* H01M40* H01M42*)` <br> <b>Result:</b> 0</li></ol> |
| **模型回應** | 針對「電池」技術領域，原始檢索條件因過度限縮導致結果為零。策略上需在保持技術核心不變的前提下，進行精準智慧擴增。核心物件為「電池」，關鍵特徵為「鋰離子」、「固態」、「能量密度」、「循環壽命」、「快充」、「電解質」、「陽極」、「陰極」、「隔膜」，技術本質為「電化學裝置」。因此，採用詞彙擴充與分類號擴充策略：針對核心物件與關鍵特徵，使用同義詞、近義詞及下位詞進行擴充，並在IPC分類號中擴充至更上位的分類層級，以提升檢索覆蓋率，確保不遺漏關鍵專利。 |
| **最終查詢** | `TAC:("battery" "電池" "rechargeable battery" "secondary battery" "lithium-ion battery" "solid-state battery" "Li-ion" "LIB" "Li-ion cell" "battery cell" "energy storage device" "electrochemical cell") AND TACD:("lithium-ion" "solid-state" "energy density" "cycle life" "fast charging" "electrolyte" "anode" "cathode" "separator" "battery degradation" "thermal stability" "safety" "charge rate" "capacity retention") AND IPC:(H01M10* H01M4* H01M12* H01M14* H01M16* H01M40* H01M42* H01M101* H01M104* H01M105* H01M106* H01M107* H01M108* H01M109* H01M110* H01M111* H01M112* H01M113* H01M114* H01M115* H01M116* H01M117* H01M118* H01M119* H01M120* H01M121* H01M122* H01M123* H01M124* H01M125* H01M126* H01M127* H01M128* H01M129* H01M130* H01M131* H01M132* H01M133* H01M134* H01M135* H01M136* H01M137* H01M138* H01M139* H01M140* H01M141* H01M142* H01M143* H01M144* H01M145* H01M146* H01M147* H01M148* H01M149* H01M150* H01M151* H01M152* H01M153* H01M154* H01M155* H01M156* H01M157* H01M158* H01M159* H01M160* H01M161* H01M162* H01M163* H01M164* H01M165* H01M166* H01M167* H01M168* H01M169* H01M170* H01M171* H01M172* H01M173* H01M174* H01M175* H01M176* H01M177* H01M178* H01M179* H01M180* H01M181* H01M182)" |
| **最終筆數** |  |
---
### 測試案例：generator

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `generator` |
| **檢索過程** | <ol><li><b>Query:</b> `TAC:("generator" "発電機" "generator" "発電装置" "power generator" "電力発生装置") AND IPC:(H02P9* H02P11* H02P13* H02P15* H02P17* H02P19*)` <br> <b>Result:</b> 0</li><li><b>Query:</b> `TAC:("generator" "発電機" "power generator" "電力発生装置" "alternator" "交流発電機" "rotary generator" "回転発電機" "electrical generator" "電気発電機") AND IPC:(H02P9* H02P11* H02P13* H02P15* H02P17* H02P19* H02K*)` <br> <b>Result:</b> 683</li></ol> |
| **模型回應** | 檢索結果適中，符合最佳範圍，原始條件句已涵蓋核心技術與多語言關鍵字，且IPC分類合理，無需調整。 |
| **最終查詢** | `TAC:("generator" "発電機" "power generator" "電力発生装置" "alternator" "交流発電機" "rotary generator" "回転発電機" "electrical generator" "電気発電機") AND IPC:(H02P09* H02P11* H02P13* H02P15* H02P17* H02P19* H02K*)` |
| **最終筆數** | 683 |
---
### 測試案例：lithium battery

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `lithium battery` |
| **檢索過程** | <ol><li><b>Query:</b> `TAC:("lithium battery" "リチウムイオン電池" "lithium-ion battery" "リチウムイオン電池") AND IPC:(H01M10*)` <br> <b>Result:</b> 0</li><li><b>Query:</b> `TAC:("lithium battery" "lithium-ion battery" "Li-ion battery" "リチウムイオン電池" "二次電池" "rechargeable battery") AND IPC:(H01M10* H01M4* H01M12* H01M14*)` <br> <b>Result:</b> 0</li><li><b>Query:</b> `TAC:("lithium battery" "lithium-ion battery" "Li-ion battery" "リチウムイオン電池" "二次電池" "rechargeable battery" "lithium-ion" "li-ion" "lithium ion" "リチウムイオン") AND IPC:(H01M10* H01M4* H01M12* H01M14*)` <br> <b>Result:</b> 0</li><li><b>Query:</b> `TAC:("lithium battery" "lithium-ion battery" "Li-ion battery" "リチウムイオン電池" "二次電池" "rechargeable battery" "lithium-ion" "li-ion" "lithium ion" "リチウムイオン" "lithium ion battery" "リチウムイオン二次電池") AND IPC:(H01M10* H01M4* H01M12* H01M14*)` <br> <b>Result:</b> 0</li><li><b>Query:</b> `TAC:("lithium battery" "lithium-ion battery" "Li-ion battery" "リチウムイオン電池" "二次電池" "rechargeable battery" "lithium-ion" "li-ion" "lithium ion" "リチウムイオン" "lithium ion battery" "リチウムイオン二次電池" "lithium ion" "lithium-ion" "li-ion" "lithium-ion battery" "リチウムイオン電池") AND IPC:(H01M10* H01M4* H01M12* H01M14*)` <br> <b>Result:</b> 0</li></ol> |
| **模型回應** | [ERROR] Max iterations reached in conversation loop. |
| **最終查詢** | `TAC:("lithium battery" "lithium-ion battery" "Li-ion battery" "リチウムイオン電池" "二次電池" "rechargeable battery" "lithium-ion" "li-ion" "lithium ion" "リチウムイオン" "lithium ion battery" "リチウムイオン二次電池" "lithium ion" "lithium-ion" "li-ion" "lithium-ion battery" "リチウムイオン電池") AND IPC:(H01M10* H01M4* H01M12* H01M14*)` |
| **最終筆數** | 0 |
---
### 測試案例：moped motor

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `moped motor` |
| **檢索過程** | <ol><li><b>Query:</b> `TAC:("moped motor" "輕型摩托車馬達" "moped engine" "輕便摩托車馬達") AND IPC:(B62K003* B62K005* B62K007* B62K009* B62K011*)` <br> <b>Result:</b> 0</li></ol> |
| **模型回應** | <tool_call> {"name": "get-patents-count", "arguments": {"query": "TAC:(\"moped\" \"輕型摩托車\" \"light motorcycle\" \"scooter\" \"motor scooter\" \"moped engine\" \"輕便摩托車\") OR TACD:(\"two-wheeled electric vehicle\" \"electric moped\" \"electric scooter\" \"electric motorcycle\" \"electric bicycle\" \"pedal-assist motor\") AND IPC:(B62K003* B62K005* B62K007* B62K009* B62K011* B60L001* B60L005* B60L015* B60L016* B60L018* B60L020* B60L022* B60L024* B60L026* B60L028* B60L030* B60L032* B60L034* B60L036* B60L038* B60L040* B60L042* B60L044* B60L046* B60L048* B60L050* B60L052* B60L054* B60L056* B60L058* B60L060* B60L062* B60L064* B60L066* B60L068* B60L070* B60L072* B60L074* B60L076* B60L078* B60L080* B60L082* B60L084* B60L086* B60L088* B60L090* B60L092* B60L094* B60L096* B60L098* B60L100* B60L102* B60L104* B60L106* B60L108* B60L110* B60L112* B60L114* B60L116* B60L118* B60L120* B60L122* B60L124* B60L126* B60L128* B60L130* B60L132* B60L134* B60L136* B60L138* B60L140* B60L142* B60L144* B60L146* B60L148* B60L150* B60L152* B60L154* B60L156* B60L158* B60L160* B60L162* B60L164* B60L166* B60L168* B60L170* B60L172* B60L174* B60L176* B60L178* B60L180* B60L182* B60L184* B60L186* B60L188* B60L190* B60L192* B60L194* B60L196* B60L198* B60L200* B60L202* B60L204* B60L206* B60L208* B60L210* B60L212* B60L214* B60L216* B60L218* B60L220* B60L222*)}"}}
| **最終查詢** | `TAC:("moped" "輕型摩托車" "light motorcycle" "scooter" "motor scooter" "moped engine" "輕便摩托車") OR TACD:("two-wheeled electric vehicle" "electric moped" "electric scooter" "electric motorcycle" "electric bicycle" "pedal-assist motor") AND IPC:(B62K003* B62K005* B62K007* B62K009* B62K011* B60L001* B60L005* B60L015* B60L016* B60L018* B60L020* B60L022* B60L024* B60L026* B60L028* B60L030* B60L032* B60L034* B60L036* B60L038* B60L040* B60L042* B60L044* B60L046* B60L048* B60L050* B60L052* B60L054* B60L056* B60L058* B60L060* B60L062* B60L064* B60L066* B60L068* B60L070* B60L072* B60L074* B60L076* B60L078* B60L080* B60L082* B60L084* B60L086* B60L088* B60L090* B60L092* B60L094* B60L096* B60L098* B60L100* B60L102* B60L104* B60L106* B60L108* B60L110* B60L112* B60L114* B60L116* B60L118* B60L120* B60L122* B60L124* B60L126* B60L128* B60L130* B60L132* B60L134* B60L136* B60L138* B60L140* B60L142* B60L144* B60L146* B60L148* B60L150* B60L152* B60L154* B60L156* B60L158* B60L160* B60L162* B60L164* B60L166* B60L168* B60L170* B60L172* B60L174* B60L176* B60L178* B60L180* B60L182* B60L184* B60L186* B60L188* B60L190* B60L192* B60L194* B60L196* B60L198* B60L200* B60L202* B60L204* B60L206* B60L208* B60L210* B60L212* B60L214* B60L216* B60L218* B60L220* B60L222* B62K003* B62K005* B62K007* B62K009* B62K011*)` |
| **最終筆數** |  |
---
### 測試案例：portable battery generator

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `portable battery generator` |
| **檢索過程** | <ol><li><b>Query:</b> `TAC:("portable battery generator" "portable power station" "handheld battery pack" "mobile energy unit" "compact power source") AND IPC:(H02J007* B60L* B60K006* B60W010* H02M* B60R016* B60R011*) AND PD:[2020-01-01 TO 2025-12-31]` <br> <b>Result:</b> 1</li></ol> |
| **模型回應** | 檢索結果過少，採用詞彙擴充與分類號擴充策略，提升搜尋覆蓋率，確保關鍵技術特徵不遺漏。 |
| **最終查詢** | `TAC:("portable battery generator" "portable power station" "handheld battery pack" "mobile energy unit" "compact power source" "battery-powered portable unit" "rechargeable power pack" "field portable energy device" "on-the-go power source") AND IPC:(H02J007* B60L* B60K006* B60W010* H02M* B60R016* B60R011* H02J003* H02J005* H02B003* H02B007* H02B009*) AND PD:[2020-01-01 TO 2025-12-31]` |
| **最終筆數** | 1 |
---
### 測試案例：自動駕駛AI chip專利

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `自動駕駛AI chip專利` |
| **檢索過程** | <ol><li><b>Query:</b> `TAC:('automatic driving' 'autonomous driving' 'AI chip' 'artificial intelligence chip' 'AI processor' 'neural network processor') AND IPC:(G06N3* G06N5* G06N7* G06N10* G06N11* G06N12*)` <br> <b>Result:</b> 0</li><li><b>Query:</b> `TAC:("automatic driving" "autonomous driving" "driverless car" "self-driving") AND TACD:("AI chip" "artificial intelligence chip" "neural network processor" "deep learning accelerator" "AI accelerator" "DPU" "TPU" "NPU" "GPGPU") AND IPC:(G06N3* G06N5* G06N7* G06N10* G06N11* G06N12*)` <br> <b>Result:</b> 0</li><li><b>Query:</b> `TAC:("autonomous driving" "self-driving" "driverless car" "automatic driving") OR TACD:("AI chip" "artificial intelligence chip" "neural network processor" "deep learning accelerator" "AI accelerator" "DPU" "TPU" "NPU" "GPGPU") AND IPC:(G06N3* G06N5* G06N7* G06N10* G06N11* G06N12*)` <br> <b>Result:</b> 160</li></ol> |
| **模型回應** | 針對「自動駕駛AI chip專利」檢索結果筆數為160筆，屬適中範圍，符合「情況B：結果適中 (10 ~ 20,000筆)」，因此直接採納原始檢索條件句，無需調整。 |
| **最終查詢** | `TAC:("autonomous driving" "self-driving" "driverless car" "automatic driving") OR TACD:("AI chip" "artificial intelligence chip" "neural network processor" "deep learning accelerator" "AI accelerator" "DPU" "TPU" "NPU" "GPGPU") AND IPC:(G06N3* G06N5* G06N7* G06N10* G06N11* G06N12*)` |
| **最終筆數** | 160 |
---
### 測試案例：請給我 台積電 2025的專利

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `請給我 台積電 2025的專利` |
| **檢索過程** | <ol><li><b>Query:</b> `AN:("台積電" "TSMC" "台湾积体电路制造股份有限公司" "Taiwan Semiconductor Manufacturing Co., Ltd.") AND PD:[2025-01-01 TO 2025-12-31]` <br> <b>Result:</b> 2367</li><li><b>Query:</b> `AN:("台積電" "TSMC" "台湾积体电路制造股份有限公司" "Taiwan Semiconductor Manufacturing Co., Ltd.") AND PD:[2025-01-01 TO 2025-12-31] AND TACD:("3nm" "2nm" "FinFET" "GAA" "gate-all-around" "transistor" "logic process" "CMOS" "chip integration" "interconnect" "electrical performance" "power efficiency" "thermal management" "wafer fabrication" "doping" "etching" "deposition" "lithography" "mask" "process optimization")` <br> <b>Result:</b> 1899</li></ol> |
| **模型回應** | 檢索結果適中，直接採納原始條件句，無需調整。 |
| **最終查詢** | `AN:("台積電" "TSMC" "台湾积体电路制造股份有限公司" "Taiwan Semiconductor Manufacturing Co., Ltd.") AND PD:[2025-01-01 TO 2025-12-31] AND TACD:("3nm" "2nm" "FinFET" "GAA" "gate-all-around" "transistor" "logic process" "CMOS" "chip integration" "interconnect" "electrical performance" "power efficiency" "thermal management" "wafer fabrication" "doping" "etching" "deposition" "lithography" "mask" "process optimization")` |
| **最終筆數** | 1899 |
---
### 測試案例：鴻海與電動車有關的專利

| 項目 | 內容 |
| :--- | :--- |
| **初始提問** | `鴻海與電動車有關的專利` |
| **檢索過程** | <ol><li><b>Query:</b> `TAC:("鴻海" "Foxconn" "富士康" "Fujitsu" "Fujian" "Fujian Electronics" "Fujian Industrial" "Fujian Technology" "Fujian Electronics Co., Ltd.") AND TAC:("electric vehicle" "EV" "電動車" "電動汽車" "e-car" "electric car") AND IPC:(B60L* B60K006* B60W010* H02J007* H02M* B60R016* B60R011*)` <br> <b>Result:</b> 0</li></ol> |
| **模型回應** | 因檢索結果為0筆，需進行精準智慧擴增。原始條件聚焦於「鴻海」集團與「電動車」技術，但因專利權人名稱用詞過於特定（如「Fujian」等非核心名稱），且未涵蓋鴻海集團在電動車領域的常見技術術語。故擴增核心物件「鴻海」之同義詞與關聯名稱，並擴充電動車相關技術關鍵字，同時提升IPC分類至更上位層級以增加覆蓋範圍，確保不遺漏關鍵專利。 |
| **最終查詢** | `TAC:("鴻海" "Foxconn" "富士康" "Foxconn Technology" "Foxconn Electronics" "Foxconn Industrial" "Foxconn Holdings" "FIC" "FIH" "富士康國際" "富士康科技集團") AND TAC:("electric vehicle" "EV" "電動車" "電動汽車" "e-car" "electric car" "electric mobility" "e-mobility" "vehicle electrification" "EV platform" "electric powertrain") AND IPC:(B60L* B60K006* B60W010* H02J007* H02M* B60R016* B60R011* B60W012* B60W014* H02P001* H02P003*)` |
| **最終筆數** | 0 |
---