export function extractNumber(s)
{
    var numberPattern = /\d+/;
    return s.match( numberPattern )?s.match( numberPattern )[0]:1000
}