module AdventOfCode where
    import System.IO
    import qualified Data.Text as DT
    import Text.ParserCombinators.ReadP
    import Control.Applicative
    import Data.Maybe

    data PasswordValidator = PasswordValidator 
        { min :: Int
        , max :: Int
        , char :: Char
        , password :: String
        } deriving (Show)

    parseMaybe :: ReadP a -> String -> Maybe a
    parseMaybe parser input =
        case readP_to_S parser input of
            [] -> Nothing
            ((result, _):_) -> Just result

    digit :: ReadP Char
    digit = 
        satisfy (\char -> char >= '0' && char <= '9')

    anything :: ReadP Char
    anything = 
        satisfy (\char -> True)

    passwordValidatorParser :: ReadP PasswordValidator
    passwordValidatorParser = do
        min <- count 1 digit <|> count 2 digit
        string "-"
        max <- count 1 digit <|> count 2 digit
        skipSpaces
        char <- get
        string ":"
        skipSpaces
        password <- manyTill anything eof
        return (PasswordValidator (read min) (read max) char password)

    passwordValidator :: String -> Maybe PasswordValidator
    passwordValidator input = 
        parseMaybe passwordValidatorParser input

    parseablePasswords :: [String] -> [PasswordValidator]
    parseablePasswords xs = mapMaybe passwordValidator xs

    countChars :: Char -> String -> Int
    countChars x y = length $ filter (\char -> char == x) y

    isValidPassword :: PasswordValidator -> Bool
    isValidPassword (PasswordValidator min max char password) = y >= min && y <= max
        where y = countChars char password

    countValidPasswords :: [PasswordValidator] -> Int
    countValidPasswords xs = length $ filter (\password -> isValidPassword password) xs

    areValidPositions :: PasswordValidator -> Bool
    areValidPositions (PasswordValidator first second char password) =
        (password !! (first - 1)) == char && (password !! (second - 1)) == char

    countValidPositions :: [PasswordValidator] -> Int
    countValidPositions xs = length $ filter (\password -> areValidPositions password) xs

    main :: IO()
    main = do
        contents <- readFile "./data/passwords.txt"
        putStrLn $ show $ countValidPasswords $ parseablePasswords $ lines contents
        putStrLn $ show $ countValidPositions $ parseablePasswords $ lines contents
        putStrLn "Done"