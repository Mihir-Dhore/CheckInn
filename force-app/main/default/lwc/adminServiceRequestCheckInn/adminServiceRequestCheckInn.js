import { LightningElement,track } from 'lwc';
import showServices from '@salesforce/apex/CheckInn.showServices';
import insertAdminReply from '@salesforce/apex/CheckInn.insertAdminReply';

import showAdminReply from '@salesforce/apex/CheckInn.showAdminReply';

export default class AdminServiceRequestCheckInn extends LightningElement {
    @track showServiceData;

    @track colorCondition;
    @track applyColor;

    connectedCallback(){
        this.showServices();
        this.showAdminReply();
    }
     showServices(){
        showServices()
        .then((result)=>{
            console.log('rein',result);
            this.showServiceData = result;
            console.log('this.showServicess',this.showServiceData);
            // this.colorCondition = this.showServiceData.filter(item=>item.Room__r.Name == 'RN-0002');
            // if (this.colorCondition.length >= 1) {
            //     this.applyColor = 'background-red';
            //     console.log('this.applycol',this.applyColor);
            // }
        console.log('this.colorCondition', this.colorCondition);
        }).catch(error=>{
            console.log('errrrror',error.message.body);
        })
        
     }

     //reply Functionality
     @track serviceId;
     @track showForm = false;
     handleReplyButton(event){
        this.showForm = !this.showForm;
        const recordId = event.currentTarget.dataset.id;
        this.serviceId = recordId;
        console.log('this service Id',recordId);
     }

     @track replyValue;
     replyValueChange(event){
        this.replyValue = event.target.value;
        console.log(this.replyValue)
     }

     handleReplySubmit(){
        insertAdminReply({replyValue:this.replyValue,serviceId:this.serviceId})
        .then(result=>{
            alert(result);
            this.replyValue ='';
            this.showAdminReply();
        }).catch(error=>{
            console.log(error.message.body);
        })
     }

     //show reply
     @track showReply
     showAdminReply(){
        showAdminReply()
        .then(result=>{
            this.showReply = result;
        }).catch(error=>{
            console.log(error);
        })
     }


}