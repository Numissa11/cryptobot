exports.up = function (knex) {
  return knex.schema.createTable("ohcl_btc_usd", function (t) {
    t.increments("id").unsigned().primary();
    t.string("open");
    t.string("high");
    t.string("close");
    t.string("low");
    t.string("timestamp");
  });
};

exports.down = function(knex) {
      return knex.schema
          .dropTable("ohcl_btc_usd")
    };
