using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using SseDemo.Models;

namespace SseDemo.Controllers;

[ApiController]
[Route("api")]
public class AskQuestionController : ControllerBase
{
    private readonly ILogger<AskQuestionController> _logger;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;

    public AskQuestionController(
        ILogger<AskQuestionController> logger,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory
    )
    {
        _logger = logger;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("ask-question")]
    public async Task AskQuestion([FromBody] AskQuestionRequest request)
    {
        try
        {
            // 設定 SSE 必要的 headers
            Response.Headers.Append("Content-Type", "text/event-stream");
            Response.Headers.Append("Cache-Control", "no-cache");
            Response.Headers.Append("Connection", "keep-alive");
            Response.Headers.Append("X-Accel-Buffering", "no");

            var serviceBaseUrl =
                _configuration["PatentPilotService:BaseUrl"] ?? "http://localhost:4000";
            var apiPath = _configuration["PatentPilotService:ApiPath"] ?? "/api/auth/ask-question";
            var url = $"{serviceBaseUrl}{apiPath}";

            _logger.LogInformation("呼叫 PatentPilot Service: {Url}", url);
            _logger.LogInformation(
                "請求參數: Model={Model}, Product={Product}, Language={Language}",
                request.Model,
                request.Product,
                request.Language
            );

            // 建立 HttpClient
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromMinutes(10); // 設定較長的 timeout 給串流

            // 序列化請求資料
            var jsonContent = JsonSerializer.Serialize(
                request,
                new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    DefaultIgnoreCondition = System
                        .Text
                        .Json
                        .Serialization
                        .JsonIgnoreCondition
                        .WhenWritingNull,
                }
            );

            _logger.LogInformation("請求 Body: {Body}", jsonContent);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // 發送請求
            var response = await httpClient.PostAsync(url, content);

            // 檢查回應狀態
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError(
                    "API 呼叫失敗: {StatusCode}, Body: {ErrorBody}",
                    response.StatusCode,
                    errorBody
                );

                await Response.Body.WriteAsync(
                    Encoding.UTF8.GetBytes(
                        $"data: {{\"error\": \"API call failed: {response.StatusCode}\"}}\n\n"
                    )
                );
                await Response.Body.FlushAsync();
                return;
            }

            // 轉發 cache header
            if (response.Headers.TryGetValues("x-from-cache", out var cacheValues))
            {
                Response.Headers.Append("x-from-cache", cacheValues.First());
            }

            // 讀取並轉發 SSE 串流
            var stream = await response.Content.ReadAsStreamAsync();
            var reader = new StreamReader(stream);

            _logger.LogInformation("開始轉發 SSE 串流...");

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (line != null)
                {
                    // 轉發每一行到前端
                    await Response.Body.WriteAsync(Encoding.UTF8.GetBytes(line + "\n"));
                    await Response.Body.FlushAsync();

                    // 記錄 data 行（不記錄空行）
                    if (line.StartsWith("data:"))
                    {
                        _logger.LogDebug(
                            "SSE: {Line}",
                            line.Substring(0, Math.Min(100, line.Length))
                        );
                    }
                }
            }

            _logger.LogInformation("SSE 串流轉發完成");
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP 請求失敗");

            if (!Response.HasStarted)
            {
                Response.StatusCode = 502;
                await Response.WriteAsJsonAsync(
                    new
                    {
                        success = false,
                        message = $"無法連接到 PatentPilot Service: {ex.Message}",
                    }
                );
            }
            else
            {
                await Response.Body.WriteAsync(
                    Encoding.UTF8.GetBytes(
                        $"data: {{\"error\": \"Connection lost: {ex.Message}\"}}\n\n"
                    )
                );
                await Response.Body.FlushAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "處理請求時發生錯誤");

            if (!Response.HasStarted)
            {
                Response.StatusCode = 500;
                await Response.WriteAsJsonAsync(new { success = false, message = ex.Message });
            }
            else
            {
                await Response.Body.WriteAsync(
                    Encoding.UTF8.GetBytes($"data: {{\"error\": \"{ex.Message}\"}}\n\n")
                );
                await Response.Body.FlushAsync();
            }
        }
    }
}
