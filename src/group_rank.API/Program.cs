using Microsoft.EntityFrameworkCore;
using group_rank.API.Data;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders(); // Clear default logging providers
builder.Logging.AddConsole(); // Add console logging
builder.Logging.AddDebug(); // Optional: Add debug logging

// Configure CORS based on environment
if (builder.Environment.IsProduction())
{
    builder.Configuration.AddJsonFile("appsettings.Production.json");

    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policyBuilder =>
        {
            policyBuilder.WithOrigins(
                    "https://group-rank.com",
                    "https://www.group-rank.com")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });
    });
}
else
{
    builder.Configuration.AddJsonFile("appsettings.Production.json");

    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policyBuilder =>
        {
            policyBuilder.WithOrigins(
                    "https://group-rank.com",
                    "https://www.group-rank.com")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });
    });
}

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddDbContext<PollContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 21)),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure()
    )
);

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Now build the application
var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable HTTPS redirection
app.UseHttpsRedirection();

// Apply CORS before routing
app.UseCors();

// Add Middleware to Log Requests
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Received request: {Method} {Path}", context.Request.Method, context.Request.Path);
    await next();
});

// Use routing for controllers
app.UseRouting();

// Map controllers
app.MapControllers();

// Run the application
app.Run();

