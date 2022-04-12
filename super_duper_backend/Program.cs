namespace SuperDuperBackend
{
    class Program
    {
        static void Main(string[] args)
        {
            var MyAllowSpecificOrigins = "*";
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("*").AllowAnyHeader()
                                                  .AllowAnyMethod();
                      });
});

            // Add services to the container.
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // app.UseHttpsRedirection();

            app.MapGet("/grille", () =>
            {
                // set header to allow CORS
                return Solution.GenerateGrille();

            }).WithName("GetGrille");

            app.MapPost("/grille", (int[][] grille) =>
            {
                return Solution.CheckGrille(grille);
            }).WithName("PostGrille");

            app.UseCors(MyAllowSpecificOrigins);

            app.Run();

        }
    }
}

