exports.up = function (knex) {
  return knex.schema.createTable("ohcl_btc_usd", function (table) {
    table.increments("id").unsigned().primary();
    table.decimal('open', 8, 2);
    table.decimal("high", 8, 2);
    table.decimal("last", 8, 2);
    table.decimal("low", 8, 2);
    table.decimal("timestamp", 13, 0);
  });
};

exports.down = function(knex) {
      return knex.schema
          .dropTable("ohcl_btc_usd")
    };
