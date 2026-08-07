-- N09 mini lab - EXPLAIN ANALYZE before/after an index.
-- Run in psql against a disposable test database:
--   psql "$DATABASE_URL" -f performance.sql
--
-- Important: this query aggregates the complete orders table. With about 200 rows,
-- PostgreSQL may correctly retain a Seq Scan after the index is created.

\echo '=== Dataset size ==='
SELECT COUNT(*) AS orders_count FROM orders;

\echo '=== BEFORE INDEX ==='
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT user_id, SUM(final_amount)
FROM orders
GROUP BY user_id
ORDER BY SUM(final_amount) DESC;

\echo '=== CREATE INDEX AND REFRESH STATISTICS ==='
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
ANALYZE orders;

\echo '=== AFTER INDEX ==='
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT user_id, SUM(final_amount)
FROM orders
GROUP BY user_id
ORDER BY SUM(final_amount) DESC;

\echo '=== OPTIONAL INDEX-FRIENDLY QUERY ==='
-- This second query demonstrates when the user_id index is more likely to help:
-- filtering a small subset rather than aggregating every row.
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT user_id, SUM(final_amount)
FROM orders
WHERE user_id = (SELECT MIN(user_id) FROM orders)
GROUP BY user_id;

