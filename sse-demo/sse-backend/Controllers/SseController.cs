using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace SseDemo.Controllers
{
    /// <summary>
    /// SseController 負責實作伺服器發送事件 (Server-Sent Events, SSE)。
    /// 它允許伺服器單向、持續地將資料「推送」到客戶端。
    /// </summary>
    [Route("sse")] // 定義此控制器的基礎路由為 "/sse"。例如，此控制器內的方法會以 /sse/{方法名} 存取。
    public class SseController : Controller
    {
        /// <summary>
        /// Stream 方法是一個 HTTP GET 端點，用於建立一個持續的 Server-Sent Events (SSE) 串流。
        /// 當客戶端連線到此端點時，伺服器會每秒推送一次資料。
        /// </summary>
        [HttpGet("stream")] // 定義此方法對應到 HTTP GET 請求，完整路由為 "/sse/stream"。
        public async Task Stream()
        {
            // --- 設定 HTTP 標頭以啟用 Server-Sent Events (SSE) ---

            // Content-Type: text/event-stream 是 SSE 的標準 MIME 類型。
            // 它告訴客戶端（例如瀏覽器）這不是一個普通的 HTML 或 JSON 回應，而是一個事件串流。
            Response.Headers.Append("Content-Type", "text/event-stream");

            // Cache-Control: no-cache 告訴客戶端和代理伺服器不要快取這個回應。
            // 這對於即時資料串流至關重要，確保客戶端收到的永遠是最新資料。
            Response.Headers.Append("Cache-Control", "no-cache");

            // Connection: keep-alive 告知客戶端保持這個 TCP 連線持續開啟。
            // 這是實現伺服器持續推送資料的基礎，而不是在每次請求後關閉連線。
            Response.Headers.Append("Connection", "keep-alive");

            // --- 開始無限迴圈，持續推送資料 ---

            int counter = 0;
            // 無限迴圈，表示一旦客戶端連線，伺服器會持續執行此迴圈，
            // 直到客戶端斷開連線或伺服器停止。
            while (true)
            {
                counter++;
                // 格式化要發送的資料。SSE 的資料格式必須以 "data: " 開頭，
                // 並以兩個換行符 "\n\n" 結束，表示一個事件的結束。
                var data = $"data: Server time: {DateTime.Now}, count: {counter}\n\n";
                // 將字串資料轉換為 UTF8 編碼的位元組陣列。
                var bytes = Encoding.UTF8.GetBytes(data);

                // 將位元組陣列寫入 HTTP 回應的主體 (Body) 中。
                await Response.Body.WriteAsync(bytes);

                // FlushAsync() 是實現「即時推送」的關鍵。
                // 它強制伺服器立刻將目前所有暫存區中的資料發送給客戶端，
                // 而不是等待方法執行完畢或暫存區滿了才送出。
                // 這確保了客戶端能即時收到每個事件。
                await Response.Body.FlushAsync(); // 🔥 推送到前端，不等結束

                // 暫停 1000 毫秒（1 秒），控制資料推送的頻率。
                await Task.Delay(1000); // 每秒傳一次
            }
        }
    }
}
