module AdventOfCode where
    import Data.Maybe
    import Data.Map.Internal
    import System.IO
    import Text.ParserCombinators.ReadP
    import Data.Char
    
    import qualified Control.Applicative as CA

    data Passport = Passport
        { fields :: [String]
        } deriving (Show)

    parseMaybe :: ReadP a -> String -> Maybe a
    parseMaybe parser input =
        case readP_to_S parser input of
            [] -> Nothing
            ((result, _):_) -> Just result

    parsePairKey :: ReadP String
    parsePairKey = do
        key <- munch isAlpha
        char ':'
        munch (\char -> isPrint char && not (isSpace char))
        _ <- optional (string " " CA.<|> string " \n")
        return key
    
    parsePassport :: ReadP Passport
    parsePassport = do
        keys <- many parsePairKey
        char '\n'
        return (Passport keys)
    
    parsePassports :: ReadP [Passport]
    parsePassports = do
        passports <- many parsePassport
        return passports      

    testPassports x = readP_to_S parsePassports x
    testPassport x = readP_to_S parsePassport x
    testPairs x = readP_to_S parsePairKey x   

    main :: IO()
    main = do
        contents <- readFile "./data/passwords.txt"
        -- putStrLn $ show $ countValidPasswords $ parseablePasswords $ lines contents
        -- putStrLn $ show $ countValidPositions $ parseablePasswords $ lines contents
        putStrLn "Done"