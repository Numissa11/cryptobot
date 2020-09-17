exports.up = function (knex) {
      return knex.schema.createTable("ohcl_macd_bband", function (table) {
        table.increments("id").unsigned().primary();
        table.decimal('open', 4, 2);
        table.decimal("high", 4, 2);
        table.decimal("close", 4, 2);
        table.decimal("low", 4, 2);
        table.decimal("timestamp", 13, 0);
        table.decimal("macd", 4, 4);
        table.decimal("macd_signal", 4, 4);
        table.decimal("macd_histogram", 4, 4);
        table.decimal("bband_lower", 4, 4);
        table.decimal("bband_middle", 4, 4);
        table.decimal("bband_upper", 4, 4);


      });
    };
    
    exports.down = function(knex) {
          return knex.schema
              .dropTable("ohcl_macd_bband")
        };
    