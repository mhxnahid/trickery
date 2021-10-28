Some websites, especially video streaming sites use some sort of obfuscated javascript to detect whether browser devtools is open and trap us in `dubugger;`\
We can use chrome devtools' `local override` feature to modify the script and refresh the page to load the page using the file we've stored in our dev machine!
# Test case
We're checking a video player page in tnaket[.]xyz. See the attached `pack.js`, located in `/assets/js/`
```js
1295 (function(_0x44e292, _0x353814) {
1296    return true; // this one has some sort of settimeout
1297    var _0x1e41cd = function(_0x465e73) {
1298        while (--_0x465e73) {

1357 function hi() {
1358    return true; // this is our modification, otherwise we get debugged
1359    var _0x7b5589 = _0x1e41
1360      , _0x12aaac = function() {
  

1519 !function() {
1520    function _0xd85d76(_0x28deb3) {
1521        return true; // this is our modification , otherwise we get debugged
1522        if (isNaN(+_0x28deb3))
```

The script is not easily readable as the variables, parameters and function names are replaced with a,b,C and _0x52454 using some sort of obfuscator\
Last updated: 28th Oct 2021
