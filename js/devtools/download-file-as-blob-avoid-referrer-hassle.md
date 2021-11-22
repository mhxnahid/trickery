A streaming website that employs annoying debugbar() breakpoints was defeated, and I got the mp4 URL.\
Unfortunately, I can't just open the link on another tab to download the file.\
Whatever referrer-check they are using in that embedded player, I decided to download the file using devtools console.
```js
# https://stackoverflow.com/a/42274086/2923388

fetch("https://site.com/file/url?token=&expiry=")
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "filename.mp4";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again         
        });
```
Alternative: Create a link/ edit an existing link using the element editor and click that link to pass referrer check (to watch).
