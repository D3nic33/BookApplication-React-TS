using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookApplication_React_TS.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddNotePageNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PageNumber",
                table: "Notes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PageNumber",
                table: "Notes");
        }
    }
}
