var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// 註冊 HttpClient
builder.Services.AddHttpClient();

// 加入 CORS 設定，允許前端跨域請求
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowVueFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:8080", "http://localhost:8081")
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );

    // 開發環境下允許所有來源（包含直接打開 HTML 文件的 null origin）
    options.AddPolicy(
        "AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
    );
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// 開發環境下註解掉 HTTPS 重定向，避免 HTTP 請求被重定向
// app.UseHttpsRedirection();

// 啟用預設檔案（index.html）
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

// 啟用 CORS（必須在 UseRouting 之後，UseEndpoints 之前）
// 開發環境使用 AllowAll，方便測試；正式環境建議改用 AllowVueFrontend
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
