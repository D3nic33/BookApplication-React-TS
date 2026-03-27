using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookApplication_React_TS.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedAtToBook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Book",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Book");
        }
    }
}
