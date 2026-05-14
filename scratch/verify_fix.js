
function testRounding() {
    const now = Math.floor(Date.now() / 1000);
    const timeTo = Math.floor(now / 900) * 900;
    const timeFrom = timeTo - 24 * 60 * 60;
    
    console.log(`Original: ${now}`);
    console.log(`Rounded:  ${timeTo}`);
    console.log(`Diff:     ${now - timeTo} seconds`);
    
    if (timeTo % 900 === 0) {
        console.log("SUCCESS: Rounded to 15 minutes");
    } else {
        console.log("FAILURE: Not rounded correctly");
    }
}

testRounding();
