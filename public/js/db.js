// offline data
db.enablePersistence()
    .catch(err => {
        if(err.code == 'failed-precondition') {
            // multiple tabs opened
            console.log('persistence failed');
        }
        else if(err.code == 'unimplemented') {
            // lack of browser support
            console.log('persistence is not available');
        }
    });