using System.Text.Json.Serialization;

namespace SseDemo.Models;

public class AskQuestionRequest
{
    [JsonPropertyName("model")]
    public string Model { get; set; } = "gpt-4o-mini";

    [JsonPropertyName("promptKey")]
    public string? PromptKey { get; set; }

    [JsonPropertyName("parameters")]
    public Dictionary<string, object> Parameters { get; set; } = new();

    [JsonPropertyName("product")]
    public string Product { get; set; } = "WEBPAT";

    [JsonPropertyName("userName")]
    public string UserName { get; set; } = "demo_user";

    [JsonPropertyName("stream")]
    public bool? Stream { get; set; } = true;

    [JsonPropertyName("userId")]
    public string? UserId { get; set; }

    [JsonPropertyName("crmId")]
    public string? CrmId { get; set; }

    [JsonPropertyName("chatId")]
    public string? ChatId { get; set; }

    [JsonPropertyName("applicationName")]
    public string? ApplicationName { get; set; } = "SSE-Demo";

    [JsonPropertyName("fromCache")]
    public bool? FromCache { get; set; } = true;

    [JsonPropertyName("language")]
    public string? Language { get; set; } = "zh-hant";

    // 額外的 JWT-like 欄位
    [JsonPropertyName("app")]
    public string? App { get; set; }

    [JsonPropertyName("aud")]
    public string? Aud { get; set; }

    [JsonPropertyName("iss")]
    public string? Iss { get; set; }

    [JsonPropertyName("iat")]
    public long? Iat { get; set; }

    [JsonPropertyName("exp")]
    public long? Exp { get; set; }

    [JsonPropertyName("sub")]
    public string? Sub { get; set; }
}
