
function checkDeleteConfirmation() {
    try {
        const code = window.location.search.split('otp=')[1]
        if(code) {
            console.log('Remove account by code: '+code)
            document.querySelector('#remove-account').classList.add('hidden')
            document.querySelector('#remove-account-confirmation').classList.remove('hidden')
            fetchCustom("DELETE", "https://449gwidd80.execute-api.us-east-1.amazonaws.com/prod/client/vecci/account", {code})
            .then((response) => {
                console.log(response)
            })
        }
    } catch(error) {
        console.log(error)
    }

}
