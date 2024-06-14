// [usage](https://blog.csdn.net/qq_46032550/article/details/134694890)

const express = require('express');
const app = express();
const port = 3000;
 
app.use(express.static(__dirname));
 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
 
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});