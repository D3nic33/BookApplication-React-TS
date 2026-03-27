using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookApplication_React_TS.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddDateCompletedToBook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateCompleted",
                table: "Book",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateCompleted",
                table: "Book");
        }
    }
}
