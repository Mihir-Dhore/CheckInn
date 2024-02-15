import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import signUpUser from '@salesforce/apex/CheckInn.signUpUser';
export default class SignUpCheckInn extends NavigationMixin(LightningElement) {
    @track firstName;
    handleFirstNameChange(event){
        this.firstName = event.target.value;
        console.log(this.firstName)

    }
    @track lastName;
    handleLastNameChange(event){
        this.lastName = event.target.value;
        console.log(this.lastName)

    }
    @track Phone;
    handlePhoneChange(event){
        this.Phone = event.target.value;
    }

    @track email;
    handleEmailChange(event){
        this.email = event.target.value;
        console.log(this.email)

    }
    @track Password;
    handlePasswordChange(event){
        this.Password = event.target.value;
        console.log(this.Password)

    }
    @track conPassword;
    handleConPasswordChange(event){
        this.conPassword = event.target.value;
        console.log(this.conPassword)

    }

    
    handleLoginClick(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
               url: "https://thecodingstudio2-dev-ed.develop.my.site.com/CheckInn/s/login"
            }
        });
    }

    @track passwordError;
    @track conPasswordError;
    handleSignUpClick(){
        if(this.Password !== this.conPassword){
            alert('Password do not matched');
            // this.passwordError = 'Password do not matched';
            // this.conPasswordError = 'Password do not matched';
        
 
        signUpUser({
            firstName:this.firstName,
            lastName:this.lastName,
            email:this.email,
            Phone:this.Phone,
            Password:this.Password
        })
        .then(result=>{
            console.log('resulttt',result);
        }).catch(error=>{
            console.log('error',error);
        })

    }}
}