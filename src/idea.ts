import { Database as BaseDatabase } from "sqlite3";
import { verbose } from "sqlite3";

type Tick = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};
const sqlite3 = verbose();
const db = new sqlite3.Database(`///Users/cagdasbayram//django/ticks.db`);

db.serialize(() => {
  //   db.run("CREATE TABLE lorem (info TEXT)");

  //   const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  //   for (let i = 0; i < 10; i++) {
  //     stmt.run("Ipsum " + i);
  //   }
  //   stmt.finalize();

  db.each<Tick>(
    `
    WITH base as (
        SELECT
            t.open,
            (open - open_prev) as open_delta,
            ((open - open_prev) / open_prev *100) as open_delta_percent,
            t.high,
            (high - high_prev) as high_delta,
            t.low,
            (low - low_prev) as low_delta,
            t.close,
            (close - close_prev) as close_delta,
            t.volume,
            (volume - volume_prev) as volume_delta,
            *,
            strftime('%Y', date) as year,
            strftime('%m', date) as month,
            strftime('%d', date) as day,
            strftime('%H', date) as hour,
            strftime('%M', date) as minute,
            strftime('%S', date) as second,
            strftime('%w', date) as dayofweek,
            strftime('%W', date) as week
        FROM (
        SELECT 
            (high - low) AS hl_gap,  
            (open - close) AS oc_gap, 
            datetime(time, 'unixepoch', 'localtime') as date,
            lag(close, 1, close) OVER (ORDER BY time ASC) as close_prev,
            lag(open, 1, open) OVER (ORDER BY time ASC) as open_prev,
            lag(high, 1, high) OVER (ORDER BY time ASC) as high_prev,
            lag(low, 1, low) OVER (ORDER BY time ASC) as low_prev,
            lag(volume, 1, volume) OVER (ORDER BY time ASC) as volume_prev,
            lag(close, 2, close) OVER (ORDER BY time ASC) as close_prev_2,
            lag(close, 3, close) OVER (ORDER BY time ASC) as close_prev_3,
            lag(close, 4, close) OVER (ORDER BY time ASC) as close_prev_4,
            lag(close, 5, close) OVER (ORDER BY time ASC) as close_prev_5,
            lag(close, 6, close) OVER (ORDER BY time ASC) as close_prev_6,
            lag(close, 7, close) OVER (ORDER BY time ASC) as close_prev_7,
            lag(close, 8, close) OVER (ORDER BY time ASC) as close_prev_8,
            lag(close, 9, close) OVER (ORDER BY time ASC) as close_prev_9,
            lag(close, 10, close) OVER (ORDER BY time ASC) as close_prev_10,
            lag(close, 11, close) OVER (ORDER BY time ASC) as close_prev_11,
            lag(close, 12, close) OVER (ORDER BY time ASC) as close_prev_12,
            * 
        FROM 'ES_5_secs_bars' WHERE contract = 'ESM3' ORDER BY time ASC
        ) t
        )
        SELECT * FROM base
  `,
    (err, row) => {
      console.log(row.open + ": " + row.close);
    }
  );
});

db.close();
// class Database {
//   private db: BaseDatabase;
//   constructor({ name }: { name: string }) {
//     this.db = sqlite3.cached.Database(`./.data/${name}.db`);
//   }
//   execute(execFunc: (db: BaseDatabase) => void): void {
//     (() => {
//       return execFunc.apply(undefined, [this.db]);
//     })();
//   }
// }

// class Table<M> {
//   private name: string;
//   private db: Database;
//   constructor({
//     name,
//     db,
//     createIfNotExists = true,
//   }: {
//     name: string;
//     db: Database;
//     createIfNotExists: boolean;
//   }) {
//     this.name = name;
//     this.db = db;
//     if (createIfNotExists) {
//       this.db.execute((db) => {
//         db.run(`CREATE TABLE IF NOT EXISTS ${this.name}`);
//       });
//     }
//   }
//   static create<M>(name: string): Table<M> {
//     return new Table<M>({ name });
//   }
// }

// Select()

// class Model {}

// class Event {}

// class Message {}

// class View {}

// interface Collection<Item = unknown, QueryParams = unknown> {
//   head(): Promise<Collection<Item>>;
//   tail(): Promise<Collection<Item>>;
//   iterate(doWork: () => void): void;
//   query(qp: QueryParams): Promise<Collection<Item>>:
//   filter(filterFunc: () => boolean):
// }
