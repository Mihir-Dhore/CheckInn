import { LightningElement, track } from 'lwc';
import insertServiceRequest from '@salesforce/apex/CheckInn.insertServiceRequest';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import showServices from '@salesforce/apex/CheckInn.showServices';

export default class ServiceRequestCheckInn extends LightningElement {

@track name;
nameChange(event){
    this.name = event.target.value;
    console.log(this.name);
}
@track subject;
subjectChange(event){
    this.subject = event.target.value;
    console.log(this.subject);
}
@track description;
descChange(event){
    this.description = event.target.value;
    console.log(this.description);
}


@track serviceInsert;
handleSubmitClick(){
    insertServiceRequest({name:this.name, subject:this.subject, description:this.description})
    .then(result=>{
        this.serviceInsert = result;
        const successEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Service Added Successfully 🥂',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(successEvent);
        this.name = '';
        this.subject = '';
        this.description = '';
        this.showServices();

     }).catch(error=>{
        console.log('errror',error.body.message);
    })
}
//to show Services
@track showServiceData;

    connectedCallback(){
        this.showServices();
    }
     showServices(){
        showServices()
        .then((result)=>{
            console.log('rein',result);
            this.showServiceData = result;
            console.log('this.showServicess',this.showServiceData);
        }).catch(error=>{
            console.log('errrrror',error.message.body);
        })
        
     }

 }
