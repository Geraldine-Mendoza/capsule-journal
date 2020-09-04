const url = "/users/me/";

function deleteEntry(id) {
    console.log('deleting entry rn')
    let xhr = new XMLHttpRequest();

    // xhr.open(method, URL, [async, user, password])
    xhr.open('DELETE', url + id);

    // 3. Send the request over the network
    xhr.send();

    // 4. This will be called after the response is received
    xhr.onload = function() {
        if (xhr.status != 200) { // analyze HTTP status of the response
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else { // show the result
            console.log(`Done, got ${xhr.response.length} bytes`); // response is the server
            // update list (maybe reload page? make thing to get response of all entries?? idk)
            window.location.reload(true); // true ensures that data from server is queried again
        }
    };
}

$( document ).ready(function() {
    $(".delete-button").click(function() {
        console.log('clicked delete button for entry ' + this.id);
        deleteEntry(this.id);
    });
});