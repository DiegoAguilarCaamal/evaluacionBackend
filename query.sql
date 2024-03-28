SELECT reviewers.name AS reviewer_name, books.title AS book_title, ratings.rating, ratings.rating_date
FROM ratings
JOIN reviewers ON ratings.reviewer_id = reviewers.id
JOIN books ON ratings.book_id = books.id
ORDER BY reviewer_name, book_title, rating;
