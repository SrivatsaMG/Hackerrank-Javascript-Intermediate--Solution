'use strict';

const fs = require('fs');
const axios = require('axios');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function (inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function () {
    inputString = inputString.split('\n');
    main();
});

function readLine() {
    return inputString[currentLine++];
}

async function getNumTransactions(username) {
    try {
        // Fetch user details
        const userResponse = await axios.get(`https://jsonmock.hackerrank.com/api/article_users?username=${username}`);
        
        if (userResponse.data.data.length === 0) {
            return "Username Not Found";
        }

        const userID = userResponse.data.data[0].id;

        // Fetch transactions
        const transactionResponse = await axios.get(`https://jsonmock.hackerrank.com/api/transactions?userId=${userID}`);

        return transactionResponse.data.total || 0;
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return "Error fetching data";
    }
}

async function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);
    const username = readLine().trim();
    
    const result = await getNumTransactions(username);
    
    ws.write(result.toString() + "\n");
    ws.end();
}
