
const addToCart = async(id) => {
    // console.log('one')
    let value = 0
    try{
        value = document.getElementById('cartMP').value;
    } catch(err) {

    }
    
    console.log(value)
    if(value == 0) {
        value = 1
    }

    const response = await fetch(`/account/add-to-cart/${id}/${value}`, { method: 'POST' });
    const resBody = await response.json();


    console.log(resBody.popUp)
    if(resBody.message == 'nosession') {
        window.location.replace("/login-register");
        alertMsg('login to see your account')
            return;
    }
    alertMsg(resBody.popUp)
            return;


    function alertMsg(msg) {
        Swal.fire({
            icon: 'success',
            title: msg,
            showConfirmButton: false,
            timer: 2500
        })
    }

}