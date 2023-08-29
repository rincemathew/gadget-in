
const addToCart = async(id) => {
    // console.log('one')

    const response = await fetch(`/account/add-to-cart/${id}/`, { method: 'POST' });
    // console.log('two')
    const resBody = await response.json();

    // console.log('three')

    console.log(resBody.message)
    if(resBody.message == 'Login') {
        window.location.replace("/login-register");
    }

}