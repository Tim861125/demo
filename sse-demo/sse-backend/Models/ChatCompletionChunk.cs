namespace SseDemo.Models;

public class ChatCompletionChunk
{
    public string Id { get; set; } = string.Empty;
    public string Object { get; set; } = "chat.completion.chunk";
    public long Created { get; set; }
    public string Model { get; set; } = string.Empty;
    public List<Choice> Choices { get; set; } = new();
    public Usage? Usage { get; set; }
}

public class Choice
{
    public int Index { get; set; }
    public Delta Delta { get; set; } = new();
    public string? FinishReason { get; set; }
}

public class Delta
{
    public string? Content { get; set; }
}

public class Usage
{
    public int PromptTokens { get; set; }
    public int CompletionTokens { get; set; }
    public int TotalTokens { get; set; }
}
