$(document).ready(function(){
    const confirmPassword = document.getElementById('confirm-password');
    const comfirmFeedback = document.getElementById("my-invalid-confirm");
    const password = document.getElementById("password-admin");
    const registerForm = document.getElementById("register-form");
    let isOK = false;
    registerForm.addEventListener("submit", function(e){
        console.log("ISOK: ", isOK);
        let isSubmitable = true;
        if(confirmPassword.value !== password.value){
            comfirmFeedback.style.display="block";
            confirmPassword.style.marginBottom="5px";
            isSubmitable = false;
        }
        else{
            comfirmFeedback.style.display="none";
            confirmPassword.style.marginBottom="22px";
        }
        if(!isSubmitable){
            e.preventDefault();
            return;
        }
        if(!isOK){
            e.preventDefault();
            $.ajax({
                url:'/account/check-username',
                method:'post',
                data:{
                    username: registerForm['username'].value,
                },
                success:function(result){
                    if(result.isExisted){
                        isOK = false;
                        document.getElementById("username-existed-msg").style.display="block";
                        registerForm['username'].style.marginBottom = "5px";
                    }else{
                        isOK = true;
                        registerForm.submit();
                    }
                },		
                error: function(err){
                    console.log(err);
                    alert("Some error has occurred, please try again!");
                }
            })
        }
    })
})