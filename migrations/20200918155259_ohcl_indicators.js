exports.up = function (knex) {
      return knex.schema.createTable("ohcl_macd_bband", function (table) {
        table.increments("id").unsigned().primary();
        table.decimal('open', 7, 2);
        table.decimal("high", 7, 2);
        table.decimal("close", 7, 2);
        table.decimal("low", 7, 2);
        table.decimal("timestamp", 13, 0);
        table.decimal("macd", 7, 2);
        table.decimal("macd_signal", 7, 2);
        table.decimal("macd_histogram", 7, 2);
        table.decimal("bband_lower", 7, 2);
        table.decimal("bband_middle", 7, 2);
        table.decimal("bband_upper", 7, 2);


      });
    };
    
    exports.down = function(knex) {
          return knex.schema
              .dropTable("ohcl_macd_bband")
        };
    