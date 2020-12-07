module AdventOfCode where
    import System.IO  
    import Data.List (nub, tails, filter)

    main :: IO()
    main = do
        contents <- readFile "./data/expenses.txt"
        putStrLn (show $ dayOne 2020 (map strToInteger (lines contents)))
        putStrLn (show $ dayOnePartTwo 2020 (map strToInteger (lines contents)))

    strToInteger :: [Char] -> Integer
    strToInteger x = read x :: Integer

    dayOne :: Integer -> [Integer] -> Integer
    dayOne x y = product $ concat $ filter (sumEquals x) (pairs $ nub y)

    dayOnePartTwo :: Integer -> [Integer] -> Integer
    dayOnePartTwo x y = product $ concat $ filter (sumEquals x) (triples $ nub y)

    sumEquals :: Integer -> [Integer] -> Bool
    sumEquals x y = x == sum y

    pairs :: [a] -> [[a]]
    pairs xs = [[x1, x2] | (x1:xs1) <- tails xs, x2 <- xs1]

    triples :: [a] -> [[a]]
    triples xs = [[x1, x2, x3] | (x1:xs1) <- tails xs, (x2:xs2) <- tails xs1, x3 <- xs2 ]