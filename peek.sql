\c nc_news_test

--SELECT * FROM topics;
--SELECT * FROM users;
--SELECT * FROM comments;
-- SELECT * FROM comments
-- JOIN articles
--     ON comments.article_id = articles.article_id
-- -- SELECT articles.article_id, COUNT(*) AS comment_count
-- -- FROM articles
-- -- JOIN comments
-- --     ON articles.article_id = comments.article_id
-- -- GROUP BY articles.article_id

-- SELECT articles.author, title, articles.body, topic, articles.created_at, articles.votes, articles.article_id, CAST(COUNT(comments.article_id) AS INT) AS comment_count
-- FROM comments  
-- RIGHT JOIN articles 
-- ON articles.article_id = comments.article_id 
-- WHERE articles.article_id = $1
-- GROUP BY articles.article_id